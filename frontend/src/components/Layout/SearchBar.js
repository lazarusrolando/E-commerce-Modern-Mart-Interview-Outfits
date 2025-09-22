import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onClose, sx }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Mock popular searches - in real app, this would come from API
  const popularSearches = [
    'Formal Shirts',
    'Business Suits',
    'Interview Dresses',
    'Professional Blazers',
    'Office Pants',
    'Corporate Shoes',
    'Business Accessories'
  ];

  // Mock recent searches - in real app, this would be stored in localStorage
  const recentSearches = [
    'White Shirt',
    'Black Blazer',
    'Formal Shoes'
  ];

  const handleSearch = (term = searchTerm) => {
    if (term.trim()) {
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
      setSearchTerm('');
      if (onClose) onClose();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePopularSearchClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const showSuggestions = isFocused && searchTerm.length === 0;

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for professional outfits, brands, and more..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }
        }}
        size="small"
      />

      {/* Search Suggestions */}
      <Fade in={showSuggestions}>
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 1300,
            maxHeight: 300,
            overflow: 'auto',
            display: showSuggestions ? 'block' : 'none'
          }}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Recent Searches
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {recentSearches.map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    size="small"
                    onClick={() => handlePopularSearchClick(search)}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Popular Searches */}
          <Box sx={{ p: 2, pt: recentSearches.length > 0 ? 0 : 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
              Popular Searches
            </Typography>
            <List dense>
              {popularSearches.map((search, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handlePopularSearchClick(search)}>
                    <ListItemText primary={search} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default SearchBar;
