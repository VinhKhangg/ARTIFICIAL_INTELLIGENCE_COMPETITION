// components/IngredientsEditor.jsx
import { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

const IngredientsEditor = ({ 
  allDetectedIngredients, 
  setAllDetectedIngredients 
}) => {
  const [editingIngredients, setEditingIngredients] = useState(false);
  const [tempIngredients, setTempIngredients] = useState([]);

  const handleEditIngredients = () => {
    setTempIngredients([...allDetectedIngredients]);
    setEditingIngredients(true);
  };

  const handleSaveIngredients = () => {
    setAllDetectedIngredients(tempIngredients.filter(ing => ing.trim()));
    setEditingIngredients(false);
  };

  const handleCancelEdit = () => {
    setTempIngredients([]);
    setEditingIngredients(false);
  };

  const handleAddIngredient = () => {
    setTempIngredients([...tempIngredients, '']);
  };

  const handleRemoveIngredient = (index) => {
    setTempIngredients(tempIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...tempIngredients];
    updated[index] = value;
    setTempIngredients(updated);
  };

  return (
    <div className="ingredients-section">
      <div className="ingredients-header">
        <h3 className="ingredients-title">Tất cả nguyên liệu:</h3>
        {allDetectedIngredients.length > 0 && !editingIngredients && (
          <button
            onClick={handleEditIngredients}
            className="edit-btn"
          >
            <Edit3 size={12} />
            Sửa
          </button>
        )}
      </div>
      
      {editingIngredients ? (
        <div style={{ marginBottom: '16px' }}>
          {tempIngredients.map((ingredient, idx) => (
            <div key={idx} className="ingredient-edit-row">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(idx, e.target.value)}
                className="ingredient-input"
                placeholder="Tên nguyên liệu"
              />
              <button
                onClick={() => handleRemoveIngredient(idx)}
                className="remove-ingredient-btn"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <div className="edit-actions">
            <button
              onClick={handleAddIngredient}
              className="add-ingredient-btn"
            >
              + Thêm
            </button>
            <button
              onClick={handleSaveIngredients}
              className="save-btn"
            >
              <Check size={12} />
              Lưu
            </button>
            <button
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : allDetectedIngredients.length > 0 ? (
        <div className="all-ingredients">
          {allDetectedIngredients.map((ingredient, idx) => (
            <span key={idx} className="all-ingredient-tag">
              {ingredient}
            </span>
          ))}
        </div>
      ) : (
        <div className="all-ingredients empty-ingredients">
          <span className="empty-ingredient-text">Chưa có nguyên liệu nào</span>
        </div>
      )}
    </div>
  );
};

export default IngredientsEditor;