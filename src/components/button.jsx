import React from 'react';
import './button.css';

function Button({ children, onClick, disabled, type = "button"}) {
  return (
    <button className="simple-btn" onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

export default Button;
