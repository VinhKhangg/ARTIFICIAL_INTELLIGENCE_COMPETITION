// components/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 24, 
  text = "Đang tải...", 
  className = "",
  centered = false 
}) => {
  const containerClass = `loading-container ${className} ${centered ? 'centered' : ''}`;

  return (
    <div className={containerClass}>
      <Loader2 size={size} className="loading-spinner" />
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};

// Các variant khác nhau của loading spinner
export const FullPageLoader = ({ text = "Đang khởi tạo ứng dụng..." }) => (
  <div className="fullpage-loader">
    <LoadingSpinner size={48} text={text} centered />
  </div>
);

export const ButtonLoader = ({ size = 16, text = "" }) => (
  <LoadingSpinner size={size} text={text} className="button-loader" />
);

export const InlineLoader = ({ size = 16, text = "Đang xử lý..." }) => (
  <LoadingSpinner size={size} text={text} className="inline-loader" />
);

export default LoadingSpinner;