import { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { FullPageLoader } from './components/LoadingSpinner';
import ApiService from './services/api';
import { cleanIngredientsList } from './utils/helpers';
import { LOADING_MESSAGES } from './config/constants';
import './styles/App.css';
import './styles/components.css';
import './styles/enhanced.css';

const FoodDetectionApp = () => {
  // State management
  const [uploadedImages, setUploadedImages] = useState([]);
  const [allDetectedIngredients, setAllDetectedIngredients] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [multipleRecipes, setMultipleRecipes] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // New state for vector database features
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [contextUsed, setContextUsed] = useState(false);
  const [vectorDbAvailable, setVectorDbAvailable] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setProcessingStatus('Đang khởi tạo ứng dụng...');
        
        // Test vector database availability
        const vectorDbTest = await ApiService.testVectorDatabase();
        setVectorDbAvailable(vectorDbTest.available);
        
        if (vectorDbTest.available) {
          console.log('✅ Vector database is available');
        } else {
          console.warn('⚠️ Vector database unavailable:', vectorDbTest.message);
        }
        
        // Load saved state from localStorage if needed
        const savedIngredients = localStorage.getItem('saved-ingredients');
        if (savedIngredients) {
          try {
            const parsed = JSON.parse(savedIngredients);
            if (Array.isArray(parsed)) {
              setAllDetectedIngredients(cleanIngredientsList(parsed));
            }
          } catch (error) {
            console.warn('Failed to load saved ingredients:', error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitializing(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // Save ingredients to localStorage when they change
  useEffect(() => {
    if (allDetectedIngredients.length > 0) {
      localStorage.setItem('saved-ingredients', JSON.stringify(allDetectedIngredients));
    }
  }, [allDetectedIngredients]);

  // Start chat session when recipe is ready
  useEffect(() => {
    const startChatSession = async () => {
      if (!currentRecipe || !allDetectedIngredients.length) return;

      try {
        const newSessionId = await ApiService.startChatSession(
          allDetectedIngredients, 
          currentRecipe
        );
        
        if (newSessionId) {
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error('Failed to start chat session:', error);
      }
    };
    
    if (currentRecipe && allDetectedIngredients.length && !sessionId) {
      startChatSession();
    }
  }, [currentRecipe, allDetectedIngredients, sessionId]);

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        ApiService.endChatSession(sessionId).catch(console.error);
      }
    };
  }, [sessionId]);

  // Reset all states to start new session
  const handleStartNew = async () => {
    try {
      // End existing session if any
      if (sessionId) {
        await ApiService.endChatSession(sessionId);
      }
      
      // Reset all states
      setUploadedImages([]);
      setAllDetectedIngredients([]);
      setCurrentRecipe(null);
      setMultipleRecipes([]);
      setSelectedRecipeIndex(0);
      setChatMessages([]);
      setIsProcessing(false);
      setIsGeneratingRecipe(false);
      setShowChat(false);
      setSessionId(null);
      setIsStreaming(false);
      setSimilarRecipes([]);
      setContextUsed(false);
      setProcessingStatus('');
      
      // Clear localStorage if any
      localStorage.removeItem('saved-ingredients');
      localStorage.removeItem('saved-recipe');
      
      console.log('🔄 Started new session - all data cleared');
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };

  // Enhanced recipe generation with vector database integration
  const handleGenerateRecipe = async () => {
    if (allDetectedIngredients.length === 0) return;

    setIsProcessing(true);
    setIsGeneratingRecipe(true);
    setProcessingStatus(LOADING_MESSAGES.PROCESSING);
    setSimilarRecipes([]);
    setContextUsed(false);
    setMultipleRecipes([]);
    setSelectedRecipeIndex(0);
    
    // End existing session if any
    if (sessionId) {
      try {
        await ApiService.endChatSession(sessionId);
        setSessionId(null);
      } catch (error) {
        console.warn('Failed to end previous session:', error);
      }
    }

    try {
      // Clean ingredients list before processing
      const cleanedIngredients = cleanIngredientsList(allDetectedIngredients);
      setAllDetectedIngredients(cleanedIngredients);

      setProcessingStatus('Đang tạo 3 công thức từ nguyên liệu của bạn...');
      
      // Generate 3 recipes với enhanced context
      const recipeResult = await ApiService.generateRecipe(cleanedIngredients);
      
      if (recipeResult.success && recipeResult.recipes && recipeResult.recipes.length > 0) {
        setMultipleRecipes(recipeResult.recipes);
        setCurrentRecipe(recipeResult.recipes[0].full_text); // Set recipe đầu tiên làm mặc định
        setContextUsed(recipeResult.has_context || false);
        
        // Success message
        const contextMessage = recipeResult.has_context 
          ? `Tôi đã tạo ${recipeResult.total_recipes} công thức từ ${cleanedIngredients.length} nguyên liệu của bạn và tham khảo các công thức tương tự để đưa ra gợi ý tốt nhất!`
          : `Tôi đã tạo ${recipeResult.total_recipes} công thức từ ${cleanedIngredients.length} nguyên liệu của bạn!`;

        setChatMessages([{
          type: 'bot',
          content: contextMessage + ' Bạn có thể chọn công thức khác hoặc hỏi thêm chi tiết gì không?',
          timestamp: new Date(),
          isComplete: true
        }]);
        
      } else {
        throw new Error('Không thể tạo công thức. Vui lòng thử lại.');
      }

      // Auto-show chat after recipe generation
      setShowChat(true);
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      setChatMessages([{
        type: 'bot',
        content: 'Xin lỗi, có lỗi khi tạo công thức. Vui lòng kiểm tra kết nối internet và thử lại sau.',
        timestamp: new Date(),
        isComplete: true,
        isError: true
      }]);
    } finally {
      setIsProcessing(false);
      setIsGeneratingRecipe(false);
      setProcessingStatus('');
    }
  };

  // Handle recipe selection
  const handleRecipeSelect = async (index) => {
    if (multipleRecipes[index] && index !== selectedRecipeIndex) {
      setSelectedRecipeIndex(index);
      const selectedRecipe = multipleRecipes[index].full_text;
      setCurrentRecipe(selectedRecipe);
      
      // End current chat session and start new one with selected recipe
      if (sessionId) {
        try {
          await ApiService.endChatSession(sessionId);
          setSessionId(null);
        } catch (error) {
          console.warn('Failed to end previous session:', error);
        }
      }
      
      // Clear chat messages to start fresh
      setChatMessages([{
        type: 'bot',
        content: `Đã chuyển sang công thức "${multipleRecipes[index].title}". Bạn có muốn hỏi gì về món này không?`,
        timestamp: new Date(),
        isComplete: true
      }]);
      
      // Start new chat session with the selected recipe
      try {
        const newSessionId = await ApiService.startChatSession(
          allDetectedIngredients, 
          selectedRecipe
        );
        
        if (newSessionId) {
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error('Failed to start new chat session for selected recipe:', error);
      }
    }
  };

  // Handle quick question click with enhanced streaming
  const handleQuickQuestion = async (questionObj) => {
    if (!questionObj || !questionObj.question || !sessionId || isStreaming) return;
    
    setShowChat(true);
    
    const userMessage = {
      type: 'user',
      content: questionObj.question,
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
      const response = await ApiService.createStreamingResponse(sessionId, questionObj.question);
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
              content: `Có lỗi khi kết nối server: ${error.message}. Vui lòng thử lại sau.`, 
              isComplete: true,
              isError: true 
            }
          : msg
      ));
      setIsStreaming(false);
    }
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return <FullPageLoader text="Đang khởi tạo ứng dụng..." />;
  }

  return (
    <ErrorBoundary>
      <div className="food-app">
        <LeftPanel 
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          allDetectedIngredients={allDetectedIngredients}
          setAllDetectedIngredients={setAllDetectedIngredients}
          isProcessing={isProcessing}
          processingStatus={processingStatus}
          onGenerateRecipe={handleGenerateRecipe}
          onStartNew={handleStartNew}
          vectorDbAvailable={vectorDbAvailable}
        />
        
        <RightPanel 
          currentRecipe={currentRecipe}
          multipleRecipes={multipleRecipes}
          selectedRecipeIndex={selectedRecipeIndex}
          onRecipeSelect={handleRecipeSelect}
          allDetectedIngredients={allDetectedIngredients}
          sessionId={sessionId}
          showChat={showChat}
          setShowChat={setShowChat}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          onQuestionClick={handleQuickQuestion}
          similarRecipes={similarRecipes}
          contextUsed={contextUsed}
          isGeneratingRecipe={isGeneratingRecipe}
        />
      </div>
    </ErrorBoundary>
  );
};

export default FoodDetectionApp;