import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip
} from '@mui/material';
import {
  Home,
  Category,
  ShoppingBag,
  Favorite,
  Person,
  Receipt,
  LocationOn,
  TrendingUp,
  Discount,
  Star,
  Article,
  Info,
  ContactMail
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  const isActive = (path) => location.pathname === path;

  const mainMenuItems = [
    { text: 'Home', icon: Home, path: '/' },
    { text: 'Products', icon: Category, path: '/products' },
    { text: 'Categories', icon: ShoppingBag, path: '/categories' },
    { text: 'Blog', icon: Article, path: '/blog' },
    { text: 'About Us', icon: Info, path: '/about' },
    { text: 'Contact', icon: ContactMail, path: '/contact' },
  ];

  const userMenuItems = isAuthenticated
    ? [
        { text: 'My Dashboard', icon: Home, path: '/dashboard' },
        { text: 'My Profile', icon: Person, path: '/profile' },
        { text: 'My Orders', icon: Receipt, path: '/orders' },
        { text: 'My Wishlist', icon: Favorite, path: '/wishlist' },
        { text: 'My Addresses', icon: LocationOn, path: '/addresses' },
      ]
    : [
        { text: 'Login', icon: Person, path: '/login' },
        { text: 'Register', icon: Person, path: '/register' },
      ];

  const featuredMenuItems = [
    { text: 'Featured', icon: Star, path: '/products?featured=true' },
    { text: 'New Arrivals', icon: TrendingUp, path: '/products?sortBy=created_at&sortOrder=DESC' },
    { text: 'Special Offers', icon: Discount, path: '/products?discount=true' },
  ];

  const categories = [
    { name: "Men's Formal", path: '/category/mens-formal' },
    { name: "Women's Professional", path: '/category/womens-professional' },
    { name: 'Accessories', path: '/category/accessories' },
    { name: 'Footwear', path: '/category/footwear' },
    { name: 'Suits & Blazers', path: '/category/suits-blazers' },
    { name: 'Shirts & Tops', path: '/category/shirts-tops' },
    { name: 'Trousers & Pants', path: '/category/trousers-pants' },
  ];

  return (
    <Box>
      {/* Logo */}
      <Box sx={{ p: 8, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('/')}
        >
          Modern Mart
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Premium Interview Outfits
        </Typography>
      </Box>

      {/* Main Menu */}
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'inherit',
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Featured Sections */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Featured
        </Typography>
      </Box>
      <List>
        {featuredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Categories */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Shop by Category
        </Typography>
      </Box>
      <Box sx={{ px: 2, py: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {categories.map((category) => (
          <Chip
            key={category.name}
            label={category.name}
            size="small"
            onClick={() => handleNavigation(category.path)}
            sx={{
              mb: 0.5,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
            }}
          />
        ))}
      </Box>

      <Divider />

      {/* User Menu */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {isAuthenticated ? 'My Account' : 'Authentication'}
        </Typography>
      </Box>
      <List>
        {userMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'inherit',
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Cart */}
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleNavigation('/cart')}
          selected={isActive('/cart')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive('/cart') ? 'white' : 'inherit',
            }}
          >
            <ShoppingBag />
          </ListItemIcon>
          <ListItemText primary="Shopping Cart" />
        </ListItemButton>
      </ListItem>

      {/* Development Tools */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Development
            </Typography>
          </Box>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/animations')}>
              <ListItemIcon>
                <TrendingUp />
              </ListItemIcon>
              <ListItemText primary="Animations Demo" />
              <Chip label="New" size="small" color="primary" variant="outlined" />
            </ListItemButton>
          </ListItem>
        </>
      )}

      {/* App Info */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Modern Mart v1.0
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Premium interview outfits & professional wear
        </Typography>
      </Box>
    </Box>
  );
};

export default Navigation;
