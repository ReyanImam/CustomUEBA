import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Initial users array, stored in localStorage
const USER_STORAGE_KEY = 'ueba_registered_users';

// Create a context for Auth State
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    // Check localStorage for logged in user on initial load
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
      setCurrentUser(savedUser.username);
    }
    setIsAuthReady(true);
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  
  const register = (username, password) => {
    let users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
    if (users.some(u => u.username === username)) {
      showSnackbar("Registration failed: User already exists.", 'error');
      return false;
    }
    
    users.push({ username, password });
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    showSnackbar(`User ${username} registered successfully!`);
    return true;
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(username);
      showSnackbar(`Welcome, ${username}!`);
      return true;
    }
    showSnackbar("Login failed: Invalid credentials.", 'error');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    showSnackbar("Logged out successfully.");
  };

  const contextValue = {
    currentUser,
    isAuthReady,
    register,
    login,
    logout,
    showSnackbar
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      
      {/* Snackbar is provided here globally */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};