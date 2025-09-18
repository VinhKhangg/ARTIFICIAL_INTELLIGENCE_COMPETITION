// components/SimilarRecipes.jsx - Component hiển thị công thức tương tự
import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Star } from 'lucide-react';

const SimilarRecipes = ({ 
  similarRecipes = [], 
  contextUsed = false,
  isVisible = false,
  onToggle = () => {}
}) => {
  const [expandedRecipes, setExpandedRecipes] = useState({});

  if (!similarRecipes || similarRecipes.length === 0) {
    return null;
  }

  const toggleRecipeExpansion = (index) => {
    setExpandedRecipes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatRecipeText = (text) => {
    // Truncate text và format cho display
    if (text.length <= 200) return text;
    return text.substring(0, 200) + '...';
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 0.8) return 'text-green-600 bg-green-100';
    if (similarity >= 0.6) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getSimilarityLabel = (similarity) => {
    if (similarity >= 0.8) return 'Rất giống';
    if (similarity >= 0.6) return 'Khá giống';
    return 'Tương tự';
  };

  return (
    <div className="similar-recipes-section">
      {/* Toggle Header */}
      <button
        className="similar-recipes-toggle"
        onClick={onToggle}
      >
        <div className="toggle-content">
          <BookOpen size={16} className="toggle-icon" />
          <span className="toggle-text">
            Công thức tham khảo ({similarRecipes.length})
            {contextUsed && <span className="context-badge">Đã sử dụng</span>}
          </span>
        </div>
        {isVisible ? (
          <ChevronUp className="chevron-icon" size={16} />
        ) : (
          <ChevronDown className="chevron-icon" size={16} />
        )}
      </button>

      {/* Similar Recipes Content */}
      <div className={`similar-recipes-content ${isVisible ? 'visible' : 'hidden'}`}>
        {contextUsed && (
          <div className="context-info">
            <div className="context-info-content">
              <Star size={14} className="context-star" />
              <span>Đã sử dụng {similarRecipes.length} công thức này để tạo gợi ý tốt hơn</span>
            </div>
          </div>
        )}

        <div className="recipes-list">
          {similarRecipes.map((recipeData, index) => {
            const isExpanded = expandedRecipes[index];
            const { recipe, similarity, query_used } = recipeData;

            return (
              <div key={index} className="recipe-item">
                {/* Recipe Header */}
                <div className="recipe-header">
                  <div className="recipe-meta">
                    <span className={`similarity-badge ${getSimilarityColor(similarity)}`}>
                      {getSimilarityLabel(similarity)} ({Math.round(similarity * 100)}%)
                    </span>
                    {query_used && (
                      <span className="query-badge">
                        Tìm từ: "{query_used}"
                      </span>
                    )}
                  </div>
                  
                  <button
                    className="expand-btn"
                    onClick={() => toggleRecipeExpansion(index)}
                  >
                    {isExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>

                {/* Recipe Content */}
                <div className="recipe-content">
                  <div className="recipe-text">
                    {isExpanded ? recipe : formatRecipeText(recipe)}
                  </div>
                  
                  {recipe.length > 200 && (
                    <button
                      className="show-more-btn"
                      onClick={() => toggleRecipeExpansion(index)}
                    >
                      {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!contextUsed && (
          <div className="no-context-info">
            <p>Những công thức này có thể hữu ích cho bạn tham khảo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarRecipes;