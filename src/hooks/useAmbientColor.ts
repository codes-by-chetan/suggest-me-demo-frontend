import { useState, useEffect } from 'react';

export function useAmbientColor(imageUrl: string): string {
  const [ambientColor, setAmbientColor] = useState<string>('rgb(34, 197, 94)'); // Default green-500

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Use a smaller canvas for better performance
        canvas.width = 50;
        canvas.height = 50;
        
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        
        // Calculate average color
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < imageData.length; i += 16) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Darken the color a bit for better contrast
        r = Math.floor(r * 0.7);
        g = Math.floor(g * 0.7);
        b = Math.floor(b * 0.7);
        
        setAmbientColor(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        // If there's a CORS error or any other error, keep the default color
        console.error('Error extracting ambient color:', error);
      }
    };
    
    img.onerror = () => {
      // Keep default color on error
      console.error('Error loading image for ambient color');
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

  return ambientColor;
}
