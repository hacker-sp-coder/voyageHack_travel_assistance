import React, { useState } from 'react';
import { IconX, IconAlertTriangle } from './Icons';

export function IssueWarningModal({ isOpen, onClose, retailer, existingWarnings, onIssue }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !retailer) return null;

  const nextLevel = Math.min(3, (existingWarnings?.length || 0) + 1);
  const levelMessages = {
    1: 'The retailer will be notified and given a 14-day deadline to take corrective action.',
    2: 'The retailer will be required to take mandatory corrective action. Account will be placed Under Observation.',
    3: 'This case will be escalated to admin investigation. The admin may suspend or ban the retailer based on evidence.',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) { setError('Please provide a reason for the warning.'); return; }
    if (reason.trim().length < 10) { setError('Reason must be at least 10 characters.'); return; }
    onIssue(reason.trim());
  };

  return (
    <div className="ts-modal-backdrop" onClick={onClose}>
      <div className="ts-modal-box" onClick={e => e.stopPropagation()}>
        <div className="ts-modal-header">
          <h3 className="ts-modal-title">Issue Warning — {retailer.name}</h3>
          <button type="button" className="ts-modal-close" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        <div className={`ts-warning-level-banner lvl-${nextLevel}`}>
          <IconAlertTriangle size={20} />
          <div>
            <span className="ts-wl-title">Warning Level {nextLevel}</span>
            <p className="ts-wl-desc">{levelMessages[nextLevel]}</p>
          </div>
        </div>

        {existingWarnings?.length > 0 && (
          <div className="ts-existing-warnings-note">
            <span>This retailer already has <strong>{existingWarnings.length}</strong> active warning(s).</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="ts-form">
          <div className="ts-form-field">
            <label className="ts-label">Reason for Warning *</label>
            <textarea
              className={`ts-textarea ${error ? 'error' : ''}`}
              rows={4}
              placeholder="Describe the specific issue, evidence, and what corrective action is expected..."
              value={reason}
              onChange={e => { setReason(e.target.value); setError(''); }}
            />
            {error && <span className="ts-error">{error}</span>}
          </div>

          <div className="ts-info-banner">
            <IconAlertTriangle size={14} />
            <span>Warnings must be based on substantiated issues. The retailer will have a reasonable response deadline. Administrators can clear warnings if satisfactory evidence is provided.</span>
          </div>

          <div className="ts-modal-footer">
            <button type="button" className="ts-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className={`ts-btn-confirm ${nextLevel === 3 ? 'danger' : ''}`}>
              Issue Warning {nextLevel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
