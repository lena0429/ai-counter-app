import { useState, useEffect, useRef } from 'react';

interface BackgroundTheme {
  name: string;
  gradient: string;
  imageQuery?: string;
}

const backgroundThemes: BackgroundTheme[] = [
  {
    name: 'Ocean Blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    imageQuery: 'ocean waves blue',
  },
  {
    name: 'Sunset Orange',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    imageQuery: 'sunset orange sky',
  },
  {
    name: 'Forest Green',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    imageQuery: 'forest trees green',
  },
  {
    name: 'Purple Dream',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    imageQuery: 'purple flowers dreamy',
  },
  {
    name: 'Golden Hour',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    imageQuery: 'golden hour sunlight',
  },
  {
    name: 'Midnight Sky',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    imageQuery: 'night sky stars',
  },
  {
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    imageQuery: 'aurora borealis northern lights',
  },
  {
    name: 'Desert Sand',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    imageQuery: 'desert sand dunes',
  },
  {
    name: 'Ocean Depths',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    imageQuery: 'underwater ocean deep',
  },
  {
    name: 'Spring Blossom',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    imageQuery: 'cherry blossoms spring',
  },
];

const darkBackgroundThemes: BackgroundTheme[] = [
  {
    name: 'Deep Space',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    imageQuery: 'space galaxy dark',
  },
  {
    name: 'Midnight Purple',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
    imageQuery: 'purple night city',
  },
  {
    name: 'Dark Forest',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    imageQuery: 'dark forest mist',
  },
  {
    name: 'Crimson Night',
    gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    imageQuery: 'red night sky',
  },
  {
    name: 'Steel Blue',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    imageQuery: 'steel blue industrial',
  },
  {
    name: 'Obsidian',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    imageQuery: 'black abstract',
  },
  {
    name: 'Deep Ocean',
    gradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
    imageQuery: 'deep sea dark',
  },
  {
    name: 'Violet Storm',
    gradient: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)',
    imageQuery: 'storm clouds purple',
  },
  {
    name: 'Charcoal',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    imageQuery: 'charcoal texture',
  },
  {
    name: 'Dark Aurora',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    imageQuery: 'aurora night dark',
  },
];

interface UseBackgroundCycleReturn {
  currentBackground: string;
  currentThemeName: string;
  isCycling: boolean;
  toggleCycling: () => void;
  setCycling: (enabled: boolean) => void;
  cycleInterval: number;
  setCycleInterval: (seconds: number) => void;
  useImages: boolean;
  toggleUseImages: () => void;
  isLoadingImage: boolean;
  isTransitioning: boolean;
  nextBackground: string;
}

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your key
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

// Fallback to a free image service if no Unsplash key
const getRandomImageUrl = async (query: string): Promise<string> => {
  try {
    if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      // Use Picsum Photos as fallback (free, no API key required)
      const width = 1920;
      const height = 1080;
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/id/${randomId}/${width}/${height}`;
    }

    // Use Unsplash API if key is provided
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.warn('Failed to fetch image, using gradient fallback:', error);
    return '';
  }
};

export const useBackgroundCycle = (
  isRunning: boolean,
  theme: 'light' | 'dark'
): UseBackgroundCycleReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);
  const [cycleInterval, setCycleInterval] = useState(10);
  const [useImages, setUseImages] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [nextImageUrl, setNextImageUrl] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const themes = theme === 'dark' ? darkBackgroundThemes : backgroundThemes;
  const currentTheme = themes[currentIndex];
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  
  const currentBackground = useImages && currentImageUrl 
    ? `url(${currentImageUrl})` 
    : currentTheme.gradient;
  const nextBackground = useImages && nextImageUrl 
    ? `url(${nextImageUrl})` 
    : nextTheme.gradient;
  const currentThemeName = currentTheme.name;

  // Load image for theme
  const loadImageForTheme = async (theme: BackgroundTheme, isNext = false) => {
    if (!useImages || !theme.imageQuery) return;
    
    if (!isNext) {
      setIsLoadingImage(true);
    }
    
    try {
      const imageUrl = await getRandomImageUrl(theme.imageQuery);
      if (isNext) {
        setNextImageUrl(imageUrl);
      } else {
        setCurrentImageUrl(imageUrl);
      }
    } catch (error) {
      console.warn('Failed to load image:', error);
      if (isNext) {
        setNextImageUrl('');
      } else {
        setCurrentImageUrl('');
      }
    } finally {
      if (!isNext) {
        setIsLoadingImage(false);
      }
    }
  };

  // Load initial image and preload next image
  useEffect(() => {
    if (useImages) {
      loadImageForTheme(currentTheme);
      loadImageForTheme(nextTheme, true);
    }
  }, [useImages, currentIndex]);

  // Cycle background when timer is running and cycling is enabled
  useEffect(() => {
    if (isRunning && isCycling) {
      intervalRef.current = setInterval(() => {
        // Start transition
        setIsTransitioning(true);
        
        // After transition duration, change the background
        transitionTimeoutRef.current = setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % themes.length);
          setIsTransitioning(false);
        }, 1500); // Match the CSS transition duration
      }, cycleInterval * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isRunning, isCycling, cycleInterval, themes.length]);

  // Reset to first background when cycling is disabled
  useEffect(() => {
    if (!isCycling) {
      setCurrentIndex(0);
    }
  }, [isCycling]);

  const toggleCycling = () => {
    setIsCycling(!isCycling);
  };

  const setCycling = (enabled: boolean) => {
    setIsCycling(enabled);
  };

  const toggleUseImages = () => {
    setUseImages(!useImages);
    if (!useImages) {
      // Load image when enabling images
      loadImageForTheme(currentTheme);
    }
  };

  return {
    currentBackground,
    currentThemeName,
    isCycling,
    toggleCycling,
    setCycling,
    cycleInterval,
    setCycleInterval,
    useImages,
    toggleUseImages,
    isLoadingImage,
    isTransitioning,
    nextBackground,
  };
}; 