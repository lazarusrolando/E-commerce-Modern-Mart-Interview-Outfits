import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const blogPosts = [
  {
    id: 1,
    title: 'How to Dress for a Successful Interview',
    date: '2024-05-01',
    content: `Discover tips and tricks on how to choose the perfect outfit to make a great first impression at your next job interview.
    
1. Research the company culture.
2. Choose professional and well-fitted attire.
3. Pay attention to grooming and accessories.
4. Dress slightly more formal than the company norm.
5. Be comfortable and confident in your outfit.`
  },
  {
    id: 2,
    title: 'Top 10 Formal Shirts for Men in 2024',
    date: '2024-04-15',
    content: `Explore the latest trends in men’s formal shirts and find out which styles are dominating the fashion scene this year.
    
- Slim fit shirts
- Classic white and blue shirts
- Patterned and textured fabrics
- Breathable cotton blends
- Shirts with subtle detailing`
  },
  {
    id: 3,
    title: 'Choosing the Right Accessories for Your Outfit',
    date: '2024-04-01',
    content: `Learn how to complement your formal wear with the right accessories to elevate your overall look.
    
- Watches: Choose classic styles.
- Ties: Match with your shirt and suit.
- Belts: Coordinate with your shoes.
- Pocket squares: Add a pop of color.
- Cufflinks: For a polished finish.`
  }
];

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id, 10);
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Blog Post Not Found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/blog')}>
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {new Date(post.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 4 }}>
        {post.content}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/blog')}>
        Back to Blog
      </Button>
    </Container>
  );
};

export default BlogPostPage;
