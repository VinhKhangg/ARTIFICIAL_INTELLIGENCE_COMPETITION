// components/QuickQuestions.jsx
import { HelpCircle, Clock, Flame, Users } from 'lucide-react';
import { COMMON_QUESTIONS } from '../config/constants';

// Icon mapping
const iconMap = {
  Clock,
  Flame, 
  Users,
  HelpCircle
};

const QuickQuestions = ({ 
  onQuestionClick, 
  isStreaming, 
  sessionId 
}) => {
  const handleQuestionClick = (questionObj) => {
    if (!questionObj || !questionObj.question || !sessionId || isStreaming) return;
    onQuestionClick(questionObj);
  };

  return (
    <div className="quick-questions">
      <h4 className="quick-questions-title">
        <HelpCircle size={16} />
        Câu hỏi thường gặp
      </h4>
      <div className="quick-questions-grid">
        {COMMON_QUESTIONS.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <button
              key={index}
              className="quick-question-btn"
              onClick={() => handleQuestionClick(item)}
              disabled={isStreaming || !sessionId}
            >
              <IconComponent size={14} className="question-icon" />
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickQuestions;