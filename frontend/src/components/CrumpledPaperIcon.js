import React from 'react';
import { motion } from 'framer-motion';

export const CrumpledPaperIcon = ({ className = '', size = 80 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="crumple-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF8F3" />
          <stop offset="30%" stopColor="#F5F1E8" />
          <stop offset="60%" stopColor="#EAE3D5" />
          <stop offset="100%" stopColor="#DED6C8" />
        </linearGradient>
      </defs>
      
      {/* Main crumpled paper shape */}
      <path
        d="M 15,12 Q 18,8 25,10 L 38,8 Q 45,7 52,12 L 65,10 Q 72,9 78,14 L 85,15 Q 92,18 90,25 L 88,40 Q 89,48 85,55 L 87,68 Q 88,75 82,82 L 75,88 Q 68,92 60,88 L 48,90 Q 40,91 32,87 L 20,89 Q 13,88 10,82 L 8,70 Q 7,62 11,55 L 9,42 Q 8,35 12,28 L 13,18 Q 14,12 15,12 Z"
        fill="url(#paper-gradient)"
        filter="url(#crumple-shadow)"
        stroke="#C8BFB0"
        strokeWidth="0.5"
      />
      
      {/* Crumple lines - darker creases */}
      <path
        d="M 25,15 Q 28,25 30,35 Q 32,45 35,55"
        stroke="#B8AFA0"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 50,12 Q 48,22 47,32 Q 46,42 48,52 Q 50,62 52,72"
        stroke="#B8AFA0"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 75,18 Q 72,28 70,38 Q 68,48 66,58"
        stroke="#B8AFA0"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      
      {/* Horizontal crumples */}
      <path
        d="M 20,40 Q 35,38 50,40 Q 65,42 80,40"
        stroke="#B8AFA0"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 18,60 Q 33,62 48,60 Q 63,58 78,60"
        stroke="#B8AFA0"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      
      {/* Light highlight creases */}
      <path
        d="M 30,20 Q 35,30 38,40"
        stroke="#FFFFFF"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 60,25 Q 58,35 56,45"
        stroke="#FFFFFF"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      
      {/* Text lines on paper */}
      <line x1="25" y1="35" x2="65" y2="35" stroke="#E07B53" strokeWidth="1.5" opacity="0.6" />
      <line x1="25" y1="45" x2="70" y2="45" stroke="#E07B53" strokeWidth="1.5" opacity="0.6" />
      <line x1="25" y1="55" x2="60" y2="55" stroke="#E07B53" strokeWidth="1.5" opacity="0.6" />
      <line x1="25" y1="65" x2="68" y2="65" stroke="#E07B53" strokeWidth="1.5" opacity="0.6" />
    </motion.svg>
  );
};
