# Ứng Dụng Nhận Diện Thực Phẩm & Tạo Công Thức Nấu Ăn

## Tổng quan
Ứng dụng AI thông minh giúp nhận diện nguyên liệu từ hình ảnh và tự động tạo ra các công thức nấu ăn phù hợp, hỗ trợ người dùng tận dụng tối đa thực phẩm có sẵn.

## Tính năng chính

### Nhận diện nguyên liệu thông minh
- **AI YOLO Detection**: Tải ảnh lên để tự động nhận diện nguyên liệu
- **Đa ngôn ngữ**: Nhận diện tiếng Anh, dịch sang tiếng Việt
- **Chỉnh sửa thủ công**: Điều chỉnh danh sách nguyên liệu đã phát hiện

### Tạo công thức thông minh
- **3 lựa chọn công thức**: Tạo 3 công thức khác nhau từ cùng nguyên liệu
- **Hướng dẫn chi tiết**: Từng bước nấu ăn cụ thể
- **Thông tin dinh dưỡng**: Thời gian nấu, khẩu phần, độ khó

### Trợ lý chat tương tác
- **Nhận biết ngữ cảnh**: Chat hiểu công thức đang xem
- **Hội thoại riêng**: Cuộc trò chuyện riêng cho từng món ăn
- **Câu hỏi nhanh**: Mẹo nấu ăn và FAQ có sẵn

## Công nghệ sử dụng

**Frontend**: React 18+, CSS Animation, Responsive Design
**Backend**: Flask Python, YOLO v8/v9, Vector Database
**AI/ML**: LM Studio (LLM), ChromaDB, Sentence Transformers

## Kiến trúc hệ thống

```
React Frontend ↔ Flask Backend ↔ AI Services
     ↓               ↓              ↓
• Upload ảnh     • YOLO Detection  • LM Studio
• Recipe Tabs    • Tạo công thức   • Vector DB
• Chat System    • Chat Sessions   • Embeddings
```

## Ứng dụng thực tế

✅ **Người nấu ăn tại nhà**: Biến nguyên liệu ngẫu nhiên thành bữa ăn hoàn chỉnh

✅ **Người yêu ẩm thực**: Khám phá phong cách nấu ăn đa dạng

✅ **Lập kế hoạch bữa ăn**: Sử dụng hiệu quả thức ăn thừa, giảm lãng phí

## Web demo
> [web-demo](https://lockman04.github.io/SavoryAI/)

## Hiệu suất

- **Độ chính xác nhận diện**: 85%+
- **Thời gian phản hồi**: <3s cho việc tạo công thức
- **Tính khả dụng**: Mục tiêu 99%+ uptime

## Phát triển tương lai

**Tính năng mới**: Chế độ ăn đặc biệt, phong cách ẩm thực, danh sách mua sắm

**Cải tiến kỹ thuật**: Tối ưu hóa hiệu suất, Docker, bảo mật nâng cao

---
**Phát triển bởi sinh viên trường NTTU <3**
