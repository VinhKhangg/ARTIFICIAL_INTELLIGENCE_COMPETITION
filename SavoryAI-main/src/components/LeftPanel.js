// components/LeftPanel.jsx
import { ChefHat, Loader2, RotateCcw } from 'lucide-react';
import ImageUpload from './ImageUpload';
import IngredientsEditor from './IngredientsEditor';

const LeftPanel = ({
  uploadedImages,
  setUploadedImages,
  allDetectedIngredients,
  setAllDetectedIngredients,
  isProcessing,
  onGenerateRecipe,
  onStartNew
}) => {
  return (
    <div className="left-panel">
      <div className="header">
        <div className="header-content">
          <ChefHat size={24} />
          <div>
            <h1>Nhận Diện Nguyên Liệu</h1>
            <p>Upload ảnh để AI phát hiện nguyên liệu</p>
          </div>
        </div>
      </div>

      <ImageUpload 
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        allDetectedIngredients={allDetectedIngredients}
        setAllDetectedIngredients={setAllDetectedIngredients}
      />

      <div className="bottom-section">
        <IngredientsEditor 
          allDetectedIngredients={allDetectedIngredients}
          setAllDetectedIngredients={setAllDetectedIngredients}
        />
        
        <div className="action-buttons">
          <button
            onClick={onStartNew}
            disabled={isProcessing}
            className="start-new-btn"
            title="Bắt đầu lại với ảnh mới"
          >
            <RotateCcw size={16} />
            Tạo mới
          </button>
          
          <button
            onClick={onGenerateRecipe}
            disabled={isProcessing || allDetectedIngredients.length === 0}
            className="generate-btn"
          >
            {isProcessing ? (
              <Loader2 size={16} className="loading-spinner" />
            ) : (
              <ChefHat size={16} />
            )}
            Tạo Công Thức Món Ăn
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;