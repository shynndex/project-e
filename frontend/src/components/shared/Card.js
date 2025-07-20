import React from 'react';

const Card = ({ children, className = '', padding = true, shadow = true }) => {
  const classes = `
    bg-white rounded-lg
    ${shadow ? 'shadow-md hover:shadow-lg transition-shadow' : ''}
    ${padding ? 'p-6' : ''}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;