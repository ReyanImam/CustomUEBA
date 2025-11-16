    import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack } from '@mui/material';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  
  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
            <Button type="submit" variant="contained" size="large">
              Log In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}