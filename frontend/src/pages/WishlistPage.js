import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Delete,
  Visibility
} from '@mui/icons-material';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1); // Pass product ID and quantity
    toast.success('Added to cart!');
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(product => {
      addToCart(product.id, 1); // Pass product ID and quantity
    });
    toast.success('All items moved to cart!');
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  if (wishlistItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your wishlist is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start adding products you love to your wishlist!
        </Typography>
        <Button variant="contained" size="large" href="/products">
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          My Wishlist ({wishlistItems.length} items)
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ShoppingCart />}
            onClick={handleMoveAllToCart}
          >
            Move All to Cart
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {wishlistItems.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                component="img"
                src={product.image || '/api/placeholder/300/200'}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    ₹{product.price}
                  </Typography>
                  {product.originalPrice && (
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ₹{product.originalPrice}
                    </Typography>
                  )}
                  {product.discountPercentage && (
                    <Chip
                      label={`${product.discountPercentage}% OFF`}
                      color="success"
                      size="small"
                    />
                  )}
                </Box>

                {product.inStock !== false ? (
                  <Chip
                    label="In Stock"
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Chip
                    label="Out of Stock"
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    <Favorite />
                  </IconButton>
                  
                  <IconButton
                    component={Link}
                    to={`/product/${product.slug || product.id}`}
                    title="View product"
                  >
                    <Visibility />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inStock === false}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {wishlistItems.length > 6 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="outlined" size="large">
            Load More
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Alert severity="info">
        <Typography variant="body2">
          <strong>Tip:</strong> Your wishlist items are saved locally. For permanent storage across devices, 
          please create an account and sign in.
        </Typography>
      </Alert>
    </Container>
  );
};

export default WishlistPage;
