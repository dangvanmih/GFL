Cấu trúc thư mục:
src/
├── assets/             # Chứa tài nguyên tĩnh (Hình ảnh, logo Petrolimex/Skypec, icons...)
├── components/         # Các Component dùng chung, có tính tái sử dụng cao (Reusability)
│   ├── CardTemplate.tsx  # Component khung hình chữ nhật bo góc mô phỏng chiếc thẻ vật lý
│   └── CustomButton.tsx  # Nút bấm custom dựa trên Button của MUI
├── config/             # Cấu hình hệ thống (Biến môi trường, cấu hình Axios...)
├── constants/          # Định nghĩa các hằng số cố định (Danh sách hãng xăng dầu, các loại xe...)
├── layouts/            # Khung giao diện chính (MainLayout gồm Sidebar, Header, Bốt bảo vệ layout)
│   └── SecurityLayout.tsx
├── pages/              # Quản lý các màn hình/giao diện chính của ứng dụng
│   ├── Dashboard/      # Màn hình tổng quan, theo dõi lịch sử ra vào
│   ├── VehicleIn/      # Màn hình Check-in (Có Form quét CCCD, chọn Hãng)
│   └── VehicleOut/     # Màn hình Check-out (Chia 2 cột đối chiếu dữ liệu)
├── routes/             # Cấu hình định tuyến đường dẫn (React Router)
├── services/           # Nơi quản lý các hàm gọi API đến Backend
├── theme/              # Cấu hình giao diện, màu sắc chủ đạo của Material UI (MUI Theme)
│   └── index.ts
├── types/              # Nơi định nghĩa các kiểu dữ liệu (Interface/Type) của TypeScript
│   └── vehicle.ts      # Định nghĩa kiểu dữ liệu cho Xe, Tài xế, Lịch sử Log...
├── App.tsx             # Component gốc của ứng dụng
└── main.tsx            # File entry point để render React vào DOM

lib install:
@mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom

// Luồng hoạt động:
[ BẢO VỆ ]
    │
    ▼ (1) Click nút "Thêm CCCD" & Chọn file
 ┌────────────────────────────────────────────────────────┐
 │ FRONT-END (React.js)                                   │
 ├────────────────────────────────────────────────────────┤
 │ • Tạo link hiển thị ảnh tạm thời (URL.createObjectURL)  │
 │ • Đóng gói file vào FormData: append('image', file)    │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │ (2) POST /ocr/cccd (Gửi kèm FormData)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ BIÊN GIỚI BẢO MẬT (CORS Middleware)                    │
 ├────────────────────────────────────────────────────────┤
 │ • Kiểm tra xem cổng 5173 có được phép gọi không       │
 │ • Nếu OK -> Cấp "thẻ thông hành" và cho đi tiếp        │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │ (3) Khớp đúng key 'image'
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ BACK-END (FastAPI Python)                              │
 ├────────────────────────────────────────────────────────┤
 │ • Bốc file ảnh ra, lưu vào thư mục /uploads            │
 │ • Chuyển đường dẫn ảnh sang hàm extract_cccd(file)     │
 │ • Mô hình AI (OCR) quét ảnh và dịch thành TEXT         │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │ (4) Trả về chuỗi JSON (Mã 200 OK)
                            │     { "status": "SUCCESS", "data": {...} }
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ FRONT-END (Nhận phản hồi & Render)                     │
 ├────────────────────────────────────────────────────────┤
 │ • Nhận data chữ từ AI (id, name, birth, place...)      │
 │ • Trộn chung với link ảnh tạm thời ở Bước 1            │
 │ • setVehicleData() -> Kích hoạt cập nhật State         │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼ (5) Giao diện thay đổi (Re-render)
 [ MÀN HÌNH BỐT BẢO VỆ HIỂN THỊ DÀN 3 CỘT REAL-TIME ]

## MUI Components

### 1. Nhóm Bố Cục & Khung Sườn (Layout)

Đây là những component dùng để xây dựng cấu trúc, chia cột và định hình giao diện (giống như cách bạn vừa dùng cho hệ thống giám sát xe).

