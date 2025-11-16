import { useState, useEffect } from "react";
import { api } from "./services/api";
import ActionButtons from "./components/ActionButtons";
import LogTable from "./components/LogTable";
import AdminDashboard from "./components/AdminDashboard";


// IMPORT AUTH COMPONENTS
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
// END AUTH COMPONENTS

import { 
  AppBar, Toolbar, Typography, 
  Container, Box, CssBaseline, 
  Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Divider,
  Button, CircularProgress,
  Menu, MenuItem , IconButton
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

// Constants for layout
const drawerWidth = 240;

// Main component wrapped with AuthProvider
function MainAppContent() {
  const { currentUser, logout, showSnackbar } = useAuth(); // Use auth state
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('logs'); 
  const [anchorEl, setAnchorEl] = useState(null); // State for user menu

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/logs");
      setLogs(res.data);
    } catch (error) {
      console.error("Failed to load logs:", error);
      showSnackbar(`Error loading logs: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentUser]); // Reload logs when user changes

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleClose();
    logout();
    setView('login'); // Redirect to login after logout
  };
  
  const handleLogGenerated = (action, success) => {
    if (success) {
      showSnackbar(`Log generated for action: ${action}. Refreshing table...`, 'success');
      loadLogs();
    } else {
      showSnackbar(`Failed to generate log for action: ${action}. Check console.`, 'error');
    }
  };

  const menuItems = [
    { text: 'Log Simulator', icon: <ListAltIcon />, key: 'logs', target: 'logs', requiresAuth: true },
    { text: 'Admin Dashboard', icon: <HomeIcon />, key: 'dashboard', target: 'dashboard', requiresAuth: true },
    { text: 'Model Training', icon: <ScienceIcon />, key: 'training', target: 'training', requiresAuth: true },
  ];

  const renderContent = () => {
    // Check authentication first
    if (!currentUser) {
        if (view === 'signup') {
            return <SignupPage setView={setView} />;
        }
        return <LoginPage />; // Default to login if not authenticated
    }

    // Authenticated views
    switch (view) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'training':
        return <ModelTrainingPage />;
      case 'logs':
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              UEBA Log Simulator
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Simulate Actions
            </Typography>
            {/* Pass current user to allow logging user-specific data */}
            <ActionButtons onLogGenerated={handleLogGenerated} loggedInUser={currentUser} /> 
            
            <Button 
              variant="contained" 
              onClick={loadLogs} 
              disabled={loading}
              sx={{ my: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Load Logs (Refresh Table)"}
            </Button>

            <LogTable logs={logs} />
          </Box>
        );
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar for Header (Always visible) */}
      <AppBar 
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Custom UEBA: {menuItems.find(item => item.key === view)?.text || (currentUser ? 'Welcome' : 'Authentication')}
          </Typography>
          
          {/* User Status and Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {currentUser ? `User: ${currentUser}` : 'Guest'}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!currentUser && (
                  <MenuItem onClick={() => { handleClose(); setView('login'); }}>
                      <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Login</ListItemText>
                  </MenuItem>
              )}
              {!currentUser && (
                  <MenuItem onClick={() => { handleClose(); setView('signup'); }}>
                      <ListItemIcon><AppRegistrationIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Sign Up</ListItemText>
                  </MenuItem>
              )}
              {currentUser && (
                  <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                  </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Permanent Drawer/Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h5" color="primary">
            UEBA Console
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton 
                // Only enable navigation if authenticated
                disabled={!currentUser && item.requiresAuth} 
                selected={view === item.key} 
                onClick={() => setView(item.target)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> 
        {renderContent()}
      </Box>
    </Box>
  );
}

// Export the wrapper that includes AuthProvider
export default function AppWrapper() {
    return (
        <AuthProvider>
            <MainAppContent />
        </AuthProvider>
    );
}