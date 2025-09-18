import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import QuickQuestions from './QuickQuestions';
import ChatSystem from './ChatSystem';
import SimilarRecipes from './SimilarRecipes';
import CookingTips from './CookingTips';

const RightPanel = ({
  currentRecipe,
  multipleRecipes = [],
  selectedRecipeIndex = 0,
  onRecipeSelect,
  allDetectedIngredients,
  sessionId,
  showChat,
  setShowChat,
  chatMessages,
  setChatMessages,
  isStreaming,
  setIsStreaming,
  onQuestionClick,
  // New props for similar recipes
  similarRecipes = [],
  contextUsed = false,
  recipeGenerationInfo = null,
  isGeneratingRecipe = false
}) => {
  const [showSimilarRecipes, setShowSimilarRecipes] = useState(false);

  const handleToggleSimilarRecipes = () => {
    setShowSimilarRecipes(prev => !prev);
  };

  return (
    <div className="right-panel">
      <div className="recipe-header">
        <h2>Công Thức Món Ăn</h2>
        {allDetectedIngredients.length > 0 ? (
          <div className="recipe-meta-info">
            <p>Được tạo từ {allDetectedIngredients.length} nguyên liệu</p>
          </div>
        ) : (
          <p>Chưa phát hiện nguyên liệu nào</p>
        )}
      </div>
      
      {/* Cooking Tips - Hiển thị khi đang tạo công thức */}
      <CookingTips isVisible={isGeneratingRecipe} />
      
      {currentRecipe ? (
        <>
          {/* Recipe Tabs - Hiển thị khi có nhiều công thức */}
          {multipleRecipes.length > 1 && (
            <div className="recipe-tabs">
              {multipleRecipes.map((recipe, index) => (
                <button
                  key={index}
                  className={`recipe-tab ${index === selectedRecipeIndex ? 'active' : ''}`}
                  onClick={() => onRecipeSelect(index)}
                  disabled={isStreaming}
                >
                  <span className="tab-number">{index + 1}</span>
                  <span className="tab-title">{recipe.title}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="recipe-content">
            <div className="recipe-text">{currentRecipe}</div>
          </div>

          {/* Similar Recipes Section - Hiển thị nếu có */}
          {similarRecipes && similarRecipes.length > 0 && (
            <SimilarRecipes
              similarRecipes={similarRecipes}
              contextUsed={contextUsed}
              isVisible={showSimilarRecipes}
              onToggle={handleToggleSimilarRecipes}
            />
          )}
          
          <QuickQuestions 
            onQuestionClick={onQuestionClick}
            isStreaming={isStreaming}
            sessionId={sessionId}
          />

          <ChatSystem 
            sessionId={sessionId}
            showChat={showChat}
            setShowChat={setShowChat}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
          />
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-content">
            <CircleAlert className="empty-icon" />
            <p className="empty-title">Đây chỉ là website demo, không có chức năng thực sự.</p>
            <p className="empty-subtitle">Vui lòng liên hệ với tôi để biết thêm chi tiết.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;