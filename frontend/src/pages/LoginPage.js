import { useState } from 'react';
import { TextField, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedButton from '../components/Animated/AnimatedButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!email || !password) {
      alert('Please enter your email address and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response) {
        setOtpSent(true);
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      navigate('/');
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      padding={2}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Login with Email OTP
        </Typography>
        {!otpSent ? (
          <>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <AnimatedButton
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSendOtp}
              loading={loading}
              loadingText="Sending..."
            >
              Send OTP
            </AnimatedButton>
          </>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>
              Enter the OTP sent to your email
            </Typography>
            <TextField
              label="OTP"
              type="text"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <AnimatedButton
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyOtp}
              loading={loading}
              loadingText="Verifying..."
            >
              Verify OTP
            </AnimatedButton>
          </>
        )}
      </Paper>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Don't have an account?{' '}
        <a href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Create one here
        </a>
      </Typography>
    </Box>
  );
};

export default LoginPage;
