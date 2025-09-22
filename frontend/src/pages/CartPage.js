import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
  Alert,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalShipping
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import SizeChart from '../components/SizeChart';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartSummary,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    isLoading
  } = useCart();
  const { isAuthenticated } = useAuth();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const handleQuantityChange = async (itemId, newQuantity, newSize) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity, newSize);
  };

  const handleOpenSizeChart = () => {
    setSizeChartOpen(true);
  };

  const handleCloseSizeChart = () => {
    setSizeChartOpen(false);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      // Error is handled in the mutation
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please login to view your cart
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
        >
          Login Now
        </Button>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {[1, 2, 3].map((item) => (
              <Card key={item} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography>Loading...</Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography>Loading summary...</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </Typography>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={item.product_image || '/api/placeholder/100/100'}
                          alt={item.product_name}
                          sx={{
                            width: '100%',
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                        {item.discount_percentage > 0 && (
                          <Chip
                            label={`${item.discount_percentage}% OFF`}
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              zIndex: 1
                            }}
                          />
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={5}>
                      <Typography variant="h6" gutterBottom>
                        {item.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.brand}
                      </Typography>
                      <TextField
                        select
                        size="small"
                        value={item.size || ''}
                        onChange={(e) => handleQuantityChange(item.id, item.quantity, e.target.value)}
                        SelectProps={{
                          native: true,
                        }}
                        sx={{ mt: 1, minWidth: 80 }}
                      >
                        <option value="">Select Size</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </TextField>
                      {item.color && (
                        <Chip
                          label={`Color: ${item.color}`}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Grid>

                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography sx={{ mx: 1, minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid item xs={2}>
                      <Typography variant="h6" align="right">
                        {formatPrice(item.total_price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="right">
                        {formatPrice(item.unit_price)} each
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{ float: 'right', mt: 1 }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
              <Button
                variant="text"
                onClick={handleOpenSizeChart}
                sx={{ mt: 2 }}
              >
                View Size Chart
              </Button>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>

                {/* Free Shipping Progress */}
                {cartSummary && cartSummary.free_shipping_threshold > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: 'green.50',
                      borderColor: 'success.main'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalShipping
                        color='success'
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        🎉 You qualify for FREE shipping!
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Coupon Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Apply Coupon
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Price Breakdown */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">{formatPrice(cartSummary?.subtotal || 0)}</Typography>
                  </Box>

                  {cartSummary?.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        Discount:
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -{formatPrice(cartSummary.discount)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2">
                      {cartSummary?.shipping === 0 ? 'FREE' : formatPrice(cartSummary?.shipping || 0)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax:</Typography>
                    <Typography variant="body2">{formatPrice(cartSummary?.tax || 0)}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(cartSummary?.total || 0)}
                  </Typography>
                </Box>

                {/* Checkout Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>

                {/* Security Badge */}
                <Box sx={{ textAlign: 'center', mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    🔒 Secure checkout with Indian payment gateways
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <SizeChart open={sizeChartOpen} onClose={handleCloseSizeChart} />
    </>
  );
};

export default CartPage;
