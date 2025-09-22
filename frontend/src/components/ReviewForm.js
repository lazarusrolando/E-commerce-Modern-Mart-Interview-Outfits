import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

const ReviewForm = ({ productSlug }) => {
  const { user, api } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const submitReviewMutation = useMutation(
    async (reviewData) => {
      const response = await api.post(`/reviews/${productSlug}`, reviewData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
        setError('');
        queryClient.invalidateQueries(['reviews', productSlug]);
        queryClient.invalidateQueries(['product', productSlug]); // To update average rating
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Failed to submit review');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    submitReviewMutation.mutate({
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });
  };

  if (!user) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Write a Review
        </Typography>
        <Alert severity="info">Please log in to submit a review.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Write a Review
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={submitReviewMutation.isLoading}
        >
          {submitReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewForm;
