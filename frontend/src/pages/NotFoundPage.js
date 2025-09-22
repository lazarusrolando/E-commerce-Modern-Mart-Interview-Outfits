import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  SentimentDissatisfied,
  Home,
  ArrowBack
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <SentimentDissatisfied 
          sx={{ 
            fontSize: 96, 
            color: 'primary.main',
            mb: 3
          }} 
        />
        
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '3rem', md: '4rem' },
            fontWeight: 700,
            color: 'primary.main'
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            mb: 2,
            color: 'text.primary'
          }}
        >
          Oops! Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            maxWidth: 500,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          The page you're looking for seems to have gone on a coffee break. 
          Maybe it's interviewing for a better position elsewhere?
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            component={Link}
            to="/"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            Go Back
          </Button>
        </Box>

        {/* Additional helpful links */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Quick Links
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="text"
              component={Link}
              to="/products"
              sx={{ textTransform: 'none' }}
            >
              Browse Products
            </Button>
            
            <Button
              variant="text"
              component={Link}
              to="/categories"
              sx={{ textTransform: 'none' }}
            >
              Categories
            </Button>
            
            <Button
              variant="text"
              component={Link}
              to="/cart"
              sx={{ textTransform: 'none' }}
            >
              Shopping Cart
            </Button>
            
            <Button
              variant="text"
              component={Link}
              to="/profile"
              sx={{ textTransform: 'none' }}
            >
              My Account
            </Button>
          </Box>
        </Box>

        {/* Fun fact or tip */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
            borderRadius: 2,
            color: 'primary.contrastText'
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            💡 Tip: While this page is on break, why not browse our latest collection of 
            professional interview outfits? First impressions matter!
          </Typography>
        </Box>
      </Paper>

      {/* Background pattern or decoration */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark' ? 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)' : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </Container>
  );
};

export default NotFoundPage;
