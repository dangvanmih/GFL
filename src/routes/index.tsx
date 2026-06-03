import { Routes, Route, Navigate } from 'react-router-dom';
import SecurityLayout from '../layouts/SecurityLayout';
import VehicleInPage from '../pages/VehicleIn';
import HistoryLogPage from '../pages/HistoryLog';
// Các trang tạm thời đặt làm Mock để test Layout, tuần sau ta sẽ tách file sau
const VehicleOutPage = () => <span style={{ color: '#fff' }}>Màn hình Cổng Ra (Đối Chiếu)</span>;
const VehicleInternalPage = () => <span style={{ color: '#fff' }}>Màn hình Quản Lý Xe Nội Bộ</span>;
const RegisterCarPage = () => <span style={{ color: '#fff' }}>Màn hình Đăng Ký Xe Nội Bộ</span>;
const SystemManagementPage = () => <span style={{ color: '#fff' }}>Màn hình Quản Lý Hệ Thống</span>;
export default function AppRoutes() {
  return (
    <Routes>
      {/* Tất cả các trang an ninh đều được bọc bởi SecurityLayout */}
      <Route element={<SecurityLayout />}>
        <Route path="/log-history" element={< HistoryLogPage/>} />
        <Route path="/vehicle-in" element={<VehicleInPage />} />
        <Route path="/vehicle-out" element={<VehicleOutPage />} />
        <Route path="/vehicle-internal" element={<VehicleInternalPage />} />
        <Route path="/register-car" element={<RegisterCarPage />} />
        <Route path="/system-management" element={<SystemManagementPage />} />
        {/* Nếu vào đường dẫn không tồn tại, tự động chuyển hướng về trang Cổng Vào */}
        <Route path="*" element={<Navigate to="/vehicle-in" replace />} />
      </Route>
    </Routes>
  );
}