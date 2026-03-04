import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // primary, secondary, danger, outline
  size = 'md',      // sm, md, lg
  isLoading = false,
  disabled = false,
  fullWidth = false 
}) => {
  const className = `
    ${styles.btn} 
    ${styles[variant]} 
    ${styles[size]} 
    ${fullWidth ? styles.fullWidth : ''}
  `.trim();

  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick} 
      disabled={disabled || isLoading}
    >
      {isLoading ? <span className={styles.loader}></span> : children}
    </button>
  );
};

export default Button;