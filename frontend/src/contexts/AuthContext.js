import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Axios configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile
const fetchUserProfile = async () => {
    console.log('👤 Fetching user profile...');
    try {
      const response = await api.get('/auth/profile');
      const userData = response.data.user;
      // Map snake_case to camelCase
      const mappedUser = {
        ...userData,
        firstName: userData.first_name,
        lastName: userData.last_name,
      };
      setUser(mappedUser);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  // Register with email/phone
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      toast.success('Registration successful! Please verify with OTP.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  // Login with email/phone (send OTP)
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.status === 200) {
        toast.success('OTP sent successfully!');
        return response.data;
      } else {
        toast.error('Login failed. Please check your credentials.');
        return null;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  // Verify OTP
  const verifyOtp = async (otpData) => {
    try {
      console.log('🔐 Starting OTP verification process');
      const response = await api.post('/auth/verify-otp', otpData);
      const { token } = response.data;
      
      console.log('✅ OTP verified successfully. Token received:', token ? 'Yes' : 'No');
      
      if (token) {
        console.log('💾 Storing token in localStorage');
        localStorage.setItem('authToken', token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token stored and axios headers configured');
      } else {
        console.warn('⚠️ No token received in OTP verification response');
      }
      
      // Fetch user profile after successful verification
      console.log('👤 Fetching user profile...');
      await fetchUserProfile();
      
      toast.success('Login successful!');
      console.log('🎉 Login process completed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      throw error;
    }
  };

  // Resend OTP
  const resendOtp = async (credentials) => {
    try {
      const response = await api.post('/auth/resend-otp', credentials);
      toast.success('OTP resent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.Authorization;
    setUser(null);
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      toast.success('Password changed successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    api,
    register,
    login,
    verifyOtp,
    resendOtp,
    logout,
    updateProfile,
    changePassword,
    refetchUser: fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
