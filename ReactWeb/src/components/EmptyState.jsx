import React from 'react';
import { IconSearch, IconStore, IconPlus, IconRefresh } from './Icons';

export function EmptyState({ isFilterEmpty, onResetFilters, onOpenAddModal, onResetDemo }) {
  if (isFilterEmpty) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-box">
          <IconSearch size={32} />
        </div>
        <h3 className="empty-title">No retailers match your search criteria</h3>
        <p className="empty-subtitle">
          Try adjusting your search terms, removing active category filters, or selecting a different airport hub.
        </p>
        <div className="empty-actions">
          <button
            type="button"
            className="btn-primary-expedia"
            onClick={onResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-icon-box">
        <IconStore size={32} />
      </div>
      <h3 className="empty-title">Retailer Directory is Empty</h3>
      <p className="empty-subtitle">
        No active airport commercial partners are currently listed. Add a new brand or restore the default demo catalog.
      </p>
      <div className="empty-actions">
        <button
          type="button"
          className="btn-primary-expedia"
          onClick={onOpenAddModal}
        >
          <IconPlus size={18} />
          <span>Add New Retailer</span>
        </button>
        <button
          type="button"
          className="btn-secondary-outline"
          onClick={onResetDemo}
        >
          <IconRefresh size={16} />
          <span>Restore Demo Data</span>
        </button>
      </div>
    </div>
  );
}
