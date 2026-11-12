import React from 'react';
import { IconCompass, IconPlus, IconStore, IconRefresh, IconShield } from './Icons';

export function Navbar({ onOpenAddModal, onResetDemo, totalRetailers, activeTab, setActiveTab, unreadAlerts }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Area */}
        <div className="header-brand" onClick={() => setActiveTab('retailers')} role="button" tabIndex={0}>
          <div className="brand-icon-wrapper">
            <IconCompass size={24} className="brand-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span className="brand-voyage">Voyage</span>
              <span className="brand-retail">Retail</span>
              <span className="brand-badge">PORTAL</span>
            </div>
            <span className="brand-tagline">Airport & Transit Commercial Management</span>
          </div>
        </div>

        {/* Structured Navigation (Expedia-style sectioned tabs) */}
        <nav className="header-nav" aria-label="Main Navigation">
          <button 
            type="button" 
            className={`nav-tab ${activeTab === 'retailers' ? 'active' : ''}`}
            onClick={() => setActiveTab('retailers')}
          >
            <IconStore size={17} />
            <span>Retailers Directory</span>
            {totalRetailers > 0 && <span className="nav-count-badge">{totalRetailers}</span>}
          </button>
          
          <button 
            type="button" 
            className={`nav-tab ${activeTab === 'hubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('hubs')}
          >
            <span>Airport Hubs</span>
          </button>

          <button 
            type="button" 
            className={`nav-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <span>Performance</span>
          </button>

          <button 
            type="button" 
            className={`nav-tab trust-tab ${activeTab === 'trust' ? 'active' : ''}`}
            onClick={() => setActiveTab('trust')}
          >
            <IconShield size={16} />
            <span>Trust &amp; Safety</span>
            {unreadAlerts > 0 && (
              <span className="ts-nav-badge">{unreadAlerts}</span>
            )}
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="header-actions">
          <button 
            type="button" 
            className="btn-icon-subtle" 
            onClick={onResetDemo} 
            title="Reset to default demo retailers"
            aria-label="Reset demo retailers"
          >
            <IconRefresh size={16} />
            <span className="btn-label-desktop">Reset Demo</span>
          </button>

          <button 
            type="button" 
            className="btn-primary-expedia" 
            onClick={onOpenAddModal}
          >
            <IconPlus size={18} />
            <span>Add Retailer</span>
          </button>

          <div className="header-divider" aria-hidden="true" />

          {/* User Profile Pill */}
          <div className="admin-profile-pill" title="Commercial Terminal Manager">
            <div className="admin-avatar-wrapper">
              <div className="admin-avatar">AP</div>
              <span className="admin-online-badge" title="Online" />
            </div>
            <div className="admin-info">
              <span className="admin-name">Airport Ops</span>
              <span className="admin-role">Global Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
