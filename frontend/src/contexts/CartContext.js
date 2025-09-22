import React, { createContext, useContext, useState} from 'react';
import { useQuery, useMutation} from 'react-query';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { api, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);

  // Fetch cart data
  const { isLoading, refetch } = useQuery(
    'cart',
    async () => {
      if (!isAuthenticated) {
        return { cart: { items: [], summary: null } };
      }
      const response = await api.get('/cart');
      return response.data;
    },
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        setCartItems(data.cart.items || []);
        setCartSummary(data.cart.summary || null);
        setCartCount(data.cart.items?.length || 0);
      },
      onError: (error) => {
        console.error('Failed to fetch cart:', error);
        toast.error('Failed to load cart');
      }
    }
  );

  // Fetch cart count
  const { refetch: refetchCount } = useQuery(
    'cartCount',
    async () => {
      if (!isAuthenticated) {
        return { count: 0 };
      }
      const response = await api.get('/cart/count');
      return response.data;
    },
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        setCartCount(data.count || 0);
      }
    }
  );

  // Add to cart mutation
  const addToCartMutation = useMutation(
    async (itemData) => {
      const response = await api.post('/cart/add', itemData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Product added to cart!');
        refetch();
        refetchCount();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to add to cart';
        toast.error(message);
      }
    }
  );

  // Update cart item mutation
  const updateCartItemMutation = useMutation(
    async ({ itemId, quantity }) => {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data;
    },
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update cart';
        toast.error(message);
      }
    }
  );

  // Remove from cart mutation
  const removeFromCartMutation = useMutation(
    async (itemId) => {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Item removed from cart');
        refetch();
        refetchCount();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to remove from cart';
        toast.error(message);
      }
    }
  );

  // Clear cart mutation
  const clearCartMutation = useMutation(
    async () => {
      const response = await api.delete('/cart');
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Cart cleared successfully');
        refetch();
        refetchCount();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to clear cart';
        toast.error(message);
      }
    }
  );

  // Apply coupon mutation
  const applyCouponMutation = useMutation(
    async (couponCode) => {
      const response = await api.post('/cart/apply-coupon', { coupon_code: couponCode });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Coupon applied successfully!');
        return data;
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to apply coupon';
        toast.error(message);
        throw error;
      }
    }
  );

  // Add item to cart
  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    await addToCartMutation.mutateAsync({
      productId: productId,
      quantity,
      size,
      color
    });
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    await updateCartItemMutation.mutateAsync({ itemId, quantity });
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  // Clear entire cart
  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  // Apply coupon
  const applyCoupon = async (couponCode) => {
    return await applyCouponMutation.mutateAsync(couponCode);
  };

  // Get item count in cart
  const getItemCount = () => {
    return cartCount;
  };

  // Check if product is in cart
  const isInCart = (productId, size = null, color = null) => {
    return cartItems.some(item => 
      item.product_id === productId && 
      item.size === size && 
      item.color === color
    );
  };

  // Get cart total
  const getCartTotal = () => {
    return cartSummary?.total || 0;
  };

  // Get cart subtotal
  const getSubtotal = () => {
    return cartSummary?.subtotal || 0;
  };

  // Get shipping cost
  const getShipping = () => {
    return cartSummary?.shipping || 0;
  };

  // Get tax amount
  const getTax = () => {
    return cartSummary?.tax || 0;
  };

  // Get discount amount
  const getDiscount = () => {
    return cartSummary?.discount || 0;
  };

  // Check if free shipping is eligible
  const isFreeShippingEligible = () => {
    return cartSummary?.free_shipping_eligible || false;
  };

  // Get free shipping threshold amount left
  const getFreeShippingThresholdLeft = () => {
    return cartSummary?.free_shipping_threshold || 0;
  };

  const value = {
    // State
    cartItems,
    cartSummary,
    cartCount,
    isLoading,
    
    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    refetchCart: refetch,
    
    // Getters
    getItemCount,
    isInCart,
    getCartTotal,
    getSubtotal,
    getShipping,
    getTax,
    getDiscount,
    isFreeShippingEligible,
    getFreeShippingThresholdLeft,
    
    // Mutation states
    isAdding: addToCartMutation.isLoading,
    isUpdating: updateCartItemMutation.isLoading,
    isRemoving: removeFromCartMutation.isLoading,
    isClearing: clearCartMutation.isLoading,
    isApplyingCoupon: applyCouponMutation.isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
