import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  MenuItem
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  History,
  Favorite,
  Assignment,
  Camera,
  CloudUpload
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProfilePage = () => {
  const { user, updateProfile, api } = useAuth();
  const { wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setEditMode(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || ''
    });
    setAvatarPreview(null);
    setEditMode(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user context with new avatar
      if (response.data.user) {
        // The user context will be updated automatically when the profile is refetched
        alert('Avatar uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderProfileTab = () => (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Personal Information</Typography>
        {!editMode ? (
          <IconButton onClick={() => setEditMode(true)} color="primary">
            <Edit />
          </IconButton>
        ) : (
          <Box>
            <IconButton onClick={handleCancelEdit} color="error" sx={{ mr: 1 }}>
              <Cancel />
            </IconButton>
            <IconButton onClick={handleSaveProfile} color="primary" loading={loading.toString()}>
              <Save />
            </IconButton>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
          fullWidth
            label="First Name"
            value={profileData.firstName}
            onChange={handleInputChange('firstName')}
            disabled={!editMode}
            InputProps={{
              startAdornment: (
                <Person sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={profileData.lastName}
            onChange={handleInputChange('lastName')}
            disabled={!editMode}
            InputProps={{
              startAdornment: (
                <Person sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange('email')}
            disabled={!editMode}
            InputProps={{
              startAdornment: (
                <Email sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            type="tel"
            value={profileData.phone}
            onChange={handleInputChange('phone')}
            disabled={!editMode}
            InputProps={{
              startAdornment: (
                <Phone sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={handleInputChange('dateOfBirth')}
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Gender"
            select
            value={profileData.gender}
            onChange={handleInputChange('gender')}
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="select_gender">
              Select Gender
            </MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {editMode && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Make sure to save your changes before leaving this page.
        </Alert>
      )}
    </Paper>
  );

  const renderAddressesTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Saved Addresses
      </Typography>
      
      <Alert severity="info">
        You haven't saved any addresses yet. Add an address during checkout to save it here.
      </Alert>

      <Button variant="contained" sx={{ mt: 2 }}>
        Add New Address
      </Button>
    </Paper>
  );

  const renderWishlistTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wishlist ({wishlistItems.length} items)
      </Typography>
      
      {wishlistItems.length === 0 ? (
        <Alert severity="info">
          Your wishlist is empty. Start adding products you love!
        </Alert>
      ) : (
        <List>
          {wishlistItems.slice(0, 5).map((item) => (
            <ListItem key={item.id} divider>
              <ListItemIcon>
                <Avatar
                  src={item.image}
                  alt={item.name}
                  variant="square"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                secondary={`₹${item.price}`}
              />
              <Button variant="outlined" size="small">
                Add to Cart
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {wishlistItems.length > 5 && (
        <Button variant="text" sx={{ mt: 2 }} href="/wishlist">
          View All Wishlist Items
        </Button>
      )}
    </Paper>
  );

  const renderPreferencesTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Preferences
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Communication Preferences
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive order updates and promotions via email"
            />
            <Chip label="Enabled" color="success" variant="outlined" />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Style Preferences
        </Typography>
        <Alert severity="info">
          Style preferences feature coming soon! You'll be able to set your preferred sizes, colors, and styles.
        </Alert>
      </Box>
    </Paper>
  );

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Please sign in to view your profile
        </Typography>
        <Button variant="contained" size="large" href="/login">
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
            src={avatarPreview || (user.avatar_url ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api${user.avatar_url}` : null)}
          >
            {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          {editMode && (
            <IconButton
              onClick={handleAvatarClick}
              sx={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                width: 30,
                height: 30,
              }}
              disabled={avatarLoading}
            >
              {avatarLoading ? <CloudUpload /> : <Camera />}
            </IconButton>
          )}
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
          <Chip
            icon={<Assignment />}
            label="Premium Member"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
        />
      </Box>

      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<LocationOn />} label="Addresses" />
          <Tab icon={<Favorite />} label="Wishlist" />
          <Tab icon={<History />} label="Preferences" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderProfileTab()}
          {activeTab === 1 && renderAddressesTab()}
          {activeTab === 2 && renderWishlistTab()}
          {activeTab === 3 && renderPreferencesTab()}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
