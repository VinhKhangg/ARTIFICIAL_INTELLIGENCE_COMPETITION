// components/ImageUpload.jsx
import { useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { SUPPORTED_IMAGE_TYPES, UI_CONFIG } from '../config/constants';
import ApiService from '../services/api';

const ImageUpload = ({ 
  uploadedImages, 
  setUploadedImages, 
  allDetectedIngredients, 
  setAllDetectedIngredients 
}) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = async (files) => {
    const fileList = Array.from(files);
    
    for (const file of fileList) {
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) continue;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        const imageId = Date.now() + Math.random();
        
        const newImage = {
          id: imageId,
          url: imageUrl,
          name: file.name,
          detecting: true,
          ingredients: []
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        
        // Simulate processing delay then detect
        setTimeout(async () => {
          try {
            const detected = await ApiService.detectIngredients(file);

            setUploadedImages(prev => prev.map(img =>
              img.id === imageId
                ? { ...img, detecting: false, ingredients: detected }
                : img
            ));
            
            setAllDetectedIngredients(prev => {
              const combined = [...prev, ...detected];
              return [...new Set(combined)];
            });
          } catch (error) {
            console.error('Detection error:', error);
            setUploadedImages(prev => prev.map(img =>
              img.id === imageId
                ? { ...img, detecting: false, ingredients: [] }
                : img
            ));
          }
        }, UI_CONFIG.PROCESSING_DELAY);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleRemoveImage = (imageId) => {
    setUploadedImages(prev => {
      const newImages = prev.filter(img => img.id !== imageId);
      // Cập nhật lại allDetectedIngredients dựa trên các hình còn lại
      const allIngredients = newImages.flatMap(img => img.ingredients || []);
      setAllDetectedIngredients([...new Set(allIngredients)]);
      return newImages;
    });
  };

  return (
    <div className="upload-section">
      <div className="upload-area">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="upload-box"
        >
          <Upload className="upload-icon" />
          <p className="upload-text">Click để chọn ảnh</p>
          <p className="upload-subtext">Có thể chọn nhiều ảnh cùng lúc</p>
        </div>
      </div>

      <div className="images-list">
        {uploadedImages.map((image) => (
          <div key={image.id} className="image-item">
            <div className="image-content">
              <img 
                src={image.url} 
                alt={image.name}
                className="image-thumbnail"
              />
              <div className="image-details">
                <p className="image-name">{image.name}</p>
                {image.detecting ? (
                  <div className="detecting">
                    <Loader2 size={16} className="loading-spinner" />
                    <span className="detecting-text">Đang phát hiện...</span>
                  </div>
                ) : image.ingredients.length === 0 ? (
                  <div className="ingredients-tags empty-ingredients">
                    <span className="empty-ingredient-text">Không nhận diện được món nào</span>
                  </div>
                ) : (
                  <div className="ingredients-tags">
                    {image.ingredients.map((ingredient, idx) => (
                      <span key={idx} className="ingredient-tag">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleRemoveImage(image.id)}
              className="remove-btn"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;