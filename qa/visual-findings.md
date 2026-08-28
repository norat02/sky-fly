# Visual QA findings

- **Mobile 390 × 844:** Layout chuyển sang form-first, ẩn hero desktop, logo compact ở đầu trang. Form full-width với khoảng đệm 20px, các ô input và nút đủ lớn để chạm, không thấy overflow ngang.
- **Tablet 834 × 1112:** Layout vẫn form-first nhưng card được mở rộng cân đối và giữ khoảng trắng lớn, logo compact vẫn hiển thị. Hero desktop chỉ bật từ breakpoint `lg`, giúp tablet không bị quá tải.
- **Desktop 1440 × 900:** Hero giới thiệu hiển thị bên trái, form bên phải. Bố cục tạo điểm nhấn rõ, card demo và headline không va chạm form.
- **Global:** Nền paper studio dùng grid rất nhẹ + radial accent; card chuyển từ viền sketch dày sang border mảnh, radius lớn và shadow mềm hơn.

Trang **Register** cũng đã được kiểm tra ở 390 × 844 và 1440 × 900. Trên mobile, bốn trường xếp một cột, nút CTA giữ kích thước chạm thoải mái và nội dung footer vẫn nằm trong viewport; trên desktop, Password và Confirm Password chuyển thành hai cột cân đối. Không ghi nhận overflow ngang hoặc lỗi runtime trong console.
