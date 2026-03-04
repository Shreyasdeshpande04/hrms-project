import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name, 
  error, 
  required = false 
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default Input;