* **`Box`** : Component vạn năng, mặc định là thẻ `<div>`. Nó là "vua" trong MUI dùng để custom CSS nhanh qua thuộc tính `sx` (như `display: 'flex'`, `margin`, `padding`).
* **`Container`** : Giới hạn chiều rộng của trang web theo các chuẩn màn hình (sm, md, lg, xl) để nội dung không bị tràn ra mép màn hình lớn.
* **`Grid` (hoặc `Grid2` bản mới)** : Hệ thống chia cột (12 columns) vô cùng mạnh mẽ để làm giao diện đáp ứng (Responsive) trên cả điện thoại và máy tính.
* **`Stack`** : Dùng để xếp các phần tử con theo một hàng dọc hoặc hàng ngang với khoảng cách đều nhau (`spacing`) rất nhanh chóng.

### 2. Nhóm Điều Hướng (Navigation)

Giúp người dùng di chuyển giữa các trang hoặc các tính năng trong hệ thống.

* **`AppBar` & `Toolbar`** : Thanh tiêu đề/Menu cố định ở trên cùng của trang web (Header).
* **`Drawer`** : Thanh menu bên cạnh (Sidebar) có thể trượt ra/vào hoặc cố định, chuyên dùng cho các trang Dashboard quản trị.
* **`Tabs` & `Tab`** : Thanh chuyển đổi qua lại giữa các tab nội dung trong cùng một trang.
* **`Link`** : Custom lại thẻ `<a>` mặc định theo chuẩn thiết kế của Material Design.

### 3. Nhóm Nhập Liệu (Inputs)

Hầu như dự án nào cũng cần form để thu thập dữ liệu từ người dùng.

* **`Button`** : Nút bấm (có các dạng `contained` - tô đậm, `outlined` - viền, `text` - chỉ có chữ).
* **`TextField`** : Ô nhập dữ liệu (Input) cực kỳ thông minh, tự động xử lý hiệu ứng kéo nhãn (`label`) lên trên khi người dùng click vào.
* **`Select`** : Menu thả xuống (Dropdown) để chọn một hoặc nhiều lựa chọn.
* **`Checkbox` / `Radio` / `Switch`** : Các nút tích chọn, chọn 1 trong nhiều, hoặc công tắc bật/tắt (On/Off).

### 4. Nhóm Hiển Thị Dữ Liệu (Data Display)

Dùng để trình bày thông tin một cách trực quan, đẹp mắt.

* **`Typography`** : Quản lý toàn bộ chữ nghĩa, văn bản (thay thế cho `<h1>`, `<h2>`, `<p>`, `<span>`) để đảm bảo font chữ và kích thước đồng bộ.
* **`Table`** : Hệ thống bảng dữ liệu (Bao gồm `TableHead`, `TableBody`, `TableCell`, `TableRow`) để làm các danh sách quản lý.
* **`List` & `ListItem`** : Danh sách dạng dòng (như danh sách các menu ở Sidebar trong code của bạn).
* **`Card`** : Thẻ bọc nội dung (gồm `CardContent`, `CardActions`, `CardHeader`), rất hay dùng để làm danh sách sản phẩm, tin tức.
* **`Avatar`** : Hiển thị ảnh đại diện hình tròn hoặc hình vuông của người dùng.
* **`Chip`** : Các thẻ tag nhỏ (ví dụ: hiển thị trạng thái "Đang hoạt động" màu xanh, "Đã khóa" màu đỏ).

### 5. Nhóm Phản Hồi & Thông Báo (Feedback)

Tương tác và đưa ra phản hồi cho hành động của người dùng.

* **`CircularProgress` / `LinearProgress`** : Biểu tượng xoay tròn hoặc thanh chạy ngang báo hiệu hệ thống đang tải dữ liệu (Loading).
* **`Dialog`** : Hộp thoại Pop-up hiện lên giữa màn hình yêu cầu xác nhận (ví dụ: "Bạn có chắc chắn muốn xóa không?").
* **`Snackbar` & `Alert`** : Thanh thông báo nhỏ tự động bật lên ở góc màn hình rồi ẩn đi (ví dụ: "Lưu thành công!", "Đã có lỗi xảy ra").
