import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Divider,
  Alert
} from '@mui/material';
import {
  CreditCard,
  LocalShipping,
  Payment
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const { cartItems, total, clearCart } = useCart();
  useAuth(); // Call useAuth() if needed for side effects, or remove entirely if not required
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [saveAddress, setSaveAddress] = useState(true);

  const handleShippingChange = (field) => (event) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      clearCart();
      toast.success('Order placed successfully!');
      
      // Redirect to orders page or home
      // navigate('/orders');
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderShippingStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Full Name"
            value={shippingInfo.fullName}
            onChange={handleShippingChange('fullName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            type="tel"
            value={shippingInfo.phone}
            onChange={handleShippingChange('phone')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address Line 1"
            value={shippingInfo.addressLine1}
            onChange={handleShippingChange('addressLine1')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2"
            value={shippingInfo.addressLine2}
            onChange={handleShippingChange('addressLine2')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingInfo.city}
            onChange={handleShippingChange('city')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="State"
            value={shippingInfo.state}
            onChange={handleShippingChange('state')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="PIN Code"
            value={shippingInfo.pincode}
            onChange={handleShippingChange('pincode')}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
            }
            label="Save this address for future orders"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderPaymentStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset">
        <FormLabel component="legend">Choose payment method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="razorpay"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard />
                <span>Credit/Debit Card (Razorpay)</span>
              </Box>
            }
          />
          <FormControlLabel
            value="upi"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment />
                <span>UPI (Google Pay, PhonePe, Paytm)</span>
              </Box>
            }
          />
          <FormControlLabel
            value="netbanking"
            control={<Radio />}
            label="Net Banking"
          />
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping />
                <span>Cash on Delivery (COD)</span>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {paymentMethod === 'cod' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Cash on Delivery available. Additional ₹50 charge may apply.
        </Alert>
      )}
    </Paper>
  );

  const renderReviewStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" gutterBottom>
            Shipping Address
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {shippingInfo.fullName}
            <br />
            {shippingInfo.addressLine1}
            {shippingInfo.addressLine2 && <>, {shippingInfo.addressLine2}</>}
            <br />
            {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
            <br />
            {shippingInfo.country}
            <br />
            Phone: {shippingInfo.phone}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            Payment Method
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {paymentMethod === 'razorpay' && 'Credit/Debit Card'}
            {paymentMethod === 'upi' && 'UPI'}
            {paymentMethod === 'netbanking' && 'Net Banking'}
            {paymentMethod === 'cod' && 'Cash on Delivery'}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Total
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>₹{total}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>₹{total > 999 ? 0 : 99}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Tax (18%):</Typography>
              <Typography>₹{(total * 0.18).toFixed(2)}</Typography>
            </Box>
            
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">
                ₹{(total + (total > 999 ? 0 : 99) + (total * 0.18)).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingStep();
      case 1:
        return renderPaymentStep();
      case 2:
        return renderReviewStep();
      default:
        return 'Unknown step';
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add some products to your cart before checkout.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          loading={loading.toString()}
          disabled={loading}
        >
          {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
