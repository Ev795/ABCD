# 📁 Thư mục Quản lý Models (`model/`)

Thư mục này lưu trữ các biến thể nhân vật 3D Voxel của dự án Project Boxer:

---

## 1. Model: `Joe` (Võ sĩ quyền anh hoàn chỉnh)
* **Mô tả**: Nhân vật võ sĩ thể hình Lean Boxer hoàn thiện 100% từ Bàn chân ($Y = 0.00\text{m}$) đến Đỉnh sọ & Tóc ($Y = 4.54\text{m}$).
* **Tổng số khối**: **291 khối hộp** (`BoxGeometry`).
  * 🦶 Bàn chân & Chân Phải: 53 khối
  * 🦶 Bàn chân & Chân Trái: 53 khối
  * 🥋 Khung chậu, Bụng, Lưng, Ngực & Cổ: 70 khối
  * 🥊 Cánh tay & Bàn tay Phải: 33 khối
  * 🥊 Cánh tay & Bàn tay Trái: 33 khối
  * 👤 Hộp sọ, Mặt (mắt, mũi, môi) & Hệ thống Tóc: 49 khối
* **File dữ liệu**:
  * Specs JSON: [`model/Joe/Joe_specs.json`](./Joe/Joe_specs.json) & [`model/Joe.json`](./Joe.json)
  * Trình xem độc lập: [`model/Joe/index.html`](./Joe/index.html) (`http://localhost:3000/model/Joe/`)

---

## 2. Model: `PN` (Thân người Joe cắt bỏ đầu — Sẵn sàng đắp Đầu mới)
* **Mô tả**: Kế thừa 100% phần thân, chân, tay và trụ cổ của Joe, cắt bỏ toàn bộ 49 khối sọ, mặt và tóc cũ. Đỉnh trụ cổ kết thúc ở $Y = 4.14\text{m}$ (`N_neck_core_column`) để sẵn sàng đắp đầu mới.
* **Tổng số khối hiện tại**: **242 khối hộp**.
* **File dữ liệu**:
  * Specs JSON: [`model/PN/PN_specs.json`](./PN/PN_specs.json) & [`model/PN.json`](./PN.json)
  * Trình xem độc lập: [`model/PN/index.html`](./PN/index.html) (`http://localhost:3000/model/PN/`)
* **Không gian làm việc Stage 1**:
  * Đang nạp trực tiếp tại: `http://localhost:3001` ([`stage 1/index.html`](../stage%201/index.html))
  * Có đầy đủ công cụ Click-to-Inspect, phím `M` chọn nhóm, xoay camera và nút **"🎯 Xem Cổ / Đầu Mới"** căn góc chuẩn vào đỉnh cổ $Y = 4.15\text{m}$ để bắt đầu dựng đầu mới.
