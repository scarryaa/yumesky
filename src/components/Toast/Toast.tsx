import React, { useState } from 'react';
import './Toast.scss';

const TIMEOUT = 4000;

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  setTimeout(() => {
    setIsVisible(false);
  }, TIMEOUT);

  if (!isVisible) {
    return null;
  }

  return (
    <div className='toast-container'>
      <div className='toast-inner'>
        <span className='toast-text'>{message}</span>
      </div>
    </div>
  );
};
