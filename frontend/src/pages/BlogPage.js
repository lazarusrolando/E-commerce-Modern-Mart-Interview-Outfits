import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box
} from '@mui/material';

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

const BlogPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Blog
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(post.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  {post.summary}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <CardActions>
                  <Button size="small" variant="outlined" href={`/blog/${post.id}`}>
                    Read More
                  </Button>
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogPage;
