import React, { useState } from 'react';
import { 
  IconMapPin, 
  IconEdit, 
  IconTrash, 
  IconHeart, 
  IconEye, 
  IconSparkles 
} from './Icons';

export function RetailerCard({ retailer, onEdit, onDelete, onViewDetails }) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Determine Expedia-style rating label
  const getRatingLabel = (score) => {
    const num = Number(score);
    if (num >= 9.5) return 'Exceptional';
    if (num >= 9.0) return 'Wonderful';
    if (num >= 8.5) return 'Very Good';
    return 'Good';
  };

  return (
    <article className="retailer-card" tabIndex={0}>
      {/* Photo Header */}
      <div className="card-photo-wrapper" onClick={() => onViewDetails(retailer)}>
        <img
          src={retailer.image}
          alt={retailer.name}
          className="card-image"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="card-top-badges">
          {retailer.isVip || retailer.status === 'Featured' ? (
            <span className="badge-featured">
              <IconSparkles size={12} />
              <span>VIP Partner</span>
            </span>
          ) : (
            <span className={`badge-status ${retailer.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {retailer.status}
            </span>
          )}

          <button
            type="button"
            className="card-heart-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            aria-label={isFavorited ? 'Remove from saved' : 'Save retailer'}
          >
            <IconHeart size={18} filled={isFavorited} />
          </button>
        </div>

        {/* Category Floating Tag */}
        <div className="card-category-tag">
          {retailer.category}
        </div>
      </div>

      {/* Card Content & Information Hierarchy */}
      <div className="card-body">
        {/* Expedia-style Score Header */}
        <div className="card-score-row">
          <div className="score-badge">
            <span className="score-num">{Number(retailer.rating).toFixed(1)}</span>
          </div>
          <div className="score-text">
            <span className="score-label">{getRatingLabel(retailer.rating)}</span>
            <span className="score-reviews">{retailer.reviewsCount} verified traveler reviews</span>
          </div>
          <div className="price-tier" title={`Price level: ${retailer.priceTier}`}>
            {retailer.priceTier}
          </div>
        </div>

        {/* Title */}
        <h3 
          className="card-title" 
          onClick={() => onViewDetails(retailer)}
          role="button"
          tabIndex={0}
        >
          {retailer.name}
        </h3>

        {/* Location / Terminal */}
        <div className="card-location">
          <IconMapPin size={15} className="location-pin" />
          <div className="location-text">
            <span className="location-hub">{retailer.hub}</span>
            <span className="location-gate">{retailer.terminal} • {retailer.gate}</span>
          </div>
        </div>

        {/* Description Excerpt */}
        <p className="card-desc">
          {retailer.description}
        </p>

        {/* Travel Perks Tags */}
        {retailer.perks && retailer.perks.length > 0 && (
          <div className="card-perks-row">
            {retailer.perks.slice(0, 3).map((perk, i) => (
              <span key={i} className="perk-chip">
                {perk}
              </span>
            ))}
            {retailer.perks.length > 3 && (
              <span className="perk-chip more">+{retailer.perks.length - 3}</span>
            )}
          </div>
        )}

        {/* Commercial Meta Strip */}
        <div className="card-commercial-strip">
          <div className="commission-meta">
            <span className="commission-label">Partner Commission:</span>
            <span className="commission-rate">{retailer.commissionRate || 10}%</span>
          </div>
          <span className="hours-indicator">
            {retailer.operatingHours || 'Daily'}
          </span>
        </div>

        {/* Action Buttons Bar */}
        <div className="card-actions">
          <button
            type="button"
            className="btn-card-action view"
            onClick={() => onViewDetails(retailer)}
          >
            <IconEye size={15} />
            <span>Details</span>
          </button>

          <button
            type="button"
            className="btn-card-action edit"
            onClick={() => onEdit(retailer)}
            title="Edit Retailer Details"
          >
            <IconEdit size={15} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="btn-card-action delete"
            onClick={() => onDelete(retailer)}
            title="Delete Retailer"
          >
            <IconTrash size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
