// components/ChatSystem.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import ApiService from '../services/api';
import { UI_CONFIG } from '../config/constants';

const ChatSystem = ({ 
  sessionId,
  showChat,
  setShowChat,
  chatMessages,
  setChatMessages,
  isStreaming,
  setIsStreaming
}) => {
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Scroll to bottom when chatMessages change
  useEffect(() => {
    if (chatEndRef.current && showChat) {
      chatEndRef.current.scrollIntoView({ behavior: UI_CONFIG.SCROLL_BEHAVIOR });
    }
  }, [chatMessages, showChat]);

  // Stream chat with context memory
  const streamChatResponse = async (question) => {
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
              const jsonStr = line.slice(6); // Remove 'data: '
              const data = JSON.parse(jsonStr);
              
              if (data.type === 'chunk' && data.content) {
                // Update the bot message with new chunk
                setChatMessages(prev => prev.map((msg, idx) => 
                  idx === botMessageIndex
                    ? { ...msg, content: msg.content + data.content }
                    : msg
                ));
              } else if (data.type === 'done') {
                // Mark message as complete
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
        
        // Keep the last incomplete line in buffer
        buffer = lines[lines.length - 1];
      }
      
    } catch (error) {
      console.error('Streaming error:', error);
      
      // Update with error message
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
  };

  // Handle manual chat input
  const handleSendChat = async () => {
    if (!chatInput.trim() || !sessionId || isStreaming) return;

    const question = chatInput;
    setChatInput('');
    
    await streamChatResponse(question);
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  return (
    <>
      <button
        className="toggle-chat-btn"
        onClick={toggleChat}
      >
        {showChat ? (
          <>
            <ChevronUp className={`toggle-icon ${showChat ? 'rotated' : ''}`} size={20} />
            Ẩn Chat
          </>
        ) : (
          <>
            <ChevronDown className={`toggle-icon ${showChat ? '' : 'rotated'}`} size={20} />
            Hiện Chat
          </>
        )}
      </button>
      
      <div className={`chat-section ${showChat ? 'visible' : 'hidden'}`}>
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className={`message ${message.type} ${message.isError ? 'error' : ''}`}>
              <div className="message-content">
                {message.content ? message.content : "..."}
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="streaming-indicator">
              <Loader2 size={14} className="loading-spinner" style={{marginRight: '8px'}} />
              Đang trả lời...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className="chat-input">
          <div className="input-row">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder={isStreaming ? "Đang trả lời..." : "Hỏi chi tiết về cách làm..."}
              className="text-input"
              disabled={isStreaming || !sessionId}
            />
            <button
              onClick={handleSendChat}
              disabled={isStreaming || !chatInput.trim() || !sessionId}
              className="send-btn"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSystem;