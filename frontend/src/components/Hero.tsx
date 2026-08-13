import React from 'react';
import { HeroBackground } from './HeroBackground';
import { BrandLogo } from './BrandLogo';

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <HeroBackground />
      <BrandLogo />
    </div>
  );
};
