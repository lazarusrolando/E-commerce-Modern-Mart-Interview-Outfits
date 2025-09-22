import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Rating,
  Avatar
} from '@mui/material';

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Reviews
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No reviews yet. Be the first to review this product!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reviews ({reviews.length})
      </Typography>
      {reviews.map((review) => (
        <Card key={review.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                {review.first_name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{review.first_name} {review.last_name}</Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {new Date(review.created_at).toLocaleDateString()}
            </Typography>
            {review.comment && (
              <Typography variant="body1">{review.comment}</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Reviews;
