import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  IconButton,
  Rating,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Favorite, ShoppingCart } from '@mui/icons-material';
import toast from 'react-hot-toast';
import Reviews from '../components/Reviews';
import ReviewForm from '../components/ReviewForm';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const { data, isLoading, error } = useQuery(
    ['product', slug],
    async () => {
      const response = await api.get(`/products/slug/${slug}`);
      return response.data.product;
    },
    {
      enabled: !!slug,
    }
  );

  const { data: reviewsData } = useQuery(
    ['reviews', slug],
    async () => {
      const response = await api.get(`/reviews/${slug}`);
      return response.data.reviews;
    },
    {
      enabled: !!slug,
    }
  );

  useEffect(() => {
    if (data) {
      // Post to backend recently visited route
      api.post(`/recently-visited/${data.id}`).catch(() => {
        // Fail silently
      });
    }
  }, [api, data]);

  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = async () => {
    if ((data.category_name && /shirt|pant/i.test(data.category_name)) && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    try {
      await addToCart(data.id, 1, selectedSize);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(data.id);
      toast.success('Wishlist updated');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h6" color="error" align="center">
          Failed to load product details.
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={data.primary_image || '/api/placeholder/500/500'}
              alt={data.name}
              sx={{ objectFit: 'cover', height: 400 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {data.name}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
            ₹{data.price}
          </Typography>
          {data.original_price > data.price && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', mb: 2 }}>
              ₹{data.original_price}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={data.average_rating} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({data.review_count} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {data.description}
          </Typography>

          {(data.size_chart && data.size_chart.length > 0 && 
            (data.category_name && /shirt|pant/i.test(data.category_name))) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Select Size:
              </Typography>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '1rem', borderRadius: 4, borderColor: '#ccc' }}
              >
                <option value="">Select size</option>
                {data.size_chart.map(size => (
                  <option key={size} value={size}>
                    {size.toUpperCase()}
                  </option>
                ))}
              </select>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<ShoppingCart />} onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <IconButton color="primary" onClick={handleToggleWishlist}>
              <Favorite />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Reviews reviews={reviewsData} />
      <ReviewForm productSlug={slug} />
    </Container>
  );
};

export default ProductDetailPage;
