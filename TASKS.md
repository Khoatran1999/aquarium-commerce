# Task Backlog — AquaLuxe Commerce

> Format: `[ ]` = pending | `[x]` = done | `[-]` = skipped
> Gọi `/dev` để Claude tự chọn task tiếp theo và thực thi

---

## Đang chờ

- [x] **TASK-001** `feat(cart)`: Thêm animation khi add-to-cart (icon bay từ product card lên cart icon ở header)
  - File liên quan: `ProductCard.tsx`, `Header.tsx`
  - Dùng framer-motion AnimatePresence + motion.div
  - Acceptance: click "Add to Cart" → icon nhỏ fly lên header cart icon, số lượng tăng lên

- [ ] **TASK-002** `feat(search)`: Tạo search bar với debounce 300ms
  - File liên quan: `Header.tsx`, tạo mới `SearchBar.tsx`
  - Filter theo tên sản phẩm trong Redux store
  - Acceptance: gõ vào search → kết quả hiện sau 300ms không gọi API nhiều lần

- [ ] **TASK-003** `fix(homepage)`: Lazy load ảnh trong BestSellersSection
  - File liên quan: `BestSellersSection.tsx`, `ProductCard.tsx`
  - Thêm `loading="lazy"` và skeleton placeholder
  - Acceptance: ảnh chỉ load khi scroll vào viewport

---

## Hoàn thành

<!-- Tasks đã xong sẽ chuyển vào đây -->
