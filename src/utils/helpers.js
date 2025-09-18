// utils/helpers.js
import { SUPPORTED_IMAGE_TYPES } from '../config/constants';

/**
 * Kiểm tra file có phải ảnh hợp lệ không
 */
export const isValidImageFile = (file) => {
  return file && SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Format file size thành string readable
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format timestamp thành string
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Debounce function để tránh gọi API quá nhiều
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Tạo unique ID
 */
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

/**
 * Validate ingredient name
 */
export const isValidIngredient = (ingredient) => {
  return ingredient && 
         typeof ingredient === 'string' && 
         ingredient.trim().length > 0 &&
         ingredient.trim().length <= 50;
};

/**
 * Clean và filter ingredients list
 */
export const cleanIngredientsList = (ingredients) => {
  return ingredients
    .filter(ingredient => isValidIngredient(ingredient))
    .map(ingredient => ingredient.trim())
    .filter((ingredient, index, array) => array.indexOf(ingredient) === index); // Remove duplicates
};

/**
 * Scroll to element với smooth behavior
 */
export const scrollToElement = (element, behavior = 'smooth') => {
  if (element) {
    element.scrollIntoView({ behavior });
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Format recipe text để hiển thị tốt hơn
 */
export const formatRecipeText = (recipeText) => {
  if (!recipeText) return '';
  
  // Basic formatting: ensure proper line breaks
  return recipeText
    .replace(/\n\n+/g, '\n\n') // Remove multiple empty lines
    .replace(/^\s+|\s+$/g, '') // Trim start and end
    .replace(/([.!?])\s*([A-Z])/g, '$1\n$2'); // Add line break after sentences
};

/**
 * Truncate text với ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Check if running on mobile device
 */
export const isMobileDevice = () => {
  return window.innerWidth <= 768;
};

/**
 * Local storage helpers với error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

/**
 * Error message helpers
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'Đã xảy ra lỗi không xác định';
};

/**
 * Retry function với exponential backoff
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Image file validation và compression helpers
 */
export const imageHelpers = {
  validateFile: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!file) {
      return { valid: false, error: 'Không có file được chọn' };
    }
    
    if (!isValidImageFile(file)) {
      return { valid: false, error: 'File không phải là ảnh hợp lệ' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File quá lớn (tối đa 10MB)' };
    }
    
    return { valid: true };
  },
  
  createPreview: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};