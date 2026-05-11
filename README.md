# Dreamina Seedance 2 Watermark Removal

Repo này tổng hợp thông tin về **Dreamina Seedance 2 Watermark Removal**.

## 🌐 Website

Truy cập web tại: **https://nobadge-seven.vercel.app/**

## 📌 Thông tin dự án

- **Tên dự án:** Dreamina Seedance 2 Watermark Removal
- **Mục tiêu:** Cung cấp trang thông tin và truy cập nhanh đến dịch vụ
- **Nền tảng web:** Vercel
- **Link chính thức:** https://nobadge-seven.vercel.app/

## 🚀 Cách sử dụng

### 1) Dùng website

1. Mở trình duyệt.
2. Truy cập: https://nobadge-seven.vercel.app/
3. Sử dụng các chức năng có sẵn trên trang web.

### 2) Dùng CLI JavaScript (xử lý ảnh local)

Yêu cầu: Node.js 18+

```bash
npm install
node src/cli.js --input ./input.png --output ./output.png --x 980 --y 700 --width 240 --height 100 --feather 8
```

Tham số:

- `--input`: đường dẫn ảnh đầu vào
- `--output`: đường dẫn ảnh đầu ra
- `--x`, `--y`: tọa độ góc trên trái vùng watermark
- `--width`, `--height`: kích thước vùng watermark
- `--feather` (tùy chọn, mặc định `6`): bán kính lấy mẫu pixel xung quanh để nội suy

## 📝 Ghi chú

- CLI hiện dùng nội suy pixel vùng lân cận để lấp vùng watermark được chỉ định.
- Kết quả phụ thuộc vào ảnh và vùng chọn, nên có thể cần tinh chỉnh tham số vùng + feather.
