// components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state để hiển thị fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Có thể gửi error lên monitoring service ở đây
    // reportErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <AlertTriangle size={48} color="#dc2626" />
            </div>
            
            <div className="error-details">
              <h2 className="error-title">Oops! Có lỗi xảy ra</h2>
              <p className="error-message">
                Ứng dụng đã gặp lỗi không mong muốn. Vui lòng thử lại hoặc tải lại trang.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-debug">
                  <summary>Chi tiết lỗi (Development)</summary>
                  <pre className="error-stack">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="error-actions">
              <button 
                className="retry-btn"
                onClick={this.handleRetry}
              >
                <RefreshCw size={16} />
                Thử lại
              </button>
              
              <button 
                className="reload-btn"
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;