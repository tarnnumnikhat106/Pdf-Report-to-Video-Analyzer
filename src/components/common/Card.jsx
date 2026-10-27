import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-lg border border-line ${
        hoverEffect
          ? 'transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-muted/60 hover:shadow-[0_18px_40px_-30px_rgba(28,27,24,0.45)]'
          : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
