import React from 'react';
import './button.css';

function Button({ children, onClick, disabled }) {
  return (
    <button className="simple-btn" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
