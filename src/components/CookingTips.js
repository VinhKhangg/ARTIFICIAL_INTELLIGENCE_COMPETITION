import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const COOKING_RANDOM = [
  // Status / processing (8)
  "🔍 Đang phân tích nguyên liệu...",
  "🧠 AI đang suy nghĩ món ăn phù hợp...",
  "📦 Đang kiểm tra dữ liệu công thức...",
  "🍳 Đang tìm mẹo nấu ăn phù hợp...",
  "🍽️ Chuẩn bị bày món ra đĩa...",
  "⏳ Chờ chút, món ngon sắp xong...",
  "🔎 Đang dò tìm gia vị phù hợp...",
  "🛒 Đang chọn nguyên liệu bổ sung...",

  // Ingredient facts (8)
  "🍅 Cà chua có chứa lycopene - chất chống oxy hóa mạnh!",
  "🥕 Cà rốt giàu vitamin A, tốt cho mắt và da.",
  "🧄 Tỏi giúp tăng sức đề kháng và hương vị cho món ăn.",
  "🥬 Rau cải giàu chất xơ, giúp tiêu hóa tốt.",
  "🍋 Chanh chứa nhiều vitamin C, tăng hương vị tươi mát.",
  "🥔 Khoai tây giàu tinh bột, cung cấp năng lượng.",
  "🍄 Nấm chứa nhiều chất chống oxy hóa và vitamin D.",
  "🫘 Đậu nành giàu protein thực vật, tốt cho tim mạch.",

  // Cooking tips (8)
  "🔥 Luôn làm nóng chảo trước khi cho dầu để tránh thức ăn bị dính.",
  "🧄 Băm tỏi và để 10 phút trước khi nấu để tăng hương vị.",
  "🥩 Để thịt ở nhiệt độ phòng 30 phút trước khi nấu để chín đều.",
  "🧂 Nêm nếm từng bước thay vì nêm hết một lúc cuối.",
  "🔪 Dao sắc an toàn hơn dao cùn - luôn giữ dao sắc bén.",
  "🍳 Không lật thịt quá sớm, để một mặt chín hoàn toàn trước.",
  "🧊 Dùng nước đá để blanch rau xanh giữ màu đẹp.",
  "🍯 Thêm một chút mật ong để cân bằng vị chua của cà chua.",

  // Recipe previews (8)
  "🍜 Có thể là một món phở bò thơm ngon...",
  "🍲 Món canh chua cá lóc nóng hổi sẽ hợp với nguyên liệu này.",
  "🍛 Cơm cà ri gà béo ngậy và thơm mùi dừa.",
  "🥗 Salad rau củ tươi mát cho bữa trưa nhẹ nhàng.",
  "🥘 Lẩu thái chua cay cho ngày se lạnh.",
  "🍝 Mì Ý sốt cà chua tươi thơm nức.",
  "🥟 Bánh bao nhân thịt mềm xốp.",
  "🍱 Cơm hộp Nhật Bản đủ chất dinh dưỡng.",

  // Funny (8)
  "😂 Khi bạn nấu ăn, hãy luôn chuẩn bị một cái bụng đói!",
  "🙂 Hãy nhớ rằng, món ăn ngon nhất là món ăn được chia sẻ!",
  "🤔 Nếu món ăn không ngon, hãy thêm một chút yêu thương!",
  "🤣 Bí quyết giữ bếp sạch: đặt món ăn ngoài hàng! Đùa thôi, đã có tôi rồi",
  "😏 Muốn nấu nhanh? Gọi shipper là xong!",
  "😋 Món này ngon đến mức… phải tự ăn hết!",
  "🙃 Đừng sợ thất bại, mỗi lần cháy khét là một bài học!",
  "😅 Này bạn ơi, hãy đợi xíu… đầu bếp đang ăn thử!"
];

// Các icon đồ ăn để rơi xuống
const FOOD_ICONS = [
  "🍅", "🥕", "🧄", "🥬", "🍋", "🥔", "🍄", "🫘",
  "🍜", "🍲", "🍛", "🥗", "🥘", "🍝", "🥟", "🍱",
  "🍳", "🔥", "🧂", "🔪", "🥄", "🍯", "🧊", "🥩",
  "🍞", "🧀", "🥒", "🌶️", "🥑", "🍆", "🌽", "🥦"
];

const CookingTips = ({ isVisible = false }) => {
  const [currentTip, setCurrentTip] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [fallingIcons, setFallingIcons] = useState([]);

  useEffect(() => {
    if (!isVisible) {
      setFallingIcons([]);
      return;
    }

    // Tạo falling icon
    const createFallingIcon = () => {
      const icon = FOOD_ICONS[Math.floor(Math.random() * FOOD_ICONS.length)];
      const id = Date.now() + Math.random();
      const left = Math.random() * 100; // Random position từ 0-100%
      const duration = 7;
      const size = 16 + Math.random() * 16; // 16-32px
      const rotation = Math.random() * 360; // Random rotation
      
      return {
        id,
        icon,
        left: `${left}%`,
        duration: `${duration}s`,
        size: `${size}px`,
        rotation: `${rotation}deg`,
        delay: `${Math.random() * 2}s` // Random delay 0-2s
      };
    };

    // Set tip đầu tiên ngay lập tức
    const getRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * COOKING_RANDOM.length);
      return COOKING_RANDOM[randomIndex];
    };

    setCurrentTip(getRandomTip());

    // Thay đổi tip mỗi 3.5 giây
    const tipInterval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentTip(getRandomTip());
        setIsAnimating(false);
      }, 200); // Animation duration
    }, 3500);

    // Tạo falling icons mỗi 1-2 giây
    const createIcon = () => {
      const newIcon = createFallingIcon();
      setFallingIcons(prev => [...prev, newIcon]);
      
      // Xóa icon sau khi animation hoàn thành
      setTimeout(() => {
        setFallingIcons(prev => prev.filter(icon => icon.id !== newIcon.id));
      }, parseFloat(newIcon.duration) * 1000 + parseFloat(newIcon.delay) * 1000 + 1000);
    };

    // Bắt đầu tạo icons
    const iconInterval = setInterval(createIcon, 1000 + Math.random() * 2000); // 1-3 seconds
    
    // Tạo vài icons đầu tiên ngay lập tức
    setTimeout(createIcon, 500);
    setTimeout(createIcon, 1500);
    setTimeout(createIcon, 2500);

    return () => {
      clearInterval(tipInterval);
      clearInterval(iconInterval);
      setFallingIcons([]);
    };
  }, [isVisible]);

  if (!isVisible || !currentTip) return null;

  return (
    <div className="cooking-tips-container">
      {/* Falling Icons Background */}
      <div className="falling-icons-container">
        {fallingIcons.map(iconData => (
          <div
            key={iconData.id}
            className="falling-icon"
            style={{
              left: iconData.left,
              animationDuration: iconData.duration,
              animationDelay: iconData.delay,
              fontSize: iconData.size,
              transform: `rotate(${iconData.rotation})`
            }}
          >
            {iconData.icon}
          </div>
        ))}
      </div>

      {/* Tips Content */}
      <div className="cooking-tips-header">
        <Lightbulb size={16} className="tip-icon" />
        <span className="tip-label">Random Tip</span>
      </div>
      <div className={`cooking-tip ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {currentTip}
      </div>
    </div>
  );
};

export default CookingTips;
