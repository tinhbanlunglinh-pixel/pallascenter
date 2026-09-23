# 🔐 Hướng dẫn Quản lý Tài khoản & Mật khẩu (User & Password)

Thư mục này chứa danh sách các tài khoản đăng nhập của **Giáo viên** và **Học sinh**.

---

## 📍 File cấu hình chính:
👉 **[`accounts/credentials.ts`](file:///e:/2026/App/5.%20english-pallas%20-%20copy%20%28m%E1%BB%9Bi%29/accounts/credentials.ts)**

---

## 🔑 Tài khoản mặc định sẵn có:

### 1. Tài khoản Giáo viên (Teacher)
- **Tên đăng nhập (Username)**: `Ms. Trang` (hoặc `trang`, `admin`)
- **Mật khẩu (Password)**: `123` (hỗ trợ cả `88889999`)
- **Quyền hạn**: Soạn bài tập AI, quản lý danh sách học sinh theo lớp, tổng hợp kết quả và xem Bảng Vàng vinh danh.

### 2. Tài khoản Học sinh (Student)
- **Tên đăng nhập (Username)**: `hocsinh` (hoặc `alex`)
- **Mật khẩu (Password)**: `123` (Học sinh Pallas Alex - Lớp Pallas Star)

---

## 🛠️ Cách thay đổi hoặc thêm tài khoản mới:

1. Mở file `accounts/credentials.ts`.
2. Tìm đến mục tài khoản bạn muốn sửa:
   - Thay đổi `username`: Tên đăng nhập mới.
   - Thay đổi `password`: Mật khẩu mới.
   - Thay đổi `name`: Tên hiển thị của cô giáo hoặc học sinh.
3. Để **thêm tài khoản mới**, bạn chỉ cần copy 1 khối tài khoản và dán tiếp vào danh sách:
   ```typescript
   {
     id: 'student_lananh',
     username: 'lananh',
     password: '123',
     role: 'student',
     name: 'Đặng Lan Anh',
     avatar: '🌻',
     className: 'Lớp 6A1'
   },
   ```
4. Nhấn **Ctrl + S** để lưu lại file. Tải lại trang web là tài khoản mới sẽ có hiệu lực ngay lập tức!
