import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper
} from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        About Us
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          At Modern Mart, our mission is to provide premium quality fashion products that empower our customers to look and feel their best. We are committed to offering a seamless shopping experience with a curated collection of professional attire.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          We envision becoming the leading online destination for fashion-forward individuals seeking stylish and affordable clothing and accessories. Our goal is to inspire confidence and success through our products.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Our History
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in 2023, Modern Mart started as a small online store with a passion for quality and customer satisfaction. Over the years, we have grown into a trusted brand known for our diverse product range and excellent service.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Meet the Team
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                R. Lazarus Rolando
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CEO & Founder
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          Have questions or need assistance? Reach out to our customer support team at lazarusrolando618@gmail.com or call us at +91 1234567890.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;
