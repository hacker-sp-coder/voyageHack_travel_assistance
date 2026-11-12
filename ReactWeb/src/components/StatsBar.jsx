import React from 'react';
import { IconStore, IconShieldCheck, IconSparkles, IconMapPin } from './Icons';

export function StatsBar({ retailers }) {
  const totalCount = retailers.length;
  const activeCount = retailers.filter(r => r.status === 'Active' || r.status === 'Featured').length;
  const topRatedCount = retailers.filter(r => Number(r.rating) >= 9.5).length;
  const uniqueHubs = new Set(retailers.map(r => r.hub)).size;

  return (
    <div className="stats-container">
      <div className="stats-card">
        <div className="stats-icon-box blue">
          <IconStore size={20} />
        </div>
        <div className="stats-meta">
          <span className="stats-value">{totalCount}</span>
          <span className="stats-label">Total Retailers</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon-box green">
          <IconShieldCheck size={20} />
        </div>
        <div className="stats-meta">
          <span className="stats-value">{activeCount}</span>
          <span className="stats-label">Active & Operating</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon-box amber">
          <IconSparkles size={20} />
        </div>
        <div className="stats-meta">
          <span className="stats-value">{topRatedCount}</span>
          <span className="stats-label">Exceptional (9.5+)</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon-box navy">
          <IconMapPin size={20} />
        </div>
        <div className="stats-meta">
          <span className="stats-value">{uniqueHubs}</span>
          <span className="stats-label">Airport Hubs</span>
        </div>
      </div>
    </div>
  );
}
