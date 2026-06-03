import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import type { XitecLog } from '../../types/vehicle';

import CccdInfo from './components/CccdInfo';
import CameraInfo from './components/CameraInfo';
import HistoryLog from './components/HistoryLog';
import CustomButton from '../../components/CustomButton';
const API_URL = "http://127.0.0.1:8000/ocr/cccd";

export default function VehicleInPage() {
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [printHistory, setPrintHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. DỪNG LUỒNG QUÉT TỰ ĐỘNG LỖI 422 
  // Vì API nhận dạng qua POST yêu cầu truyền file trực tiếp từ client, 
  // ta không dùng Polling chạy suông nữa mà chuyển sang cơ chế kích hoạt theo sự kiện (Event-driven).
  useEffect(() => {
    console.log("Hệ thống OCR sẵn sàng tiếp nhận file ảnh từ bốt bảo vệ.");
  }, []);

  const handleUpdateVehicleField = (field: keyof XitecLog, value: string) => {
    if (vehicleData) {
      setVehicleData({ ...vehicleData, [field]: value });
    }
  };

  const handleUploadImageClick = () => {
    fileInputRef.current?.click();
  };

  // 2. XỬ LÝ GỬI ẢNH CCCD QUA FORMDATA VÀ NHẬN DIỆN THỦ CÔNG
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tạo link blob hiển thị ảnh cục bộ tại phía client
    const imageUrl = URL.createObjectURL(file);

    // Đóng gói file vào FormData để dập tắt lỗi 422 Unprocessable Entity từ BE
    const formData = new FormData();

    // CHÚ Ý: Key truyền vào đây (ở đây là 'image') phải trùng khớp 100% với tên biến File nhận ở Backend.
    formData.append('image', file);

    try {
      console.log("Đang tải file ảnh lên Backend để xử lý OCR...");
      setIsLoading(true); // Bật trạng thái loading khi bắt đầu gửi ảnh
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Kiểm tra cấu trúc đúng theo format Backend bọc: { status: "SUCCESS", data: {...} }
      if (response.data && response.data.status === "SUCCESS") {
        const cccdApiData = response.data.data; // Bóc lấy object con nằm trong trường data

        setVehicleData({
          id: cccdApiData?.id || "Không rõ",
          name: cccdApiData?.name || "Không rõ",
          birth: cccdApiData?.birth || "",
          place: cccdApiData?.place || "",
          nationalId: cccdApiData?.id || "",
          driverName: cccdApiData?.name || "",
          nationalIdImage: imageUrl,
          licensePlate: "29C-777.77",
          licensePlateImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400",
          driverFaceImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
          entryTime: new Date().toLocaleString('vi-VN')
        });

        console.log("Xử lý OCR dữ liệu CCCD thành công!");
      }
    } catch (error) {
      // IN RA LỖI THỰC TẾ LÀM CODE BỊ CRASH
      console.error("❌ Lỗi thực tế xuất hiện trong khối try hoặc catch:", error);

      if (axios.isAxiosError(error)) {
        console.error("Chi tiết lỗi phản hồi từ mạng:", error.response?.data || error.message);
      }

      // Tạm thời tắt alert này đi hoặc đổi thông báo để theo dõi log console chuẩn hơn
      alert("Hệ thống gặp lỗi xử lý dữ liệu. Hãy mở tab Console (F12) để xem chi tiết lỗi!");
    } finally {
      // Kiểm tra an toàn trước khi reset value để tránh lỗi undefined crash code
      if (fileInputRef && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsLoading(false); // Tắt trạng thái loading sau khi hoàn thành xử lý
    }
  };

  const handlePrintCard = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!vehicleData) return;

    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>In Thẻ Giấy Cổng Vào</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            .card { border: 2px solid #000; padding: 16px; width: 320px; display: flex; justify-content: space-between; }
            .value { font-weight: bold; font-size: 16px; margin-bottom: 6px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div>
              <div class="value">Số CCCD: ${vehicleData.id}</div>
              <div class="value">Tài xế: ${vehicleData.name}</div>
              <div class="value">Biển số: ${vehicleData.licensePlate}</div>
              <div class="value">Vào lúc: ${vehicleData.entryTime}</div>
            </div>
            <div style="width: 35%; text-align: center;">
              <img src="${vehicleData.driverFaceImage}" style="width: 100%; border: 1px solid #000;" />
            </div>
          </div>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (w) {
      w.document.open(); w.document.write(printHtml); w.document.close(); w.focus();
      setTimeout(() => { w.print(); }, 300);
    }

    setPrintHistory([
      `[IN THẺ] Xe: ${vehicleData.licensePlate} - Tài xế: ${vehicleData.name} - Thời gian: ${vehicleData.entryTime}`,
      ...printHistory,
    ]);

    setVehicleData(null);
  };

  return (
    <Box>
      {/* CẤU TRÚC HEADER CHỨA TIÊU ĐỀ & NÚT BẤM TẢI ẢNH */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderBottom: '2px solid #ff9900',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h5" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
            CỔNG VÀO: GIÁM SÁT HÌNH ẢNH REAl-TIME từ CAMERA & CCCD
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <CircularProgress size={14} color="warning" />
            <Typography variant="caption" sx={{ color: '#aaa' }}>
              Hệ thống sẵn sàng nhận diện xử lý qua tệp hình ảnh...
            </Typography>
          </Box>
        </Box>

        <Box>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <CustomButton
            variant="contained"                    // Tự động ăn theo rest props
            startIcon={<AddPhotoAlternateIcon />}  // Tự động ăn theo rest props
            onClick={handleUploadImageClick}       // Tự động ăn theo rest props
            isLoading={isLoading}                  // State xoay tròn đợi AI (nếu có)
          >
            Thêm CCCD                              
          </CustomButton>
        </Box>
      </Box>

      {/* KHU VỰC HIỂN THỊ CHÍNH */}
      {!vehicleData ? (
        <Box sx={{ textAlign: 'center', py: 12, color: '#888888' }}>
          <Typography variant="h6">Chờ tải tệp hình ảnh hoặc tín hiệu quét CCCD từ bốt bảo vệ...</Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: 'stretch'
            }}
          >
            {/* CỘT 1: Thông tin CCCD */}
            <Box sx={{ flexGrow: 1, flexShrink: 0, flexBasis: { xs: '100%', md: 'calc(33.33% - 16px)' }, width: { xs: '100%', md: 'auto' } }}>
              <CccdInfo data={vehicleData} onUpdateField={handleUpdateVehicleField} />
            </Box>

            {/* CỘT 2 & CỘT 3: Các khung hình Camera */}
            <CameraInfo data={vehicleData} />
          </Box>

          {/* NÚT BẤM IN THẺ KHÁCH VÀO */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 2 }}>
            <CustomButton
              variant="contained"
              color="success"
              size="large"
              startIcon={<PrintIcon />}
              onClick={handlePrintCard}
              sx={{
                fontWeight: 'bold',
                px: 4, py: 1.8, fontSize: '16px',
                bgcolor: '#2e7d32',
                boxShadow: '0px 4px 20px rgba(76, 175, 80, 0.3)',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              XÁC NHẬN & IN THẺ VÀO
            </CustomButton>
          </Box>
        </Box>
      )}

      {/* LỊCH SỬ LOG */}
      <Box sx={{ mt: 2 }}>
        <HistoryLog history={printHistory} />
      </Box>
    </Box>
  );
}