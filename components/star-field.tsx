'use client';

import { useEffect, useRef } from 'react';

export function StarField() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;
    
    const starsContainer = starsRef.current;
    const numStars = 100;
    
    // Clear any existing stars
    starsContainer.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random opacity
      star.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      
      // Add twinkle animation to some stars
      if (Math.random() > 0.7) {
        star.classList.add('twinkle');
        
        // Randomize animation delay
        star.style.animationDelay = `${Math.random() * 4}s`;
      }
      
      starsContainer.appendChild(star);
    }
  }, []);

  return <div ref={starsRef} className="stars" />;
}