import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App.jsx' // Changed to AppWrapper
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink/Red
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppWrapper />
    </ThemeProvider>
  </React.StrictMode>,
)