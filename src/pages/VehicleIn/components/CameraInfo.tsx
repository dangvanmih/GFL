import { Card, CardContent, Typography, Box } from '@mui/material'; // Bỏ hẳn import Grid
import type { XitecLog } from '../../../types/vehicle';

interface CameraInfoProps {
  data: XitecLog;
}

export default function CameraInfo({ data }: CameraInfoProps) {
  return (
    <>
      {/* CỘT 2: KHỐI ẢNH XE & BIỂN SỐ XE */}
      {/* Dùng Box giả lập một ô lưới Grid với flex-basis 33.33% */}
      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: { xs: '100%', md: 'calc(33.33% - 16px)' }, // Tự động co giãn chia 3 cột
          width: { xs: '100%', md: 'auto' }
        }}
      >
        <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333', borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#ff9900', fontWeight: 'bold', mb: 2 }}>
              📸 2. ẢNH XE & BIỂN SỐ LPR
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
                bgcolor: '#ffffff',
                color: '#000000',
                textAlign: 'center',
                py: 1,
                borderRadius: 1,
                fontWeight: 'bold',
                letterSpacing: 2,
                border: '2px solid #333'
              }}
            >
              {data.licensePlate}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1 }}>
                Hình ảnh toàn cảnh phương tiện:
              </Typography>
              <Box
                component="img"
                src={data.licensePlateImage}
                alt="Toàn cảnh xe bồn"
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid #444'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* CỘT 3: KHỐI ẢNH MẶT TÀI XẾ CHỤP TỪ CABIN CAMERA */}
      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: { xs: '100%', md: 'calc(33.33% - 16px)' }, // Tự động co giãn chia 3 cột
          width: { xs: '100%', md: 'auto' }
        }}
      >
        <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333', borderRadius: 2, height: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ff9900', fontWeight: 'bold', mb: 3, textAlign: 'left' }}>
              👤 3. Ảnh mặt tài xế:
            </Typography>

            <Box
              component="img"
              src={data.driverFaceImage}
              alt="Khuôn mặt tài xế"
              sx={{
                width: 300,
                height: 300,
                objectFit: 'cover',
                border: '3px solid #ff9900',
                boxShadow: '0px 0px 15px rgba(255, 153, 0, 0.4)',
                my: 1
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}