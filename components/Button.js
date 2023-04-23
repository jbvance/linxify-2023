import React from 'react';

const Button = ({
  border,
  padding,
  textColor,
  color,
  children,
  height,
  onClick,
  radius,
  width,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: textColor,
        padding,
        border,
        borderRadius: radius,
        height,
        width,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
