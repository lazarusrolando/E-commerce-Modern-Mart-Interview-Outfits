import React from 'react';
import { Button, CircularProgress, Box, useTheme } from '@mui/material';
import { useRippleAnimation } from '../../hooks/useAnimation';

const AnimatedButton = ({
  children,
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  className = '',
  loading = false,
  loadingText = 'Loading...',
  ...props
}) => {
  const theme = useTheme();
  const { ripple, handleClick } = useRippleAnimation();

  const handleButtonClick = (event) => {
    handleClick(event);
    if (onClick) {
      onClick(event);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = {
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      willChange: 'transform, box-shadow',
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: '12px',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      }
    };

    const variantStyles = {
      contained: {
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        '&:hover': {
          background: `linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)`,
          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
        },
        '&.Mui-disabled': {
          background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
        }
      },
      outlined: {
        border: '2px solid',
        borderColor: 'primary.main',
        color: 'primary.main',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          borderColor: 'primary.dark',
        },
        '&.Mui-disabled': {
          borderColor: 'grey.400',
          color: 'grey.400',
        }
      },
      text: {
        color: 'primary.main',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
        },
        '&.Mui-disabled': {
          color: 'grey.400',
        }
      }
    };

    const sizeStyles = {
      small: {
        padding: '6px 16px',
        fontSize: '0.875rem',
      },
      medium: {
        padding: '8px 20px',
        fontSize: '1rem',
      },
      large: {
        padding: '12px 24px',
        fontSize: '1.125rem',
      }
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...sx
    };
  };

  const getSpinnerColor = () => {
    return theme.palette.mode === 'dark' ? '#fff' : '#1976d2';
  };

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      onClick={handleButtonClick}
      sx={getButtonStyles()}
      className={`gradient-btn ${className}`}
      {...props}
    >
      {loading ? (
        <Box display="flex" alignItems="center">
          <CircularProgress size={20} sx={{ mr: 1, color: getSpinnerColor() }} />
          {loadingText}
        </Box>
      ) : (
        children
      )}

      {/* Ripple Effect */}
      {ripple.active && (
        <span
          style={{
            position: 'absolute',
            top: ripple.y - 20,
            left: ripple.x - 20,
            width: 40,
            height: 40,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            animation: 'scaleIn 0.6s ease-out',
            pointerEvents: 'none'
          }}
        />
      )}
    </Button>
  );
};

export default AnimatedButton;
