import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  labelClassName = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;