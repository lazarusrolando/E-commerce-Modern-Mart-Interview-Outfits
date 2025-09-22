import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Pagination,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import {
  FilterList,
  Search,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Clear
} from '@mui/icons-material';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const { api } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  // State for filters and sorting
  const [selectedFilters, setSelectedFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    priceRange: [0, 10000],
    size: '',
    discount: searchParams.get('discount') === 'true',
    featured: searchParams.get('featured') === 'true'
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'DESC');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Convert slug to category name
  const slugToCategoryName = (categorySlug) => {
    if (!categorySlug) return '';

    // Convert slug back to readable category name
    return categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Set category from slug if present
  React.useEffect(() => {
    if (slug) {
      const categoryName = slugToCategoryName(slug);
      setSelectedFilters(prev => ({
        ...prev,
        category: categoryName
      }));
    }
  }, [slug]);

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery(
    ['products', { ...selectedFilters, sortBy, sortOrder, searchTerm, page }],
    async () => {
      // Build query params for filters
      const params = new URLSearchParams();

      if (selectedFilters.category) {
        params.append('category', selectedFilters.category);
      }
      if (selectedFilters.brand) {
        params.append('brand', selectedFilters.brand);
      }
      if (selectedFilters.discount) {
        params.append('discount', 'true');
      }
      if (selectedFilters.featured) {
        params.append('featured', 'true');
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page);

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    },
    {
      keepPreviousData: true,
    }
  );

  // Fetch filter options
  const { data: filterOptions } = useQuery(
    'filterOptions',
    async () => {
      const response = await api.get('/products');
      return response.data.filters;
    }
  );

  // URL update disabled to keep clean URLs

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      category: '',
      brand: '',
      priceRange: [0, 10000],
      size: '',
      discount: false,
      featured: false
    });
    setSearchTerm('');
    setSortBy('');
    setSortOrder('');
    setPage();
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (productId) => {
    await toggleWishlist(productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(value =>
    value && (Array.isArray(value) ? value[0] !== 0 || value[1] !== 10000 : value !== '')
  ) || searchTerm;

  return (
    <Container maxWidth={filterOptions && filterOptions.brands && filterOptions.brands.length > 5} sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
          Professional Outfits
        </Typography>

        {/* Search and Filters Bar */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
          <Autocomplete
            freeSolo
            options={productsData?.products?.map((product) => product.name) || []}
            inputValue={searchTerm}
            onInputChange={(event, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                setSearchTerm(newValue);
                setPage(1);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search products..."
                size="small"
                sx={{ minWidth: 300 }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            )}
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFiltersOpen(true)}
          >
            Filters
          </Button>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="created_at">Newest</MenuItem>
              <MenuItem value="price">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name">Name: A to Z</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button
              variant="text"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              color="error"
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Active filters chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {selectedFilters.category && (
            <Chip
              label={`Category: ${selectedFilters.category}`}
              onDelete={() => handleFilterChange('category', '')}
            />
          )}
          {selectedFilters.brand && (
            <Chip
              label={`Brand: ${selectedFilters.brand}`}
              onDelete={() => handleFilterChange('brand', '')}
            />
          )}
          {selectedFilters.discount && (
            <Chip
              label="Discounted"
              onDelete={() => handleFilterChange('discount', false)}
            />
          )}
          {selectedFilters.featured && (
            <Chip
              label="Featured"
              onDelete={() => handleFilterChange('featured', false)}
            />
          )}
          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={() => setSearchTerm('')}
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {/* Products Grid */}
        <Grid item xs={12}>
          {isLoading ? (
            <Grid container spacing={3} justifyContent="center">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item}>
                  <Card sx={{ height: '100%' }}>
                    <Box sx={{ height: 200, bgcolor: 'grey.100' }} />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        Loading...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : productsData?.products?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button variant="contained" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3} justifyContent="center">
                {productsData?.products?.map((product) => (
                  <Grid item xs={12} sm={6} md={3} lg={3} key={product.id}>
                    <Card sx={{ height: '100%', position: 'relative' }}>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.2)'
                          }
                        }}
                        onClick={() => handleToggleWishlist(product.id)}
                      >
                        {wishlistItems.some(item => item.id === product.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>

                      {product.discount_percentage > 0 && (
                        <Chip
                          label={`${product.discount_percentage}% OFF`}
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 1
                          }}
                        />
                      )}

                      <CardMedia
                        component="img"
                        height="250"
                        image={product.primary_image}
                        alt={product.name}
                        sx={{ objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      />

                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {product.brand}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                          <Rating value={product.average_rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.review_count})
                          </Typography>
                        </Box>

                        {product.size_chart && product.size_chart.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                            {product.size_chart.map(size => (
                              <Button key={size} size="small" variant="outlined" sx={{ minWidth: 24, height: 24, fontSize: '0.65rem', padding: '0 6px' }}>{size.toUpperCase()}</Button>
                            ))}
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" color="primary">
                              {formatPrice(product.price)}
                            </Typography>
                            {product.original_price > product.price && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through' }}
                              >
                                {formatPrice(product.original_price)}
                              </Typography>
                            )}
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => handleAddToCart(product.id)}
                            color="primary"
                          >
                            <ShoppingCart />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {productsData?.pagination && productsData.pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={productsData.pagination.totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Filters Drawer */}
      <Drawer
        anchor="right"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            padding: 2
          }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>

          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedFilters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {filterOptions?.categories?.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Brand Filter */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedFilters.brand}
                label="Brand"
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <MenuItem value="">All Brands</MenuItem>
                {filterOptions?.brands?.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Price Range Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Price Range: ₹{selectedFilters.priceRange[0]} - ₹{selectedFilters.priceRange[1]}
            </Typography>
            <Slider
              value={selectedFilters.priceRange}
              onChange={(event, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Size Filter */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={selectedFilters.size}
                label="Size"
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <MenuItem value="">All Sizes</MenuItem>
                {filterOptions?.sizes?.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Discount and Featured Checkboxes */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFilters.discount}
                  onChange={(e) => handleFilterChange('discount', e.target.checked)}
                />
              }
              label="Discounted Items"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFilters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                />
              }
              label="Featured Products"
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setFiltersOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setFiltersOpen(false);
                // Filters are already applied through handleFilterChange
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
