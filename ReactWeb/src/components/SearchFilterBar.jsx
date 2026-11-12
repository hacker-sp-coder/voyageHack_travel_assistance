import React from 'react';
import { 
  IconSearch, 
  IconTag, 
  IconMapPin, 
  IconStar, 
  IconGrid, 
  IconList, 
  IconX 
} from './Icons';
import { CATEGORIES, AIRPORT_HUBS } from '../data/initialRetailers';

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedHub,
  setSelectedHub,
  minRating,
  setMinRating,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalResults,
  onResetFilters
}) {
  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedHub !== 'All Hubs' || 
    minRating > 0 || 
    statusFilter !== 'All';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-filter-section">
      {/* Prominent Expedia-style Search Bar */}
      <form className="expedia-search-card" onSubmit={handleSearchSubmit}>
        {/* Segment 1: Search Name/Keywords */}
        <div className="search-segment segment-name">
          <label htmlFor="search-input" className="segment-label">
            <IconSearch size={14} className="segment-icon" />
            <span>Retailer / Brand</span>
          </label>
          <div className="segment-input-wrapper">
            <input
              id="search-input"
              type="text"
              placeholder="e.g. Duty Free, Hermès, Luggage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="segment-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-input-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <IconX size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="search-divider" />

        {/* Segment 2: Category Selector */}
        <div className="search-segment segment-category">
          <label htmlFor="category-select" className="segment-label">
            <IconTag size={14} className="segment-icon" />
            <span>Category</span>
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="segment-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="search-divider" />

        {/* Segment 3: Airport Hub */}
        <div className="search-segment segment-hub">
          <label htmlFor="hub-select" className="segment-label">
            <IconMapPin size={14} className="segment-icon" />
            <span>Airport Hub</span>
          </label>
          <select
            id="hub-select"
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="segment-select"
          >
            {AIRPORT_HUBS.map((hub) => (
              <option key={hub} value={hub}>
                {hub}
              </option>
            ))}
          </select>
        </div>

        <div className="search-divider" />

        {/* Segment 4: Min Rating */}
        <div className="search-segment segment-rating">
          <label htmlFor="rating-select" className="segment-label">
            <IconStar size={14} className="segment-icon" />
            <span>Rating</span>
          </label>
          <select
            id="rating-select"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="segment-select"
          >
            <option value={0}>Any Rating</option>
            <option value={9.5}>9.5+ Exceptional</option>
            <option value={9.0}>9.0+ Wonderful</option>
            <option value={8.5}>8.5+ Very Good</option>
          </select>
        </div>

        {/* Expedia Strong Search Button */}
        <div className="search-cta-wrapper">
          <button type="submit" className="search-btn-expedia">
            <IconSearch size={18} />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Airbnb Category Pill Navigation Strip */}
      <div className="category-pills-row" role="tablist" aria-label="Category Filters">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Status Filter, Sorting, View Mode & Results Count */}
      <div className="sub-filter-bar">
        <div className="filter-chips-group">
          {/* Status Filter Chips */}
          <span className="filter-group-label">Status:</span>
          {['All', 'Featured', 'Active', 'Under Review'].map((status) => (
            <button
              key={status}
              type="button"
              className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'All' ? 'All Status' : status}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-all-link"
              onClick={onResetFilters}
            >
              <IconX size={13} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        <div className="controls-right">
          {/* Results Summary */}
          <span className="results-count">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'retailer' : 'retailers'} found
          </span>

          {/* Sort Selector */}
          <div className="sort-wrapper">
            <label htmlFor="sort-select" className="sort-label">Sort:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="reviews-desc">Most Reviews</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="commission-desc">Highest Commission</option>
            </select>
          </div>

          {/* View Mode Switcher (Grid vs Table) */}
          <div className="view-toggle-group" role="group" aria-label="View Mode">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View (Airbnb Style)"
              aria-label="Grid view"
            >
              <IconGrid size={17} />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table Inventory View (Expedia Style)"
              aria-label="Table view"
            >
              <IconList size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
