import React from 'react';
import { IconSparkles } from './Icons';

export function PerformanceView({ retailers, onSelectRetailer }) {
  const avgRating = retailers.length 
    ? (retailers.reduce((acc, r) => acc + Number(r.rating), 0) / retailers.length).toFixed(1)
    : '0.0';
  
  const totalReviews = retailers.reduce((acc, r) => acc + (r.reviewsCount || 0), 0);
  const avgCommission = retailers.length
    ? Math.round(retailers.reduce((acc, r) => acc + (r.commissionRate || 10), 0) / retailers.length)
    : 0;

  // Sorted by rating
  const topRetailers = [...retailers].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 5);

  return (
    <div className="performance-view-container">
      <div className="section-header-block">
        <h2 className="section-title">Commercial Performance & Traveler Quality Index</h2>
        <p className="section-subtitle">
          Real-time metrics tracking concession satisfaction, passenger engagement, and commercial commission yields.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="perf-kpi-grid">
        <div className="perf-kpi-card">
          <span className="perf-kpi-title">Average Traveler Score</span>
          <div className="perf-kpi-main">
            <span className="perf-kpi-val highlight-blue">{avgRating}</span>
            <span className="perf-kpi-scale">/ 10.0</span>
          </div>
          <span className="perf-kpi-sub">Across {totalReviews} verified passenger reviews</span>
        </div>

        <div className="perf-kpi-card">
          <span className="perf-kpi-title">Avg Concession Commission</span>
          <div className="perf-kpi-main">
            <span className="perf-kpi-val highlight-green">{avgCommission}%</span>
          </div>
          <span className="perf-kpi-sub">Airport authority revenue share</span>
        </div>

        <div className="perf-kpi-card">
          <span className="perf-kpi-title">Active Concessionaires</span>
          <div className="perf-kpi-main">
            <span className="perf-kpi-val">{retailers.length}</span>
          </div>
          <span className="perf-kpi-sub">Commercial partners in terminal operations</span>
        </div>
      </div>

      {/* Top Performing Partners Table */}
      <div className="perf-section-card">
        <div className="perf-card-header">
          <IconSparkles size={18} className="perf-header-icon" />
          <h3 className="perf-card-title">Top Rated Concessionaires (Traveler Choice)</h3>
        </div>
        <div className="table-responsive-container">
          <table className="expedia-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Retailer Brand</th>
                <th>Category</th>
                <th>Hub Location</th>
                <th>Score</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {topRetailers.map((retailer, idx) => (
                <tr key={retailer.id} className="perf-table-row" onClick={() => onSelectRetailer(retailer)}>
                  <td>
                    <span className={`rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : 'bronze'}`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td>
                    <div className="perf-brand-cell">
                      <img src={retailer.image} alt={retailer.name} className="perf-thumb" />
                      <div>
                        <strong>{retailer.name}</strong>
                        {retailer.isVip && <span className="badge-vip-table">VIP</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-sub-pill">{retailer.category}</span>
                  </td>
                  <td>
                    <span>{retailer.hub}</span>
                  </td>
                  <td>
                    <div className="score-badge table-badge">
                      <span>{Number(retailer.rating).toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{retailer.commissionRate}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
