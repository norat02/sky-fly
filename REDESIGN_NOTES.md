# Whisper UI redesign

Bản redesign chuyển Whisper từ phong cách sketchbook viền dày sang hướng **paper studio**: nền giấy ấm có grid rất nhẹ, typography DM Sans kết hợp Fraunces cho tiêu đề, màu mực navy làm nền tảng, coral làm điểm nhấn và các surface sáng có shadow mềm. Luồng xác thực, điều hướng và toàn bộ logic dữ liệu hiện có được giữ nguyên.

## Responsive behavior

| Thiết bị | Hành vi chính |
| --- | --- |
| Mobile, dưới 640px | Form-first, hero desktop được ẩn; input và CTA có touch target lớn; bottom navigation có safe-area; chat room full-bleed để tối đa không gian đọc/gõ. |
| Tablet, 640–1023px | Nội dung giữ chiều rộng đọc thoải mái, card mở rộng theo viewport; form xác thực vẫn tập trung; Register chuyển các trường mật khẩu về một cột ở màn hình hẹp và hai cột từ `sm`. |
| Desktop, từ 1024px | Auth dùng layout hai cột với hero preview; các trang list dùng container rộng hơn; Chat hiển thị sidebar phòng ở bên trái, chat card có khoảng thở và header action đầy đủ. |

## Files changed

`src/index.css` được thay mới design tokens, nền, card, button, typography, focus/selection state, safe-area và utility responsive. `src/components/AuthLayout.jsx` được thiết kế lại thành auth shell hai cột/compact. `src/components/BottomNav.jsx` được làm mới cho mobile-first navigation. Các shell và spacing của `Messages`, `Channels`, `Status`, `Profile`, `Settings` được đồng bộ. `Chat.jsx` và `ChatInput.jsx` được tối ưu cho chiều cao viewport, sidebar và composer trên từng nhóm thiết bị.

## Verification

Build production đã chạy thành công bằng `./node_modules/.bin/vite build`. Lint các tệp đã chỉnh sửa đã chạy thành công. Screenshot QA đã được tạo trong thư mục `qa/` cho Login ở 1440×900, 834×1112, 390×844 và Register ở 1440×900, 390×844. Không ghi nhận overflow ngang hoặc lỗi runtime trong console trên các màn hình xác thực đã kiểm tra.

## Run locally

```bash
pnpm install --no-frozen-lockfile
pnpm dev --host 0.0.0.0
```

Do source được cung cấp không kèm Git metadata và môi trường hiện tại không có `VITE_BASE44_APP_BASE_URL`, các thao tác backend cần cấu hình biến môi trường theo README gốc trước khi thử luồng dữ liệu thật.

## Multilingual translation update

Whisper hiện hỗ trợ **38 lựa chọn ngôn ngữ** trong selector, bao gồm English, Vietnamese, Spanish, Hindi/Hinglish, French, German, Japanese, Simplified/Traditional Chinese, Korean, Portuguese, Russian, Arabic, Italian, Turkish, Indonesian, Bengali, Urdu, Tamil, Telugu, Marathi, Dutch, Polish, Thai, Persian, Swedish, Ukrainian, Filipino, Malay, Hebrew, Greek, Czech, Romanian, Hungarian, Danish, Norwegian và Finnish.

Mỗi profile có `language` và `auto_translate`. `language` là ngôn ngữ đích của người đang xem; `auto_translate` mặc định bật cho profile mới. Khi người dùng đổi ngôn ngữ trong Quick Language hoặc Profile/Settings, lựa chọn được lưu local + backend và phát sự kiện nội bộ để các màn hình đang mở cập nhật ngay. Người dùng vẫn có thể tắt dịch tự động; nút dịch thủ công trong message bubble vẫn có thể dùng khi cần.

Luồng dịch sử dụng cache local, local lexicon, server SLM, web fallback hoặc provider API đã cấu hình. Bản dịch được tính theo từng người xem, vì vậy hai người trong cùng một phòng có thể đọc cùng một tin nhắn bằng hai ngôn ngữ khác nhau. Caption ảnh/video, view-once caption, câu hỏi và lựa chọn poll cũng đi qua cùng cơ chế này. Migration `supabase/migrations/20260827000000_enable_auto_translation_by_default.sql` cập nhật database default mà không ghi đè các lựa chọn `false` đã được người dùng lưu rõ ràng.
