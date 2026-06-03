import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

export default function HistoryLogPage() {
  const [logs, setLogs] = useState<Array<string>>([]);

useEffect(() => {
    // Hàm đọc dữ liệu từ kho
    const loadLogs = () => {
      const data = localStorage.getItem('vehicle_logs');
      if (data) {
        const storedLogs = JSON.parse(data);
        if (Array.isArray(storedLogs)) {
          setLogs(storedLogs);
        }
      } else {
        setLogs([]);
      }
    };

    // 1. Chạy ngay lập tức khi bảo vệ mở tab Lịch sử này ra
    loadLogs();

    // 2. Lắng nghe sự kiện tự chế khi có xe vừa in ở trang bên cạnh
    window.addEventListener('local-storage-update', loadLogs);
    
    // 3. Lắng nghe sự kiện hệ thống (nếu bảo vệ mở 2 tab trình duyệt song song)
    window.addEventListener('storage', loadLogs);
    
    // Dọn dẹp sự kiện khi hủy trang
    return () => {
      window.removeEventListener('local-storage-update', loadLogs);
      window.removeEventListener('storage', loadLogs);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử ra vào không?")) {
      localStorage.removeItem('vehicle_logs');
      setLogs([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '2px solid #ff9900', pb: 2 }}>
        <Typography variant="h5" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
          QUẢN LÝ LỊCH SỬ XE RA VÀO BẾN (REAL-TIME)
        </Typography>
        
        {logs.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearHistory}
          >
            Xóa lịch sử
          </Button>
        )}
      </Box>

      {logs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: '#aaa' }}>
          <Typography variant="body1">Chưa có lịch sử xe ra vào nào được ghi nhận trong phiên làm việc.</Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2 }}>
          <List sx={{ p: 0 }}>
            {logs.map((log, index) => {
              const currentLogText = String(log);
              const isCheckIn = currentLogText.includes('[IN THẺ]');
              const textColor = isCheckIn ? '#4caf50' : '#ffffff';

              return (
                <Box key={index}>
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemText>
                      {/* GIẢI PHÁP ĐỘC LẬP: Tự render Typography làm con của ListItemText, bỏ qua Props lỗi hệ thống */}
                      <Typography 
                        sx={{ 
                          fontSize: '15px', 
                          fontFamily: 'monospace', 
                          color: textColor 
                        }}
                      >
                        {currentLogText}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                  {index < logs.length - 1 && <Divider sx={{ bgcolor: '#333' }} />}
                </Box>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
}