import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`form-input ${error ? 'form-input-error' : ''} ${className}`}
        style={error ? { borderColor: 'var(--red)' } : undefined}
        {...props}
      />
      {error && (
        <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}
