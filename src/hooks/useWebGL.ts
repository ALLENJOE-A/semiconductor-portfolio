import { useState, useEffect } from 'react';

/**
 * Detects WebGL support. Returns false if WebGL is unavailable,
 * enabling the fallback rendering path.
 */
export function useWebGL(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
