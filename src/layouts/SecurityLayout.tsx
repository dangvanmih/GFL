import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  CssBaseline,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import GppGoodIcon from '@mui/icons-material/GppGood';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
const DRAWER_WIDTH = 280; // Chiều rộng mặc định khi mở Sidebar

export default function SecurityLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Khai báo State quản lý trạng thái đóng/mở của Sidebar (mặc định là mở)
  const [open, setOpen] = useState<boolean>(true);

  // Hàm đảo ngược trạng thái đóng/mở
  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Kiểm Soát Cổng Vào', path: '/vehicle-in', icon: <LocalGasStationIcon /> },
    { text: 'Đối Chiếu Cổng Ra', path: '/vehicle-out', icon: <GppGoodIcon /> },
    {text: 'Lịch Sử Ra Vào', path: '/log-history', icon: <HistoryIcon /> },
    { text: 'Đăng Ký Xe', path: '/register-car', icon: <NoCrashIcon /> },
    { text: 'Quản Lý Hệ Thống', path: '/system-management', icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#121212' }}>
      <CssBaseline />

      {/* 2. THANH HEADER PHÍA TRÊN */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#1a1a1a',
          borderBottom: '2px solid #ff9900',
          zIndex: (theme) => theme.zIndex.drawer + 1, // Đảm bảo Header luôn nằm trên Sidebar
        }}
      >
        <Toolbar>
          {/* Nút bấm Menu để đóng/mở Sidebar đặt ở đầu Header */}
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleToggleDrawer}
            edge="start"
            sx={{ mr: 2, color: '#ff9900' }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
            HỆ THỐNG GIÁM SÁT AN NINH XE RA VÀO SÂN BAY
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 3. THANH SIDEBAR BÊN TRÁI */}
      <Drawer
        variant="persistent" // Đổi từ permanent sang persistent để có thể ẩn/hiển thị động
        anchor="left"
        open={open} // Liên kết với biến State
        sx={{
          width: open ? DRAWER_WIDTH : 0, // Nếu đóng thì chiều rộng vùng chiếm dụng bằng 0
          flexShrink: 0,
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          [`& .MuiDrawer-paper`]: { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box', 
            bgcolor: '#1a1a1a', 
            color: '#fff',
            borderRight: '1px solid #333'
          },
        }}
      >
        {/* Đẩy nội dung menu xuống dưới thanh Header */}
        <Toolbar />
        
        <Toolbar sx={{ justifyContent: 'center', borderBottom: '1px solid #333', minHeight: '48px !important' }}>
          <Typography variant="subtitle2" sx={{ color: '#aaa', fontWeight: 'bold' }}>
            🛡️ KHU VỰC ĐIỀU HÀNH
          </Typography>
        </Toolbar>
        
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton 
                    onClick={() => navigate(item.path)}
                    selected={isSelected}
                    sx={{
                      mx: 1,
                      borderRadius: '8px',
                      mb: 1,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255, 153, 0, 0.2)',
                        color: '#ff9900',
                        '&:hover': { bgcolor: 'rgba(255, 153, 0, 0.3)' },
                        '& .MuiListItemIcon-root': { color: '#ff9900' }
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#aaa' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      slotProps={{ primary: { sx: { fontWeight: 500 } } }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* 4. VÙNG HIỂN THỊ NỘI DUNG (CONTENT AREA) */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          color: '#ffffff',
          // Hiệu ứng mượt mà (Transition) khi vùng Content tự động co giãn theo Sidebar
          marginLeft: 0,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}