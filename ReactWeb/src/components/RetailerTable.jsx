import React from 'react';
import { 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconMapPin, 
  IconSparkles 
} from './Icons';

export function RetailerTable({ retailers, onEdit, onDelete, onViewDetails }) {
  const getRatingLabel = (score) => {
    const num = Number(score);
    if (num >= 9.5) return 'Exceptional';
    if (num >= 9.0) return 'Wonderful';
    if (num >= 8.5) return 'Very Good';
    return 'Good';
  };

  return (
    <div className="table-responsive-container">
      <table className="expedia-table">
        <thead>
          <tr>
            <th className="th-retailer">Retailer & Category</th>
            <th className="th-location">Airport Hub & Terminal</th>
            <th className="th-rating">Traveler Rating</th>
            <th className="th-commercial">Price & Commission</th>
            <th className="th-status">Status</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {retailers.map((retailer) => (
            <tr key={retailer.id} className="table-row">
              {/* Retailer Info */}
              <td className="td-retailer">
                <div className="table-retailer-cell">
                  <img
                    src={retailer.image}
                    alt={retailer.name}
                    className="table-thumbnail"
                    onClick={() => onViewDetails(retailer)}
                  />
                  <div className="table-meta">
                    <div className="table-title-row">
                      <span 
                        className="table-retailer-name"
                        onClick={() => onViewDetails(retailer)}
                      >
                        {retailer.name}
                      </span>
                      {retailer.isVip && (
                        <span className="badge-vip-table">
                          <IconSparkles size={11} />
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="table-category-tag">{retailer.category}</span>
                  </div>
                </div>
              </td>

              {/* Location */}
              <td className="td-location">
                <div className="table-location-cell">
                  <span className="location-hub-name">{retailer.hub}</span>
                  <span className="location-terminal-desc">
                    <IconMapPin size={12} />
                    {retailer.terminal} ({retailer.gate})
                  </span>
                </div>
              </td>

              {/* Rating */}
              <td className="td-rating">
                <div className="table-rating-cell">
                  <div className="score-badge table-badge">
                    <span>{Number(retailer.rating).toFixed(1)}</span>
                  </div>
                  <div className="table-rating-meta">
                    <span className="rating-verdict">{getRatingLabel(retailer.rating)}</span>
                    <span className="rating-sub">{retailer.reviewsCount} reviews</span>
                  </div>
                </div>
              </td>

              {/* Commercials */}
              <td className="td-commercial">
                <div className="table-commercial-cell">
                  <span className="tier-pill">{retailer.priceTier}</span>
                  <span className="table-commission-rate">{retailer.commissionRate}% comm.</span>
                </div>
              </td>

              {/* Status */}
              <td className="td-status">
                <span className={`badge-status ${retailer.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {retailer.status}
                </span>
              </td>

              {/* Actions */}
              <td className="td-actions">
                <div className="table-actions-group">
                  <button
                    type="button"
                    className="table-action-btn view"
                    onClick={() => onViewDetails(retailer)}
                    title="View Details"
                  >
                    <IconEye size={15} />
                  </button>
                  <button
                    type="button"
                    className="table-action-btn edit"
                    onClick={() => onEdit(retailer)}
                    title="Edit Retailer"
                  >
                    <IconEdit size={15} />
                  </button>
                  <button
                    type="button"
                    className="table-action-btn delete"
                    onClick={() => onDelete(retailer)}
                    title="Delete Retailer"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
