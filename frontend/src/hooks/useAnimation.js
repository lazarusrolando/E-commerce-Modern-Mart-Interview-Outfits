import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for handling animations with Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - Ref and animation state
 */
export const useAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally unobserve after animation
          if (options.unobserveOnVisible) {
            observer.unobserve(entry.target);
          }
        } else if (options.animateOnLeave) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

/**
 * Hook for staggered animations in lists
 * @param {number} count - Number of items to stagger
 * @param {Object} options - Animation options
 * @returns {Array} - Array of animation states
 */
export const useStaggeredAnimation = (count, options = {}) => {
  const [animations, setAnimations] = useState(Array(count).fill(false));

  const updateAnimation = (index, isVisible) => {
    setAnimations(prev => {
      const newAnimations = [...prev];
      newAnimations[index] = isVisible;
      return newAnimations;
    });
  };

  return { animations, updateAnimation };
};

/**
 * Hook for scroll-based animations
 * @param {number} threshold - Scroll threshold for activation
 * @returns {boolean} - Whether the threshold has been reached
 */
export const useScrollAnimation = (threshold = 100) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

/**
 * Hook for hover animations
 * @returns {Object} - Hover state and handlers
 */
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onTouchStart: () => setIsHovered(true),
    onTouchEnd: () => setIsHovered(false)
  };

  return { isHovered, hoverHandlers };
};

/**
 * Hook for click/tap animations (ripple effect)
 * @returns {Object} - Click handlers and state
 */
export const useRippleAnimation = () => {
  const [ripple, setRipple] = useState({ x: 0, y: 0, active: false });

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true
    });

    // Reset after animation completes
    setTimeout(() => setRipple(prev => ({ ...prev, active: false })), 600);
  };

  return { ripple, handleClick };
};

/**
 * Hook for loading animations with delay
 * @param {number} delay - Delay in milliseconds
 * @returns {boolean} - Whether loading should be shown
 */
export const useLoadingAnimation = (delay = 300) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showLoading;
};

/**
 * Hook for sequential animations (one after another)
 * @param {number} count - Number of items
 * @param {number} interval - Interval between animations
 * @returns {Array} - Array of animation states
 */
export const useSequentialAnimation = (count, interval = 100) => {
  const [animatedItems, setAnimatedItems] = useState(Array(count).fill(false));

  useEffect(() => {
    const timers = animatedItems.map((_, index) => {
      return setTimeout(() => {
        setAnimatedItems(prev => {
          const newItems = [...prev];
          newItems[index] = true;
          return newItems;
        });
      }, index * interval);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [count, interval]);

  return animatedItems;
};

/**
 * Hook for parallax scrolling effect
 * @param {number} speed - Parallax speed (0-1)
 * @returns {Object} - Ref and transform style
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.scrollY;
        const offset = scrolled * speed;
        setTransform(`translateY(${offset}px)`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, style: { transform } };
};

// Animation presets for common use cases
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.8, 
      ease: [0.175, 0.885, 0.32, 1.275] 
    }
  }
};
