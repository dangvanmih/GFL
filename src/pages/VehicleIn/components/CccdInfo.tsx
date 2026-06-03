import { Card, CardContent, Typography, Box, TextField } from '@mui/material';
import type { ChangeEvent } from 'react';
import type { XitecLog } from '../../../types/vehicle';

interface CccdInfoProps {
  data: XitecLog;
  // Khai báo thêm hàm callback để báo cho trang cha biết khi dữ liệu thay đổi
  onUpdateField: (field: keyof XitecLog, value: string) => void;
}

export default function CccdInfo({ data, onUpdateField }: CccdInfoProps) {
  return (
    <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#ff9900', fontWeight: 'bold', mb: 2 }}>
          🪪 1. DỮ LIỆU OCR CCCD (CÓ THỂ SỬA)
        </Typography>

        {/* Ảnh chân dung quét từ CCCD */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
            Ảnh mặt trên CCCD:
          </Typography>
          <Box
            component="img"
            src={data.nationalIdImage}
            alt="Mat CCCD"
            sx={{
              width: 250,
              height: 250,
              borderRadius: 1,
              objectFit: 'cover',
              border: '2px solid #ff9900',
            }}
          />
        </Box>

        {/* Ô NHẬP LIỆU: Số CCCD */}
        <TextField
          fullWidth
          label="Số CCCD"
          variant="outlined"
          value={data.nationalId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('nationalId', e.target.value)}
          slotProps={{
            input: { sx: { color: '#fff', bgcolor: '#222' } },
            inputLabel: { sx: { color: '#ff9900' } }
          }}
          sx={{ mb: 2 }}
        />

        {/* Ô NHẬP LIỆU: Họ và Tên tài xế */}
        <TextField
          fullWidth
          label="Họ và Tên tài xế"
          variant="outlined"
          value={data.driverName}
          // Khi gõ, hệ thống tự động đổi chữ thành HOA cho chuẩn nghiệp vụ quản lý
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('driverName', e.target.value.toUpperCase())}
          slotProps={{
            input: { sx: { color: '#ff9900', fontWeight: 'bold', bgcolor: '#222' } },
            inputLabel: { sx: { color: '#ff9900' } }
          }}
        />
      </CardContent>
    </Card>
  );
}