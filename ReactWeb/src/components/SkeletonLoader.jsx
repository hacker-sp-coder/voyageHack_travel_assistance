import React from 'react';

export function SkeletonLoader({ viewMode = 'grid' }) {
  if (viewMode === 'table') {
    return (
      <div className="table-responsive-container skeleton-table-container">
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
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="skeleton-row">
                <td>
                  <div className="skeleton-cell-retailer">
                    <div className="skeleton-thumb shimmer" />
                    <div className="skeleton-lines">
                      <div className="skeleton-line shimmer w-120" />
                      <div className="skeleton-line shimmer w-80" />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="skeleton-line shimmer w-140" />
                  <div className="skeleton-line shimmer w-90" />
                </td>
                <td>
                  <div className="skeleton-line shimmer w-60" />
                </td>
                <td>
                  <div className="skeleton-line shimmer w-50" />
                </td>
                <td>
                  <div className="skeleton-pill shimmer" />
                </td>
                <td>
                  <div className="skeleton-actions shimmer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="retailers-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="retailer-card skeleton-card">
          <div className="card-photo-wrapper skeleton-photo shimmer" />
          <div className="card-body">
            <div className="skeleton-line shimmer w-80" />
            <div className="skeleton-line shimmer w-140" style={{ height: '22px' }} />
            <div className="skeleton-line shimmer w-100" />
            <div className="skeleton-line shimmer w-full" style={{ height: '36px' }} />
            <div className="skeleton-actions-row shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
