import React from 'react';
import Slider from 'react-slick';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FeaturedProductsSlider = ({ products }) => {
  const navigate = useNavigate();

  const IMAGE_BASE_URL = '';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Handle if imagePath is an array, take the first one
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return '';
    return IMAGE_BASE_URL + path;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleViewProduct = (product) => {
    // Use slug if available, otherwise use ID
    const productSlug = product.slug || product.id;
    navigate(`/product/${productSlug}`);
  };

  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No products available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        '& .slick-dots': {
          bottom: '-30px',
          display: 'flex !important',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '30px',
          li: {
            margin: '0 6px',
            button: {
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              padding: 0,
              '&:before': {
                fontSize: '12px',
                color: '#c4c4c4',
              },
            },
            '&.slick-active': {
              button: {
                '&:before': {
                  color: '#1976d2',
                },
              },
            },
          },
        },
      }}
    >
      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.id} sx={{ px: 1 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleViewProduct(product)}
            >
              <CardMedia
                component="img"
                height="200"
                image={getImageUrl(product.image_url || product.images)}
                alt={product.name}
                sx={{
                  objectFit: 'cover',
                  borderRadius: '4px 4px 0 0',
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                    }}
                  >
                    ₹{product.price}
                  </Typography>
                  {product.original_price && product.original_price > product.price && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      ₹{product.original_price}
                    </Typography>
                  )}
                  {product.discount && product.discount > 0 && (
                    <Chip
                      label={`${product.discount}% OFF`}
                      color="error"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProduct(product);
                  }}
                >
                  View Product
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default FeaturedProductsSlider;
