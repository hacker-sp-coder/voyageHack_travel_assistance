import React from 'react';
import { IconAlertTriangle, IconTrash, IconX } from './Icons';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, retailer }) {
  if (!isOpen || !retailer) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-delete" onClick={(e) => e.stopPropagation()}>
        <div className="modal-delete-header">
          <div className="delete-icon-badge">
            <IconAlertTriangle size={24} />
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="modal-delete-body">
          <h3 className="delete-title">Delete Retailer Partner?</h3>
          <p className="delete-warning">
            Are you sure you want to remove <strong>"{retailer.name}"</strong> located at{' '}
            <strong>{retailer.hub} ({retailer.terminal})</strong>?
          </p>
          <div className="delete-consequence-card">
            <span>⚠️ All active store analytics, traveler reviews, and partner listing records will be permanently deleted from the terminal system.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Keep Retailer
          </button>
          <button
            type="button"
            className="btn-modal-danger"
            onClick={() => onConfirm(retailer.id)}
          >
            <IconTrash size={16} />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
