import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { api, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist data
  const { isLoading, refetch } = useQuery(
    'wishlist',
    async () => {
      if (!isAuthenticated) {
        return { wishlist: [], count: 0 };
      }
      const response = await api.get('/wishlist');
      return response.data;
    },
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        setWishlistItems(data.wishlist || []);
        setWishlistCount(data.count || 0);
      },
      onError: (error) => {
        console.error('Failed to fetch wishlist:', error);
      }
    }
  );

  // Fetch wishlist count
  const { refetch: refetchCount } = useQuery(
    'wishlistCount',
    async () => {
      if (!isAuthenticated) {
        return { count: 0 };
      }
      const response = await api.get('/wishlist/count');
      return response.data;
    },
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        setWishlistCount(data.count || 0);
      }
    }
  );

  // Check if product is in wishlist
  const checkWishlistMutation = useMutation(
    async (productId) => {
      const response = await api.get(`/wishlist/check/${productId}`);
      return response.data;
    },
    {
      onError: (error) => {
        console.error('Failed to check wishlist:', error);
      }
    }
  );

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation(
    async (productId) => {
      const response = await api.post('/wishlist/add', { product_id: productId });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Added to wishlist!');
        refetch();
        refetchCount();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to add to wishlist';
        toast.error(message);
      }
    }
  );

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation(
    async (productId) => {
      const response = await api.delete(`/wishlist/remove/${productId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Removed from wishlist');
        refetch();
        refetchCount();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to remove from wishlist';
        toast.error(message);
      }
    }
  );

  // Move to cart mutation
  const moveToCartMutation = useMutation(
    async ({ productId, quantity, size, color }) => {
      const response = await api.post(`/wishlist/move-to-cart/${productId}`, {
        quantity,
        size,
        color
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Moved to cart successfully');
        refetch();
        refetchCount();
        // Invalidate cart queries to refresh cart data
        queryClient.invalidateQueries('cart');
        queryClient.invalidateQueries('cartCount');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to move to cart';
        toast.error(message);
      }
    }
  );

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return false;
    }
    
    try {
      await addToWishlistMutation.mutateAsync(productId);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    await removeFromWishlistMutation.mutateAsync(productId);
  };

  // Move item to cart
  const moveToCart = async (productId, quantity = 1, size = null, color = null) => {
    await moveToCartMutation.mutateAsync({ productId, quantity, size, color });
  };

  // Check if product is in wishlist
  const isInWishlist = async (productId) => {
    if (!isAuthenticated) {
      return false;
    }
    
    try {
      const response = await checkWishlistMutation.mutateAsync(productId);
      return response.in_wishlist;
    } catch (error) {
      return false;
    }
  };

  // Toggle wishlist item
  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return false;
    }

    const inWishlist = await isInWishlist(productId);
    
    if (inWishlist) {
      await removeFromWishlist(productId);
      return false;
    } else {
      await addToWishlist(productId);
      return true;
    }
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistCount;
  };

  // Get wishlist items
  const getWishlistItems = () => {
    return wishlistItems;
  };

  const value = {
    // State
    wishlistItems,
    wishlistCount,
    isLoading,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    toggleWishlist,
    isInWishlist,
    refetchWishlist: refetch,
    
    // Getters
    getWishlistCount,
    getWishlistItems,
    
    // Mutation states
    isAdding: addToWishlistMutation.isLoading,
    isRemoving: removeFromWishlistMutation.isLoading,
    isMoving: moveToCartMutation.isLoading,
    isChecking: checkWishlistMutation.isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
