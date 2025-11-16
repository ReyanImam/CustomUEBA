import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack } from '@mui/material';
import { useAuth } from './AuthContext';

export default function SignupPage({ setView }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    if (register(username, password)) {
      // If registration is successful, redirect to Login
      setView('login');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register New User
        </Typography>
        <form onSubmit={handleRegister}>
          <Stack spacing={3}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="secondary" size="large">
              Sign Up
            </Button>
            <Button variant="text" onClick={() => setView('login')}>
                Already have an account? Log In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}