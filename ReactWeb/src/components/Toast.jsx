import React from 'react';
import { IconCheck, IconAlertTriangle, IconX } from './Icons';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className={`toast-container ${isError ? 'toast-error' : 'toast-success'}`} role="alert">
      <div className="toast-icon">
        {isSuccess ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
      </div>
      <div className="toast-message">
        {toast.message}
      </div>
      <button 
        type="button" 
        className="toast-close" 
        onClick={onClose} 
        aria-label="Dismiss notification"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}
