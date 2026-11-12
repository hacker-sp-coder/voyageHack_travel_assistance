import React, { useState } from 'react';
import { IconX, IconSparkles } from './Icons';
import { CATEGORIES, AIRPORT_HUBS, SAMPLE_IMAGES } from '../data/initialRetailers';

const DEFAULT_FORM_STATE = {
  name: '',
  category: 'Duty Free',
  hub: 'Heathrow Airport (LHR)',
  terminal: 'Terminal 5 - Departure Lounge',
  gate: 'Gate A10',
  rating: 9.5,
  reviewsCount: 120,
  priceTier: '$$$',
  commissionRate: 12,
  status: 'Active',
  isVip: false,
  image: SAMPLE_IMAGES['Duty Free'],
  description: '',
  perks: 'Tax Free, Gate Delivery',
  contactEmail: '',
  contactPhone: '',
  website: '',
  operatingHours: '06:00 - 22:00 daily'
};

export function RetailerModal({ isOpen, onClose, onSave, retailerToEdit }) {
  const isEditing = Boolean(retailerToEdit);

  const [formData, setFormData] = useState(() => {
    if (retailerToEdit) {
      return {
        ...retailerToEdit,
        perks: Array.isArray(retailerToEdit.perks)
          ? retailerToEdit.perks.join(', ')
          : (retailerToEdit.perks || '')
      };
    }
    return DEFAULT_FORM_STATE;
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    
    // Auto-update sample image when category changes if creating new
    if (name === 'category' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        [name]: newVal,
        image: SAMPLE_IMAGES[newVal] || prev.image
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newVal
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleApplyPresetImage = () => {
    if (SAMPLE_IMAGES[formData.category]) {
      setFormData(prev => ({
        ...prev,
        image: SAMPLE_IMAGES[formData.category]
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Retailer name is required';
    if (!formData.terminal.trim()) errs.terminal = 'Terminal location is required';
    if (!formData.image.trim()) errs.image = 'Image URL is required';
    if (Number(formData.rating) < 1 || Number(formData.rating) > 10) {
      errs.rating = 'Rating must be between 1.0 and 10.0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedPerks = formData.perks
      ? formData.perks.split(',').map(p => p.trim()).filter(Boolean)
      : [];

    const finalData = {
      ...formData,
      rating: parseFloat(Number(formData.rating).toFixed(1)),
      reviewsCount: parseInt(formData.reviewsCount, 10) || 0,
      commissionRate: parseInt(formData.commissionRate, 10) || 10,
      perks: parsedPerks
    };

    onSave(finalData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditing ? 'Edit Retailer Partner' : 'Add New Retailer Partner'}
            </h2>
            <p className="modal-subtitle">
              Configure commercial profile, location, category, and traveler perks.
            </p>
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

        {/* Modal Body Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Retailer Name */}
            <div className="form-group col-span-2">
              <label htmlFor="name" className="form-label">
                Retailer Brand Name <span className="req">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. World Duty Free Luxe"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="req">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Airport Hub */}
            <div className="form-group">
              <label htmlFor="hub" className="form-label">
                Airport Hub <span className="req">*</span>
              </label>
              <select
                id="hub"
                name="hub"
                value={formData.hub}
                onChange={handleChange}
                className="form-select"
              >
                {AIRPORT_HUBS.filter(h => h !== 'All Hubs').map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Terminal Details */}
            <div className="form-group">
              <label htmlFor="terminal" className="form-label">
                Terminal & Zone <span className="req">*</span>
              </label>
              <input
                id="terminal"
                name="terminal"
                type="text"
                value={formData.terminal}
                onChange={handleChange}
                placeholder="e.g. Terminal 5 - Departures"
                className={`form-input ${errors.terminal ? 'input-error' : ''}`}
              />
              {errors.terminal && <span className="error-text">{errors.terminal}</span>}
            </div>

            {/* Gate Location */}
            <div className="form-group">
              <label htmlFor="gate" className="form-label">Gate / Concourse</label>
              <input
                id="gate"
                name="gate"
                type="text"
                value={formData.gate}
                onChange={handleChange}
                placeholder="e.g. Gate A10"
                className="form-input"
              />
            </div>

            {/* Rating */}
            <div className="form-group">
              <label htmlFor="rating" className="form-label">
                Expedia Traveler Rating (1 - 10)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="1.0"
                max="10.0"
                value={formData.rating}
                onChange={handleChange}
                className={`form-input ${errors.rating ? 'input-error' : ''}`}
              />
              {errors.rating && <span className="error-text">{errors.rating}</span>}
            </div>

            {/* Review Count */}
            <div className="form-group">
              <label htmlFor="reviewsCount" className="form-label">Reviews Count</label>
              <input
                id="reviewsCount"
                name="reviewsCount"
                type="number"
                min="0"
                value={formData.reviewsCount}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Price Tier */}
            <div className="form-group">
              <label htmlFor="priceTier" className="form-label">Price Level</label>
              <select
                id="priceTier"
                name="priceTier"
                value={formData.priceTier}
                onChange={handleChange}
                className="form-select"
              >
                <option value="$">$ - Budget Essentials</option>
                <option value="$$">$$ - Standard Retail</option>
                <option value="$$$">$$$ - Premium / Specialty</option>
                <option value="$$$$">$$$$ - High Luxury</option>
              </select>
            </div>

            {/* Partner Commission */}
            <div className="form-group">
              <label htmlFor="commissionRate" className="form-label">Commission Rate (%)</label>
              <input
                id="commissionRate"
                name="commissionRate"
                type="number"
                min="1"
                max="50"
                value={formData.commissionRate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">Operational Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Featured">Featured</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>

            {/* VIP Partner Toggle */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isVip"
                  checked={formData.isVip}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  <IconSparkles size={14} className="sparkle-icon" />
                  Designate as VIP Partner Store
                </span>
              </label>
            </div>

            {/* Image URL & Preset Helper */}
            <div className="form-group col-span-2">
              <div className="label-with-helper">
                <label htmlFor="image" className="form-label">
                  High-Quality Image URL <span className="req">*</span>
                </label>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={handleApplyPresetImage}
                >
                  Use {formData.category} HD Preset
                </button>
              </div>
              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={`form-input ${errors.image ? 'input-error' : ''}`}
              />
              {errors.image && <span className="error-text">{errors.image}</span>}
              
              {/* Photo Preview */}
              {formData.image && (
                <div className="image-preview-box">
                  <img src={formData.image} alt="Preview" className="preview-img" />
                  <span className="preview-caption">Image Live Preview</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group col-span-2">
              <label htmlFor="description" className="form-label">Retailer Overview & Offering</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a compelling overview of products, brand heritage, and traveler services..."
                className="form-textarea"
              />
            </div>

            {/* Travel Perks */}
            <div className="form-group col-span-2">
              <label htmlFor="perks" className="form-label">
                Traveler Perks & Services (comma separated)
              </label>
              <input
                id="perks"
                name="perks"
                type="text"
                value={formData.perks}
                onChange={handleChange}
                placeholder="e.g. Tax Free, Gate Delivery, Complimentary Tasting"
                className="form-input"
              />
            </div>

            {/* Operating Hours */}
            <div className="form-group">
              <label htmlFor="operatingHours" className="form-label">Operating Hours</label>
              <input
                id="operatingHours"
                name="operatingHours"
                type="text"
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="e.g. 05:00 - 23:00 daily"
                className="form-input"
              />
            </div>

            {/* Contact Email */}
            <div className="form-group">
              <label htmlFor="contactEmail" className="form-label">Commercial Contact Email</label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="retail@voyageretail.com"
                className="form-input"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-save"
            >
              {isEditing ? 'Save Changes' : 'Create Retailer Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
