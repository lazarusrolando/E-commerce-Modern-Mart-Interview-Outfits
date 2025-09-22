import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ArrowForward,
  LocalShipping,
  Security,
  SupportAgent,
  Article,
  ExpandMore,
  Phone,
  Email,
  AccessTime,
  Help
} from '@mui/icons-material';

import FeaturedProductsSlider from '../components/FeaturedProductsSlider';
import CategoryProductsSection from '../components/CategoryProductsSection';

import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import logo from '../logo.png';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { api } = useAuth();
  
  // Fetch featured products for Featured Products section
  const { data: allProducts, isLoading: productsLoading } = useQuery(
    'allProducts',
    async () => {
      const response = await api.get('/products/all');
      return response.data.products;
    }
  );

  // Fetch categories for category products section
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    'categories',
    async () => {
      const response = await api.get('/categories');
      return response.data.categories;
    }
  );

  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹999 across India'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Payment',
      description: '100% secure payment with Indian payment gateways'
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Dedicated customer support for all your queries'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Premium Products' },
    { number: '50+', label: 'Brand Partners' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      review: 'Modern Mart helped me find the perfect interview outfit. The quality is outstanding and the delivery was fast!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      review: 'Excellent customer service and premium products. I felt confident and professional during my job interview.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      review: 'The variety of formal wear is impressive. Found exactly what I needed for my corporate interviews.',
      rating: 5
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'How to Dress for a Successful Interview',
      date: '2024-05-01',
      summary: 'Discover tips and tricks on how to choose the perfect outfit to make a great first impression at your next job interview.'
    },
    {
      id: 2,
      title: 'Top 10 Formal Shirts for Men in 2024',
      date: '2024-04-15',
      summary: 'Explore the latest trends in men’s formal shirts and find out which styles are dominating the fashion scene this year.'
    },
    {
      id: 3,
      title: 'Choosing the Right Accessories for Your Outfit',
      date: '2024-04-01',
      summary: 'Learn how to complement your formal wear with the right accessories to elevate your overall look.'
    }
  ];

  const [recentlyVisited, setRecentlyVisited] = useState([]);

  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      title: 'Up to 50% Off on Formal Shirts',
      description: 'Limited time offer on premium shirts',
      link: '/products',
      bgColor: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
    },
    {
      title: 'New Arrivals in Ties & Accessories',
      description: 'Check out the latest collection',
      link: '/categories',
      bgColor: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`
    },
    {
      title: 'Free Shipping on Orders Above ₹999',
      description: 'Shop now and save on delivery',
      link: '/products',
      bgColor: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.warning.main} 90%)`
    }
  ];

  useEffect(() => {
    api.get('/recently-visited')
      .then(response => {
        setRecentlyVisited(response.data.recentlyVisited || []);
      })
      .catch(() => {
        setRecentlyVisited([]);
      });
  }, [api]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                className="gradient-text responsive-heading"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  animation: 'fadeInScale 1s ease-out'
                }}
              >
                Dress for Success
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  animation: 'slideInFromBottom 1s ease-out 0.2s both'
                }}
              >
                Premium interview outfits that make you stand out
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  mb: 4, 
                  opacity: 0.8, 
                  maxWidth: 500,
                  animation: 'slideInFromBottom 1s ease-out 0.4s both'
                }}
              >
                Discover our curated collection of professional attire designed to help 
                you make the perfect first impression in your next interview.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/products')}
                  className="pulse-button"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s ease',
                    animation: 'slideInFromBottom 1s ease-out 0.6s both'
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s ease',
                    animation: 'slideInFromBottom 1s ease-out 0.8s both'
                  }}
                  onClick={() => navigate('/categories')}
                >
                  Browse Categories
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={logo}
                alt="Professional Attire"
                sx={{
                  width: '75%',
                  height: 'auto',
                  borderRadius: 2,
                  marginLeft: '100px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Promotional Carousel */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentBanner * 100}%)` }}>
            {banners.map((banner, index) => (
              <Box key={index} sx={{ minWidth: '100%', height: 300, background: banner.bgColor , display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                    {banner.title}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    {banner.description}
                  </Typography>
                  <Button variant="contained" sx={{ fontSize: '1.1rem', px: 4, py: 1.5, backgroundColor: 'white', color: '#424A5D' }} onClick={() => navigate(banner.link)}>
                    Shop Now
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          <Button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
          >
            ‹
          </Button>
          <Button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
          >
            ›
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={true} timeout={600 + index * 200} style={{ transformOrigin: '0 0 0' }}>
                <Card className="glass-effect enhanced-card" sx={{ height: '100%', p: 3 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        fontSize: '3rem',
                        color: 'primary.main',
                        mb: 2,
                        animation: 'floatAndBounce 3s ease-in-out infinite'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            Featured Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Curated selection of premium interview outfits
          </Typography>
        </Box>

        {productsLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ height: '100%' }} className="glass-effect">
                  <Box sx={{ height: 200, bgcolor: 'grey.100' }} className="skeleton-pulse" />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Loading...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <FeaturedProductsSlider products={allProducts} />
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Recently Visited */}
      {<Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            Recently Visited
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Products you've recently viewed
          </Typography>
        </Box>
        {recentlyVisited.length > 0 ? (
          <FeaturedProductsSlider products={recentlyVisited.map(item => ({
            ...item,
            images: item.image_url ? [item.image_url] : []
          }))} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No recently visited products yet. Browse our products to see them here!
            </Typography>
          </Box>
        )}
      </Container>}

      {/* Stats Section */}
      <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : 'grey.50', py: 6, mb: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in={true} timeout={800 + index * 200}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    borderRadius: 2
                  }}>
                    <Typography 
                      variant="h2" 
                      component="div" 
                      color={theme.palette.mode === 'dark' ? 'text.primary' : 'primary'} 
                      sx={{ 
                        fontWeight: 800,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        animation: 'pulseGlow 2s ease-in-out infinite',
                        borderRadius: 2,
                        mb: 1
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={theme.palette.mode === 'dark' ? 'text.secondary' : 'text.secondary'}
                      sx={{ fontWeight: 600 }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      {categoriesLoading ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 8 }}>
          Loading categories...
        </Typography>
      ) : (!categoriesData || categoriesData.length === 0) ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 8 }}>
          No categories available.
        </Typography>
      ) : (

        <CategoryProductsSection categories={categoriesData} products={allProducts} />
      )
      }

      {/* Latest Blog Posts */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Article sx={{ fontSize: 32, color: 'primary.main' }} />
        Latest Blog Posts
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Stay updated with fashion tips and trends
      </Typography>
        </Box>
        <Grid container spacing={4}>
          {blogPosts.map(post => (
            <Grid item xs={12} md={4} key={post.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(post.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    {post.summary}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/blog/${post.id}`)}>
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Customer Testimonials */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            What Our Customers Say
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hear from professionals who aced their interviews
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <Fade in={true} timeout={600 + index * 200}>
                <Card className="glass-effect enhanced-card" sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.review}"
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      - {testimonial.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              animation: 'fadeInScale 1.5s ease-out'
            }}
          >
            Ready to Ace Your Interview?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              animation: 'slideInFromBottom 1.5s ease-out 0.3s both'
            }}
          >
            Join thousands of professionals who trust Modern Mart for their interview attire
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/products')}
            className="pulse-button"
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease',
              animation: 'bounceIn 1s ease-out 0.6s both'
            }}
          >
            Start Shopping Now
          </Button>
        </Container>
      </Box>

      {/* Newsletter Subscription Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'grey.100',
          py: 8,
          mb: 8,
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Get the latest updates, offers, and fashion tips delivered straight to your inbox.
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              // Placeholder for newsletter subscription logic
              alert('Thank you for subscribing!');
            }}
            sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}
          >
            <TextField
              type="email"
              placeholder="Enter your email"
              required
              sx={{ flexGrow: 1 }}
              variant="outlined"
              size="medium"
            />
            <Button type="submit" variant="contained" size="medium">
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>What is your return policy?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We offer a 30-day return policy on all products. Items must be returned in original condition with tags attached.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Do you offer international shipping?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Currently, we only ship within India. We are working on expanding our shipping options.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>How can I track my order?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Once your order is shipped, you will receive a tracking number via email to monitor your delivery status.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Customer Support Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : 'grey.50',
          py: 8,
          mb: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
            Need Help? We're Here for You
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Phone sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Call Us
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Speak directly with our support team
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +91 1800-123-4567
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toll-free across India
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Email Support
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Get detailed assistance via email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@modernmart.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Response within 24 hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <AccessTime sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Support Hours
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    When you can reach us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mon-Fri: 9:00 AM - 8:00 PM IST
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sat-Sun: 10:00 AM - 6:00 PM IST
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Help Resources
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Help />}
                  onClick={() => alert('FAQ: Find answers to common questions about orders, shipping, and returns.')}
                  sx={{ width: '100%' }}
                >
                  FAQ
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<LocalShipping />}
                  onClick={() => alert('Shipping Info: We offer free shipping on orders above ₹999. Delivery within 3-7 business days across India.')}
                  sx={{ width: '100%' }}
                >
                  Shipping Info
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  onClick={() => alert('Returns: 30-day return policy. Items must be in original condition with tags attached.')}
                  sx={{ width: '100%' }}
                >
                  Returns
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<SupportAgent />}
                  onClick={() => alert('Contact Us: Reach out to our support team via phone or email for any assistance.')}
                  sx={{ width: '100%' }}
                >
                  Contact Us
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
