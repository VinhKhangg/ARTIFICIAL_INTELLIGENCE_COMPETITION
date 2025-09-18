// config/constants.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000', // Adjust based on your backend URL
  ENDPOINTS: {
    DETECT: '/detect',
    GENERATE_RECIPE: '/generate-recipe',
    START_CHAT: '/start-chat',
    CHAT_STREAM: '/chat-stream',
    END_CHAT: '/end-chat'
  }
};

export const COMMON_QUESTIONS = [
  {
    text: "Thời gian nấu bao lâu?",
    question: "Thời gian nấu món này mất bao lâu?",
    category: "time",
    icon: "Clock"
  },
  {
    text: "Dùng lửa to hay nhỏ?",
    question: "Nên dùng lửa to hay lửa nhỏ khi nấu?",
    category: "technique", 
    icon: "Flame"
  },
  {
    text: "Đủ cho mấy người?",
    question: "Công thức này đủ cho bao nhiêu người ăn?",
    category: "portion",
    icon: "Users"
  },
  {
    text: "Có mẹo gì đặc biệt?",
    question: "Có mẹo nào để món ăn ngon hơn không?",
    category: "tips",
    icon: "HelpCircle"
  }
];

export const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpg', 
  'image/jpeg',
  'image/gif',
  'image/bmp',
  'image/webp'
];

export const UI_CONFIG = {
  PROCESSING_DELAY: 1500, // ms
  SCROLL_BEHAVIOR: 'smooth',
  MAX_IMAGES: 10
};

export const LOADING_MESSAGES = {
  PROCESSING: 'Đang xử lý...',
  DETECTING: 'Đang phát hiện nguyên liệu...',
  SEARCHING_SIMILAR: 'Đang tìm kiếm công thức tương tự...',
  GENERATING_RECIPE: 'Đang tạo công thức...',
  STARTING_CHAT: 'Đang khởi tạo chat...',
  CONNECTING: 'Đang kết nối...'
};

export const RECIPE_GENERATION_OPTIONS = {
  WITH_CONTEXT: 'enhanced',
  BASIC: 'basic',
  MULTIPLE: 'multiple'
};