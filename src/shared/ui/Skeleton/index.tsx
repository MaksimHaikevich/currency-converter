import React from 'react';

export interface SkeletonProps {
  width: number;
  height: number;
  radius?: number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, radius = 8, style }) => (
  <div
    aria-hidden
    style={{
      width,
      height,
      borderRadius: radius,
      background: '#eef2f7',
      ...style,
    }}
  />
);
