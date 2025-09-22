import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategoryProductsSection = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/category/${categorySlug}`);
  };

  return (
    <Box sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: 'primary.main'
        }}
      >
        Shop by Category
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          opacity: 0.8,
          maxWidth: 500,
          animation: 'slideInFromBottom 1s ease-out 0.4s both',
          textAlign: 'center',
          margin: '0 auto'
        }}
      >Browse products by section for a quick shopping experience.
      </Typography>


      <Grid container spacing={3} justifyContent="center">
        {categories && categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  '& .category-button': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary'
                  }}
                >
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {category.description}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  className="category-button"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category.name);
                  }}
                >
                  View Products
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryProductsSection;
