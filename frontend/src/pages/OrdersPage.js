import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  AssignmentReturn
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);


  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // In real app: const response = await api.get('/api/orders');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders([]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle color="success" />;
      case 'processing':
        return <LocalShipping color="info" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'cancelled':
        return <Cancel color="error" />;
      case 'returned':
        return <AssignmentReturn color="action" />;
      default:
        return <Pending color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'returned':
        return 'default';
      default:
        return 'warning';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Processing
        return order.status === 'processing' || order.status === 'pending';
      case 2: // Delivered
        return order.status === 'delivered';
      case 3: // Cancelled
        return order.status === 'cancelled';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Loading your orders...
        </Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          No orders yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start shopping to see your orders here.
        </Typography>
        <Button variant="contained" size="large" href="/products">
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Orders" />
          <Tab label="Processing" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>

      {filteredOrders.length === 0 ? (
        <Alert severity="info">
          No orders found in this category.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredOrders.map((order) => (
            <Card key={order.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {formatDate(order.date)}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(order.status)}
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Items
                    </Typography>
                    {order.items.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                          <Typography variant="body2">
                            {formatCurrency(item.price)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      Phone: {order.shippingAddress.phone}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Payment Method
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {order.paymentMethod.toUpperCase()}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Order Total
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(order.total)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                {order.status === 'delivered' && (
                  <Button variant="outlined" size="small">
                    Rate Products
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button variant="outlined" color="error" size="small">
                    Cancel Order
                  </Button>
                )}
                <Button variant="contained" size="small">
                  View Details
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="outlined" color="secondary" size="small">
                    Return/Exchange
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrdersPage;
