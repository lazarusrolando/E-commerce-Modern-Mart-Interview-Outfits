import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Person,
  Star,
  TrendingUp,
  Receipt,
  History,
  Settings,
  Favorite
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, api, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery(
    'userOrders',
    async () => {
      const response = await api.get('/orders/');
      return response.data.orders;
    },
    {
      enabled: isAuthenticated,
    }
  );

  // Fetch user statistics
  const { data: stats } = useQuery(
    'userStats',
    async () => {
      const response = await api.get('/users/stats');
      return response.data;
    },
    {
      enabled: isAuthenticated,
    }
  );

  const recentOrders = orders?.slice(0, 5) || [];
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const deliveredOrders = orders?.filter(order => order.status === 'delivered').length || 0;

  const quickActions = [
    {
      icon: <ShoppingCart />,
      label: 'Continue Shopping',
      action: () => navigate('/products'),
      color: 'primary'
    },
    {
      icon: <Receipt />,
      label: 'View Orders',
      action: () => navigate('/orders'),
      color: 'secondary'
    },
    {
      icon: <Favorite />,
      label: 'Wishlist',
      action: () => navigate('/wishlist'),
      color: 'error'
    },
    {
      icon: <Settings />,
      label: 'Edit Profile',
      action: () => navigate('/profile'),
      color: 'info'
    }
  ];

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <LocalShipping sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning'
    },
    {
      title: 'Delivered Orders',
      value: deliveredOrders,
      icon: <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success'
    },
    {
      title: 'Cart Items',
      value: cartItems?.length || 0,
      icon: <ShoppingCart sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info'
    }
  ];

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Please log in to access your dashboard
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {console.log('Rendering avatar with first name:', user?.first_name)}
                {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>

            </Grid>
            <Grid item xs>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back, {user?.first_name}!
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Here's what's happening with your account today
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                icon={<Star />}
                label={`Member since ${new Date(user?.created_at).getFullYear()}`}
                color="primary"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="glass-effect enhanced-card" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Activity Overview */}
        <Grid sx={{ mb: 6 }}>
          {stats && (
            <Card className="glass-effect" sx={{ mt: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2">
                    Activity Overview
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        {stats.total_spent || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>
                        {stats.average_order_value || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Order Value
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success" sx={{ fontWeight: 700 }}>
                        {stats.favorite_category || 'None'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Favorite Category
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info" sx={{ fontWeight: 700 }}>
                        {stats.last_order_date ? new Date(stats.last_order_date).toLocaleDateString() : 'Never'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Order
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

          <Grid container spacing={4}>
            {/* Recent Orders */}
            <Grid item xs={12} lg={8}>
              <Card className="glass-effect">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <History sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      Recent Orders
                    </Typography>
                  </Box>

                  {ordersLoading ? (
                    <Box sx={{ p: 2 }}>
                      <LinearProgress />
                    </Box>
                  ) : recentOrders.length > 0 ? (
                    <List>
                      {recentOrders.map((order, index) => (
                        <React.Fragment key={order.id}>
                          <ListItem>
                            <ListItemIcon>
                              <Receipt color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={`Order #${order.order_number}`}
                              secondary={`${order.items.length} items • ₹${order.total_amount} • ${new Date(order.created_at).toLocaleDateString()}`}
                            />
                            <Chip
                              label={order.status}
                              color={
                                order.status === 'delivered' ? 'success' :
                                  order.status === 'pending' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                          </ListItem>
                          {index < recentOrders.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No orders yet. Start shopping to see your orders here!
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/products')}
                      >
                        Start Shopping
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions & Profile Summary */}
            <Grid item xs={12} lg={4}>
              {/* Quick Actions */}
              <Card className="glass-effect" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={1}>
                    {quickActions.map((action, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          variant="outlined"
                          startIcon={action.icon}
                          onClick={action.action}
                          sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            mb: 1
                          }}
                          color={action.color}
                        >
                          {action.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Profile Summary */}
              <Card className="glass-effect">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" component="h3">
                      Profile Summary
                    </Typography>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={user?.email || 'Not provided'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={user?.phone || 'Not provided'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Member Since"
                        secondary={new Date(user?.created_at).toLocaleDateString()}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Wishlist Items"
                        secondary={wishlistItems?.length || 0}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
