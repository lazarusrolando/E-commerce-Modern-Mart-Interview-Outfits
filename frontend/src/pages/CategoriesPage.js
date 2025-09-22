import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { api } = useAuth();

  // Fetch all categories
  const { data, isLoading, error } = useQuery(
    'categories',
    async () => {
      const response = await api.get('/categories');
      return response.data.categories;
    }
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h6" color="error" align="center">
          Failed to load categories.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Categories
      </Typography>
      {data && data.length > 0 ? (
        <Grid container spacing={4}>
          {data.map((category) => {
            const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Card
                  sx={{ height: '100%', cursor: 'pointer' }}
                  onClick={() => navigate(`/category/${categorySlug}`)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {category.description}
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/category/${categorySlug}`);
                      }}
                    >
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          No categories found.
        </Typography>
      )}
    </Container>
  );
};

export default CategoriesPage;
