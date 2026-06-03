import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

interface HistoryLogProps {
  history: string[];
}

export default function HistoryLog({ history }: HistoryLogProps) {
  return (
    // Dùng Paper làm nền bo góc cho khu vực log lịch sử
    <Paper sx={{ p: 2, bgcolor: '#1a1a1a', borderRadius: 2, border: '1px solid #333' }}>
      <Typography variant="subtitle1" sx={{ color: '#aaa', fontWeight: 'bold', mb: 1 }}>
        📜 Lịch sử liên kết hệ thống:
      </Typography>

      {history.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#555', py: 1 }}>
          Chưa có lượt xe nào được tạo trong phiên làm việc này.
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {history.map((item, index) => (
            <ListItem 
              key={index} 
              disableGutters 
              sx={{ 
                borderBottom: '1px solid #222', 
                color: '#4caf50',
                py: 1 
              }}
            >
              <ListItemText 
                primary={`${item}`} 
                secondary="➔ Đã lưu vào cơ sở dữ liệu thành công!"
                slotProps={{
                  primary: { sx: { color: '#4caf50', fontWeight: 'bold', fontSize: '14px' } },
                  secondary: { sx: { color: '#81c784', fontSize: '12px' } }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}