// Mobile-specific utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

export const getViewportHeight = () => {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
};

export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };

  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0,
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
  };
};

export const preventDefault = (e: Event) => {
  e.preventDefault();
};

export const addPassiveTouchListeners = (
  element: HTMLElement,
  handlers: {
    onTouchStart?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
  }
) => {
  const options = { passive: true };

  if (handlers.onTouchStart) {
    element.addEventListener('touchstart', handlers.onTouchStart, options);
  }
  if (handlers.onTouchMove) {
    element.addEventListener('touchmove', handlers.onTouchMove, options);
  }
  if (handlers.onTouchEnd) {
    element.addEventListener('touchend', handlers.onTouchEnd, options);
  }

  return () => {
    if (handlers.onTouchStart) {
      element.removeEventListener('touchstart', handlers.onTouchStart);
    }
    if (handlers.onTouchMove) {
      element.removeEventListener('touchmove', handlers.onTouchMove);
    }
    if (handlers.onTouchEnd) {
      element.removeEventListener('touchend', handlers.onTouchEnd);
    }
  };
};

// Touch gesture utilities
export const getTouchDistance = (touch1: Touch, touch2: Touch): number => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getTouchCenter = (touch1: Touch, touch2: Touch): { x: number; y: number } => {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    const result = fn();

    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
      });
    } else {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    }
  }

  return fn();
};