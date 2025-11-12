import React from 'react';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const SIZES = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({ variant = 'primary', size = 'md', disabled = false, className = '', onClick, children, ...rest }) {
  const classes = [VARIANTS[variant] || VARIANTS.primary, SIZES[size] || SIZES.md, disabled ? 'btn-disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <button className={classes} disabled={disabled} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
