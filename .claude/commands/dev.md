# Automated Dev Cycle

Đọc file `TASKS.md` trong thư mục gốc, tìm task tiếp theo có trạng thái `[ ]`, rồi thực thi toàn bộ vòng lặp:

## Quy trình bắt buộc (theo thứ tự):

### 1. READ TASK
- Đọc `TASKS.md`, lấy task `[ ]` đầu tiên
- Hiểu rõ yêu cầu, acceptance criteria, file liên quan
- Nếu không có task nào → báo "No pending tasks" và dừng

### 2. PLAN
- Dùng EnterPlanMode để phân tích codebase
- Xác định: files cần sửa, approach, potential side effects
- Tạo TaskList để track tiến độ
- Chỉ tiến hành sau khi plan rõ ràng

### 3. CODE
- Implement đúng theo plan đã duyệt
- Đọc file trước khi sửa
- Không thêm code không cần thiết
- Tuân thủ patterns đang có trong codebase

### 4. TEST
- Chạy: `pnpm --filter web-client test --run` (unit tests)
- Nếu có lỗi TypeScript: `pnpm --filter web-client typecheck`
- Build check: `pnpm --filter web-client build`

### 5. FIX (nếu test fail)
- Đọc output lỗi
- Fix từng lỗi một
- Chạy lại test sau mỗi lần fix
- Tối đa 3 vòng fix, nếu vẫn fail → báo cáo vấn đề, không commit

### 6. COMMIT
- Chỉ commit khi tất cả tests pass
- Cập nhật trạng thái task trong `TASKS.md`: `[ ]` → `[x]`
- Format commit message: `type(scope): description`
- Dùng `/git:cm` để commit

### 7. REPORT
- Tóm tắt những gì đã làm
- Liệt kê files đã thay đổi
- Nêu task tiếp theo (nếu có)

---

**Lưu ý quan trọng:**
- KHÔNG bao giờ commit khi có test fail
- KHÔNG tự ý thêm feature ngoài scope của task
- Nếu task mơ hồ → hỏi lại trước khi code
