import React from 'react';
import { 
  IconX, 
  IconMapPin, 
  IconClock, 
  IconPhone, 
  IconMail, 
  IconSparkles, 
  IconEdit, 
  IconTrash, 
  IconExternalLink,
  IconShieldCheck
} from './Icons';

export function RetailerDetailModal({ isOpen, onClose, retailer, onEdit, onDelete }) {
  if (!isOpen || !retailer) return null;

  const getRatingLabel = (score) => {
    const num = Number(score);
    if (num >= 9.5) return 'Exceptional';
    if (num >= 9.0) return 'Wonderful';
    if (num >= 8.5) return 'Very Good';
    return 'Good';
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-detail" onClick={(e) => e.stopPropagation()}>
        {/* Photo Banner */}
        <div className="detail-hero-banner">
          <img src={retailer.image} alt={retailer.name} className="detail-hero-img" />
          <button 
            type="button" 
            className="detail-close-floating" 
            onClick={onClose}
            aria-label="Close details"
          >
            <IconX size={20} />
          </button>
          
          <div className="detail-hero-overlay">
            <span className="detail-category-badge">{retailer.category}</span>
            {retailer.isVip && (
              <span className="detail-vip-badge">
                <IconSparkles size={13} />
                VIP Partner
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="detail-body">
          {/* Header Row */}
          <div className="detail-header-row">
            <div>
              <h2 className="detail-title">{retailer.name}</h2>
              <div className="detail-location-row">
                <IconMapPin size={16} className="detail-pin" />
                <span>{retailer.hub} — {retailer.terminal} ({retailer.gate})</span>
              </div>
            </div>

            {/* Expedia Score Box */}
            <div className="detail-score-box">
              <div className="detail-score-number">{Number(retailer.rating).toFixed(1)}</div>
              <div className="detail-score-meta">
                <span className="detail-verdict">{getRatingLabel(retailer.rating)}</span>
                <span className="detail-reviews">{retailer.reviewsCount} reviews</span>
              </div>
            </div>
          </div>

          <div className="detail-divider" />

          {/* Key Metric Highlights */}
          <div className="detail-stats-grid">
            <div className="detail-stat-item">
              <span className="stat-item-label">Price Level</span>
              <span className="stat-item-value">{retailer.priceTier}</span>
            </div>
            <div className="detail-stat-item">
              <span className="stat-item-label">Commercial Rate</span>
              <span className="stat-item-value">{retailer.commissionRate || 10}%</span>
            </div>
            <div className="detail-stat-item">
              <span className="stat-item-label">Operating Hours</span>
              <span className="stat-item-value">{retailer.operatingHours || 'Daily'}</span>
            </div>
            <div className="detail-stat-item">
              <span className="stat-item-label">Status</span>
              <span className={`badge-status ${retailer.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {retailer.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="detail-section">
            <h4 className="detail-section-title">About this Retailer</h4>
            <p className="detail-description-text">{retailer.description}</p>
          </div>

          {/* Traveler Perks */}
          {retailer.perks && retailer.perks.length > 0 && (
            <div className="detail-section">
              <h4 className="detail-section-title">Passenger Amenities & Traveler Perks</h4>
              <div className="detail-perks-grid">
                {retailer.perks.map((perk, i) => (
                  <div key={i} className="detail-perk-card">
                    <IconShieldCheck size={16} className="perk-check-icon" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terminal Contact Details */}
          <div className="detail-section">
            <h4 className="detail-section-title">Terminal Contact & Information</h4>
            <div className="detail-contact-grid">
              <div className="contact-item">
                <IconClock size={16} />
                <span>{retailer.operatingHours || 'Daily'}</span>
              </div>
              {retailer.contactPhone && (
                <div className="contact-item">
                  <IconPhone size={16} />
                  <span>{retailer.contactPhone}</span>
                </div>
              )}
              {retailer.contactEmail && (
                <div className="contact-item">
                  <IconMail size={16} />
                  <span>{retailer.contactEmail}</span>
                </div>
              )}
              {retailer.website && (
                <a 
                  href={retailer.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-item link"
                >
                  <IconExternalLink size={16} />
                  <span>Visit Official Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer detail-footer">
          <div className="footer-left-actions">
            <button
              type="button"
              className="btn-card-action delete"
              onClick={() => {
                onClose();
                onDelete(retailer);
              }}
            >
              <IconTrash size={16} />
              <span>Delete Retailer</span>
            </button>
          </div>
          
          <div className="footer-right-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-modal-save"
              onClick={() => {
                onClose();
                onEdit(retailer);
              }}
            >
              <IconEdit size={16} />
              <span>Edit Retailer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
