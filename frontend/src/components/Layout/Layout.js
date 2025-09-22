import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Container,
  useScrollTrigger,
  Slide,
  Button,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Favorite,
  Dashboard,
  Person,
  Search,
  DarkMode,
  LightMode,
  Receipt,
  LocationOn,
  Logout
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useTheme } from '../../contexts/ThemeContext';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import Chatbot from '../Chatbot';
import { useNavigate, useLocation } from 'react-router-dom';

// Hide app bar on scroll
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Layout = ({ children }) => {
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                color: 'primary.main',
                mr: 3
              }}
              onClick={() => navigate('/')}
            >
              Modern Mart
            </Typography>

            {/* Navigation Tabs (desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-evenly', flexGrow: 1 }}>
              <Button
                color="inherit"
                onClick={() => navigate('/')}
                sx={{
                  color: isActiveRoute('/') ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute('/') ? 600 : 400
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/products')}
                sx={{
                  color: isActiveRoute('/products') ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute('/products') ? 600 : 400
                }}
              >
                Products
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/categories')}
                sx={{
                  color: isActiveRoute('/categories') ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute('/categories') ? 600 : 400
                }}
              >
                Categories
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/blog')}
                sx={{
                  color: isActiveRoute('/blog') ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute('/blog') ? 600 : 400
                }}
              >
                Blog
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/about')}
                sx={{
                  color: isActiveRoute('/about') ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute('/about') ? 600 : 400
                }}
              >
                About Us
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/contact')}
                sx={{
                  color: isActiveRoute('/contact') ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute('/contact') ? 600 : 400
                }}
              >
                Contact
              </Button>
            </Box>

            {/* Search Bar (desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: "space-between",  maxWidth: 400, mx: 2 }}>
              <SearchBar />
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search button (mobile) */}
              <IconButton
                color="inherit"
                onClick={handleSearchToggle}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <Search />
              </IconButton>

              {/* Theme toggle */}
              <IconButton color="inherit" onClick={toggleTheme}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>

              {/* Wishlist */}
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/wishlist')}
                sx={{
                  color: isActiveRoute('/wishlist') ? 'primary.main' : 'inherit'
                }}
              >
                <Badge badgeContent={wishlistCount} color="secondary">
                  <Favorite />
                </Badge>
              </IconButton>

              {/* Cart */}
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/cart')}
                sx={{
                  color: isActiveRoute('/cart') ? 'primary.main' : 'inherit'
                }}
              >
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {/* User profile */}
              {isAuthenticated ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    sx={{
                      color: isActiveRoute('/profile') ? 'primary.main' : 'inherit'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem'
                      }}
                    >
                      {user?.first_name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 200
                      }
                    }}
                  >
                    <MenuItem onClick={() => { handleNavigation('/dashboard'); handleProfileMenuClose(); }}>
                      <Dashboard sx={{ mr: 1 }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }}>
                      <Person sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { handleNavigation('/orders'); handleProfileMenuClose(); }}>
                      <Receipt sx={{ mr: 1 }} />
                      My Orders
                    </MenuItem>
                    <MenuItem onClick={() => { handleNavigation('/addresses'); handleProfileMenuClose(); }}>
                      <LocationOn sx={{ mr: 1 }} />
                      Addresses
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  startIcon={<Person />}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    color: isActiveRoute('/login') ? 'primary.main' : 'inherit'
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>

          {/* Mobile search bar */}
          {searchOpen && (
            <Box sx={{ p: 2, display: { xs: 'block', md: 'none' } }}>
              <SearchBar onClose={() => setSearchOpen(false)} />
            </Box>
          )}
        </AppBar>
      </HideOnScroll>

      {/* Navigation drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            height: '100vh',
            overflowY: 'auto'
          },
        }}
      >
        <Navigation onItemClick={handleDrawerToggle} />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 10 }, // Account for app bar height
          minHeight: {
            xs: '100vh',
            sm: 'calc(100vh - 64px)' // Account for app bar on desktop
          },
          backgroundColor: 'background.default'
        }}
        className="mobile-full-height"
      >
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2 }
          }}
          className="mobile-container"
        >
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Modern Mart - Premium Interview Outfits.
            All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Chatbot */}
      <Chatbot />
    </Box>
  );
};

export default Layout;
