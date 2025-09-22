import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  Pagination,
  CircularProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  Clear
} from '@mui/icons-material';

const SearchResultsPage = () => {
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const { api } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    priceRange: [parseInt(searchParams.get('min_price')) || 0, parseInt(searchParams.get('max_price')) || 10000],
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true'
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from API when search parameters change
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setProducts([]);
        setTotalPages(1);
        return;
      }

      setLoading(true);
      
      try {
        // Map frontend sortBy to backend sort parameters
        let backendSortBy = 'created_at';
        let backendSortOrder = 'DESC';
        
        switch (sortBy) {
          case 'price-low':
            backendSortBy = 'price';
            backendSortOrder = 'ASC';
            break;
          case 'price-high':
            backendSortBy = 'price';
            backendSortOrder = 'DESC';
            break;
          case 'rating':
            backendSortBy = 'rating';
            backendSortOrder = 'DESC';
            break;
          case 'newest':
            backendSortBy = 'created_at';
            backendSortOrder = 'DESC';
            break;
          default:
            backendSortBy = 'created_at';
            backendSortOrder = 'DESC';
        }

        // Build query parameters
        const params = {
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage,
          sortBy: backendSortBy,
          sortOrder: backendSortOrder
        };

        // Add filters
        if (filters.category) params.category = filters.category;
        if (filters.brand) params.brand = filters.brand;
        if (filters.priceRange[0] > 0) params.min_price = filters.priceRange[0];
        if (filters.priceRange[1] < 10000) params.max_price = filters.priceRange[1];
        if (filters.inStock) params.inStock = 'true';
        if (filters.onSale) params.discount = 'true';

        const response = await api.get('/products', { params });
        
        if (response.data.success) {
          setProducts(response.data.products);
          setTotalPages(response.data.pagination?.totalPages || 1);
          
          // Update URL search params
          const newSearchParams = new URLSearchParams();
          if (searchQuery) newSearchParams.set('search', searchQuery);
          if (filters.category) newSearchParams.set('category', filters.category);
          if (filters.brand) newSearchParams.set('brand', filters.brand);
          if (filters.priceRange[0] > 0) newSearchParams.set('min_price', filters.priceRange[0]);
          if (filters.priceRange[1] < 10000) newSearchParams.set('max_price', filters.priceRange[1]);
          if (filters.inStock) newSearchParams.set('inStock', 'true');
          if (filters.onSale) newSearchParams.set('onSale', 'true');
          if (sortBy !== 'relevance') newSearchParams.set('sortBy', sortBy);
          if (currentPage > 1) newSearchParams.set('page', currentPage);
          
          setSearchParams(newSearchParams);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, filters, sortBy, currentPage, api, setSearchParams]);

  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  const handleCheckboxChange = (filterName) => (event) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: event.target.checked
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 10000],
      size: '',
      color: '',
      inStock: false,
      onSale: false
    });
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Searching for "{searchQuery}"...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search for products, brands, or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {products.length} results for "{searchQuery}"
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              Filters
            </Button>
            
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1 }} />}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        {filtersOpen && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Filters</Typography>
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </Box>

              {/* Price Range */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Price Range
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `₹${value}`}
                  min={0}
                  max={10000}
                  step={500}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">₹{filters.priceRange[0]}</Typography>
                  <Typography variant="body2">₹{filters.priceRange[1]}</Typography>
                </Box>
              </Box>

              {/* Availability */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.inStock}
                    onChange={handleCheckboxChange('inStock')}
                  />
                }
                label="In Stock Only"
                sx={{ mb: 2 }}
              />

              {/* On Sale */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.onSale}
                    onChange={handleCheckboxChange('onSale')}
                  />
                }
                label="On Sale"
                sx={{ mb: 3 }}
              />

              <Button variant="contained" fullWidth>
                Apply Filters
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={filtersOpen ? 9 : 12}>
          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No results found for "{searchQuery}"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search terms or browse our categories
              </Typography>
              <Button variant="contained" href="/categories">
                Browse Categories
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchResultsPage;
