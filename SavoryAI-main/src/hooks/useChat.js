// hooks/useChat.js
import { useState, useCallback } from 'react';
import ApiService from '../services/api';

export const useChat = (sessionId) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const streamChatResponse = useCallback(async (question, setChatMessages, chatMessages) => {
    if (!sessionId || !question.trim()) return;

    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Add empty bot message for streaming
    const botMessageIndex = chatMessages.length + 1;
    setChatMessages(prev => [...prev, {
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isComplete: false
    }]);
    
    setIsStreaming(true);
    
    try {
      const response = await ApiService.createStreamingResponse(sessionId, question);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Process complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);
              
              if (data.type === 'chunk' && data.content) {
                setChatMessages(prev => prev.map((msg, idx) => 
                  idx === botMessageIndex
                    ? { ...msg, content: msg.content + data.content }
                    : msg
                ));
              } else if (data.type === 'done') {
                setChatMessages(prev => prev.map((msg, idx) => 
                  idx === botMessageIndex
                    ? { ...msg, isComplete: true }
                    : msg
                ));
                setIsStreaming(false);
                return;
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error('Failed to parse streaming data:', parseError);
            }
          }
        }
        
        buffer = lines[lines.length - 1];
      }
      
    } catch (error) {
      console.error('Streaming error:', error);
      
      setChatMessages(prev => prev.map((msg, idx) => 
        idx === botMessageIndex
          ? { 
              ...msg, 
              content: `Có lỗi khi kết nối server: ${error.message}`, 
              isComplete: true,
              isError: true 
            }
          : msg
      ));
      setIsStreaming(false);
    }
  }, [sessionId]);

  return {
    isStreaming,
    setIsStreaming,
    streamChatResponse
  };
};