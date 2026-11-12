import React, { useState } from 'react';
import { IconX, IconAlertTriangle } from './Icons';

const COMPLAINT_CATEGORIES = [
  'Product not delivered',
  'Fake or counterfeit products',
  'Payment fraud',
  'Refund not received',
  'Misleading product description',
  'Poor product quality',
  'Other suspicious activity',
];

export function SubmitReviewModal({ isOpen, onClose, retailers, onSubmit }) {
  const [form, setForm] = useState({
    retailerId: retailers[0]?.id || '',
    customerName: '',
    customerId: `cust-${Date.now()}`,
    starRating: 5,
    complaintCategory: '',
    description: '',
    verifiedPurchase: false,
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.retailerId) errs.retailerId = 'Please select a retailer.';
    if (!form.customerName.trim()) errs.customerName = 'Customer name is required.';
    if (!form.description.trim()) errs.description = 'Please provide a description.';
    if (form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      ...form,
      customerId: `cust-${Date.now()}`,
      complaintCategory: form.complaintCategory || null,
    });
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="ts-modal-backdrop" onClick={onClose}>
      <div className="ts-modal-box ts-review-modal" onClick={e => e.stopPropagation()}>
        <div className="ts-modal-header">
          <h3 className="ts-modal-title">Submit Customer Review</h3>
          <button type="button" className="ts-modal-close" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ts-form">
          <div className="ts-form-field">
            <label className="ts-label">Retailer *</label>
            <select className={`ts-select ts-select-full ${errors.retailerId ? 'error' : ''}`}
              value={form.retailerId} onChange={e => updateForm('retailerId', e.target.value)}>
              {retailers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {errors.retailerId && <span className="ts-error">{errors.retailerId}</span>}
          </div>

          <div className="ts-form-field">
            <label className="ts-label">Your Name *</label>
            <input className={`ts-input ${errors.customerName ? 'error' : ''}`}
              type="text" placeholder="Full name" value={form.customerName}
              onChange={e => updateForm('customerName', e.target.value)} />
            {errors.customerName && <span className="ts-error">{errors.customerName}</span>}
          </div>

          <div className="ts-form-field">
            <label className="ts-label">Star Rating *</label>
            <div className="ts-star-picker">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button"
                  className={`ts-star-btn ${form.starRating >= s ? 'active' : ''}`}
                  onClick={() => updateForm('starRating', s)}>★</button>
              ))}
              <span className="ts-star-label">{form.starRating}/5</span>
            </div>
          </div>

          <div className="ts-form-field">
            <label className="ts-label">Complaint Category (optional)</label>
            <select className="ts-select ts-select-full"
              value={form.complaintCategory} onChange={e => updateForm('complaintCategory', e.target.value)}>
              <option value="">No complaint — general review</option>
              {COMPLAINT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="ts-form-field">
            <label className="ts-label">Description *</label>
            <textarea className={`ts-textarea ${errors.description ? 'error' : ''}`}
              rows={4} placeholder="Describe your experience..."
              value={form.description} onChange={e => updateForm('description', e.target.value)} />
            {errors.description && <span className="ts-error">{errors.description}</span>}
          </div>

          <div className="ts-form-field ts-checkbox-field">
            <input type="checkbox" id="verifiedPurchase"
              checked={form.verifiedPurchase}
              onChange={e => updateForm('verifiedPurchase', e.target.checked)} />
            <label htmlFor="verifiedPurchase" className="ts-checkbox-label">
              This is a verified purchase (increases review credibility)
            </label>
          </div>

          {form.complaintCategory && (
            <div className="ts-info-banner">
              <IconAlertTriangle size={14} />
              <span>A complaint will be filed and the retailer will be notified. Verified purchases carry more weight in investigations.</span>
            </div>
          )}

          <div className="ts-modal-footer">
            <button type="button" className="ts-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="ts-btn-primary">Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}
