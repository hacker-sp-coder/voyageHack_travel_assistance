import React, { useState, useMemo } from 'react';
import {
  IconShield, IconShieldCheck, IconBan, IconAlertTriangle, IconBell,
  IconSearch, IconFilter, IconEye, IconCheck, IconX, IconRefresh,
  IconUserCheck, IconActivity, IconMessageSquare, IconStar, IconInfo,
  IconChevronDown, IconChevronUp
} from './Icons';
import { getTrustClassification, getVerificationStatusStyle, TRUST_SCORE_WEIGHTS, COMPLAINT_CATEGORIES } from '../data/trustSafetyData';
import { RetailerTrustProfileModal } from './RetailerTrustProfileModal';
import { SubmitReviewModal } from './SubmitReviewModal';
import { IssueWarningModal } from './IssueWarningModal';

export function TrustSafetyDashboard({
  retailers,
  trustSafety,
}) {
  const {
    trustProfiles, reviews, warnings, notifications, getDashboardStats,
    approveVerification, rejectVerification, issueWarning, suspendRetailer,
    restoreRetailer, banRetailer, resolveWarning, submitReview,
    requestReverification, markNotificationRead, markAllNotificationsRead,
    unreadNotificationsCount,
  } = trustSafety;

  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'retailers' | 'complaints' | 'warnings' | 'notifications'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('trustScore-asc');
  const [selectedRetailerId, setSelectedRetailerId] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningTargetId, setWarningTargetId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type, retailerId, label }
  const [confirmReason, setConfirmReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const stats = getDashboardStats();

  // Enrich retailers with trust profiles
  const enrichedRetailers = useMemo(() => {
    return retailers.map(r => ({
      ...r,
      trustProfile: trustProfiles[r.id] || null,
    })).filter(r => {
      if (statusFilter !== 'All') {
        const vs = r.trustProfile?.verificationStatus;
        if (statusFilter === 'Verified' && vs !== 'Verified') return false;
        if (statusFilter === 'Pending' && vs !== 'Pending') return false;
        if (statusFilter === 'Under Review' && vs !== 'Under Review') return false;
        if (statusFilter === 'Suspended' && vs === 'Suspended') return true;
        if (statusFilter === 'Banned' && vs === 'Banned') return true;
        if (!['Verified', 'Pending', 'Under Review', 'Suspended', 'Banned'].includes(statusFilter)) return true;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.name.toLowerCase().includes(q) || r.hub.toLowerCase().includes(q) ||
          r.trustProfile?.ownerName?.toLowerCase().includes(q) ||
          r.trustProfile?.businessEmail?.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      const scoreA = a.trustProfile?.trustScore ?? 50;
      const scoreB = b.trustProfile?.trustScore ?? 50;
      if (sortBy === 'trustScore-asc') return scoreA - scoreB;
      if (sortBy === 'trustScore-desc') return scoreB - scoreA;
      if (sortBy === 'complaints-desc') return (b.trustProfile?.complaintCount || 0) - (a.trustProfile?.complaintCount || 0);
      if (sortBy === 'warnings-desc') return (b.trustProfile?.warningCount || 0) - (a.trustProfile?.warningCount || 0);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [retailers, trustProfiles, statusFilter, searchQuery, sortBy]);

  const openProfile = (retailerId) => {
    setSelectedRetailerId(retailerId);
    setIsProfileOpen(true);
  };

  const handleAdminAction = (type, retailerId, label) => {
    setConfirmAction({ type, retailerId, label });
    setConfirmReason('');
  };

  const executeAction = () => {
    const { type, retailerId } = confirmAction;
    if (type === 'approve') {
      approveVerification(retailerId);
      showToast('Verification approved successfully.');
    } else if (type === 'reject') {
      rejectVerification(retailerId, confirmReason || 'Insufficient documentation.');
      showToast('Verification rejected.', 'error');
    } else if (type === 'suspend') {
      suspendRetailer(retailerId, confirmReason || 'Policy violation.');
      showToast('Retailer suspended.', 'warning');
    } else if (type === 'restore') {
      restoreRetailer(retailerId);
      showToast('Retailer account restored.');
    } else if (type === 'ban') {
      banRetailer(retailerId, confirmReason || 'Severe policy violation after investigation.');
      showToast('Retailer permanently banned.', 'error');
    } else if (type === 'reverify') {
      requestReverification(retailerId, confirmReason || 'Periodic re-verification required.');
      showToast('Re-verification requested.');
    }
    setConfirmAction(null);
    setConfirmReason('');
  };

  const openComplaints = reviews.filter(r => r.investigationStatus === 'Open' || r.investigationStatus === 'Under Investigation');
  const activeWarningsList = warnings.filter(w => !w.isResolved);

  const getRetailerName = (id) => retailers.find(r => r.id === id)?.name || id;

  return (
    <div className="ts-dashboard">
      {/* Header */}
      <div className="ts-header">
        <div className="ts-header-left">
          <div className="ts-header-icon">
            <IconShield size={22} />
          </div>
          <div>
            <h1 className="ts-header-title">Trust &amp; Safety Center</h1>
            <p className="ts-header-subtitle">Retailer verification, monitoring &amp; fraud prevention</p>
          </div>
        </div>
        <div className="ts-header-right">
          <button
            type="button"
            className="ts-notif-btn"
            onClick={() => setActiveSection('notifications')}
            title="Notifications"
          >
            <IconBell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="ts-notif-badge">{unreadNotificationsCount}</span>
            )}
          </button>
          <button
            type="button"
            className="ts-btn-primary"
            onClick={() => setIsReviewModalOpen(true)}
          >
            + Submit Review
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="ts-section-tabs">
        {[
          { id: 'overview', icon: <IconActivity size={16} />, label: 'Overview' },
          { id: 'retailers', icon: <IconShieldCheck size={16} />, label: `Retailers (${retailers.length})` },
          { id: 'complaints', icon: <IconMessageSquare size={16} />, label: `Complaints (${openComplaints.length})` },
          { id: 'warnings', icon: <IconAlertTriangle size={16} />, label: `Warnings (${activeWarningsList.length})` },
          { id: 'notifications', icon: <IconBell size={16} />, label: `Alerts${unreadNotificationsCount > 0 ? ` (${unreadNotificationsCount})` : ''}` },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`ts-section-tab ${activeSection === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW SECTION ===== */}
      {activeSection === 'overview' && (
        <div className="ts-section">
          {/* KPI Stats */}
          <div className="ts-stats-grid">
            {[
              { label: 'Total Retailers', value: stats.total, color: 'blue', icon: <IconShield size={20} /> },
              { label: 'Verified', value: stats.verified, color: 'green', icon: <IconShieldCheck size={20} /> },
              { label: 'Pending Verification', value: stats.pending, color: 'amber', icon: <IconUserCheck size={20} /> },
              { label: 'Under Investigation', value: stats.underInvestigation, color: 'navy', icon: <IconActivity size={20} /> },
              { label: 'Active Warnings', value: stats.activeWarnings, color: 'orange', icon: <IconAlertTriangle size={20} /> },
              { label: 'Suspended', value: stats.suspended, color: 'red', icon: <IconBan size={20} /> },
              { label: 'Banned', value: stats.banned, color: 'purple', icon: <IconBan size={20} /> },
              { label: 'Open Complaints', value: stats.openComplaints, color: 'rose', icon: <IconMessageSquare size={20} /> },
            ].map(stat => (
              <div key={stat.label} className={`ts-stat-card ts-stat-${stat.color}`}>
                <div className="ts-stat-icon">{stat.icon}</div>
                <div className="ts-stat-content">
                  <span className="ts-stat-value">{stat.value}</span>
                  <span className="ts-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Score Distribution */}
          <div className="ts-overview-row">
            <div className="ts-card ts-score-distribution">
              <h3 className="ts-card-title">Trust Score Distribution</h3>
              <div className="ts-score-dist-list">
                {[
                  { label: 'Trusted (80–100)', min: 80, color: '#0e8048', bg: '#e8f6ed' },
                  { label: 'Under Observation (60–79)', min: 60, max: 79, color: '#d97706', bg: '#fef3c7' },
                  { label: 'Warning Issued (40–59)', min: 40, max: 59, color: '#ea580c', bg: '#fff7ed' },
                  { label: 'High Risk (0–39)', max: 39, color: '#dc2626', bg: '#fef2f2' },
                ].map(band => {
                  const count = Object.values(trustProfiles).filter(p => {
                    const s = p.trustScore;
                    if (band.min !== undefined && band.max !== undefined) return s >= band.min && s <= band.max;
                    if (band.min !== undefined) return s >= band.min;
                    return s <= band.max;
                  }).length;
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={band.label} className="ts-dist-row">
                      <span className="ts-dist-label" style={{ color: band.color }}>{band.label}</span>
                      <div className="ts-dist-bar-wrap">
                        <div className="ts-dist-bar" style={{ width: `${pct}%`, background: band.color }} />
                      </div>
                      <span className="ts-dist-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Warnings */}
            <div className="ts-card">
              <h3 className="ts-card-title">Active Warnings</h3>
              {activeWarningsList.length === 0 ? (
                <p className="ts-empty-text">No active warnings.</p>
              ) : (
                <div className="ts-warning-mini-list">
                  {activeWarningsList.slice(0, 5).map(w => (
                    <div key={w.id} className={`ts-warning-mini ts-warning-level-${w.level}`}>
                      <div className="ts-warning-mini-top">
                        <span className={`ts-warning-pill lvl-${w.level}`}>W{w.level}</span>
                        <span className="ts-warning-mini-name">{getRetailerName(w.retailerId)}</span>
                        <span className="ts-warning-mini-date">{w.issuedDate}</span>
                      </div>
                      <p className="ts-warning-mini-reason">{w.reason}</p>
                      <span className="ts-warning-mini-deadline">Deadline: {w.deadline}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Open Complaints */}
          <div className="ts-card">
            <h3 className="ts-card-title">Open Complaints</h3>
            {openComplaints.length === 0 ? (
              <p className="ts-empty-text">No open complaints.</p>
            ) : (
              <table className="ts-mini-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Retailer</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Verified Purchase</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {openComplaints.slice(0, 6).map(rev => (
                    <tr key={rev.id}>
                      <td>{rev.customerName}</td>
                      <td><strong>{getRetailerName(rev.retailerId)}</strong></td>
                      <td><span className="ts-category-pill">{rev.complaintCategory}</span></td>
                      <td>
                        <span className="ts-star-row">
                          {'★'.repeat(rev.starRating)}{'☆'.repeat(5 - rev.starRating)}
                        </span>
                      </td>
                      <td>{rev.verifiedPurchase ? <span className="ts-verified-badge">Verified</span> : <span className="ts-unverified-badge">Unverified</span>}</td>
                      <td><span className={`ts-inv-status ${rev.investigationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>{rev.investigationStatus}</span></td>
                      <td>{rev.submissionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ===== RETAILERS SECTION ===== */}
      {activeSection === 'retailers' && (
        <div className="ts-section">
          {/* Filters */}
          <div className="ts-filter-row">
            <div className="ts-search-wrap">
              <IconSearch size={16} className="ts-search-icon" />
              <input
                className="ts-search-input"
                type="text"
                placeholder="Search retailers, owners, emails..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="ts-search-clear" onClick={() => setSearchQuery('')}>
                  <IconX size={14} />
                </button>
              )}
            </div>
            <select
              className="ts-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Suspended">Suspended</option>
              <option value="Banned">Banned</option>
            </select>
            <select
              className="ts-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="trustScore-asc">Trust Score ↑</option>
              <option value="trustScore-desc">Trust Score ↓</option>
              <option value="complaints-desc">Most Complaints</option>
              <option value="warnings-desc">Most Warnings</option>
              <option value="name-asc">Name A–Z</option>
            </select>
            <span className="ts-result-count">{enrichedRetailers.length} retailers</span>
          </div>

          {/* Retailers Management Table */}
          <div className="ts-table-wrap">
            <table className="ts-table">
              <thead>
                <tr>
                  <th>Retailer</th>
                  <th>Trust Score</th>
                  <th>Verification Status</th>
                  <th>Complaints</th>
                  <th>Warnings</th>
                  <th>Reg. Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrichedRetailers.map(r => {
                  const profile = r.trustProfile;
                  const score = profile?.trustScore ?? 50;
                  const cls = getTrustClassification(score);
                  const vs = getVerificationStatusStyle(profile?.verificationStatus || 'Pending');
                  return (
                    <tr key={r.id} className="ts-table-row">
                      <td>
                        <div className="ts-retailer-cell">
                          <img src={r.image} alt={r.name} className="ts-retailer-thumb" />
                          <div>
                            <span className="ts-retailer-name">{r.name}</span>
                            <span className="ts-retailer-hub">{r.hub}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ts-score-cell">
                          <span className="ts-score-num" style={{ color: cls.color }}>{score}</span>
                          <span className="ts-score-label" style={{ color: cls.color, background: cls.bg }}>
                            {cls.label}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="ts-vstatus-pill" style={{ color: vs.color, background: vs.bg }}>
                          {profile?.verificationStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <span className={`ts-count-pill ${(profile?.complaintCount || 0) > 3 ? 'danger' : ''}`}>
                          {profile?.complaintCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`ts-count-pill ${(profile?.warningCount || 0) > 0 ? 'warning' : ''}`}>
                          {profile?.warningCount || 0}
                        </span>
                      </td>
                      <td className="ts-date-cell">{profile?.registrationDate || '—'}</td>
                      <td>
                        <div className="ts-action-group">
                          <button
                            type="button"
                            className="ts-action-btn view"
                            onClick={() => openProfile(r.id)}
                            title="View Trust Profile"
                          >
                            <IconEye size={14} />
                          </button>
                          {profile?.verificationStatus === 'Pending' && (
                            <>
                              <button type="button" className="ts-action-btn approve" onClick={() => handleAdminAction('approve', r.id, 'Approve Verification')} title="Approve Verification">
                                <IconCheck size={14} />
                              </button>
                              <button type="button" className="ts-action-btn reject" onClick={() => handleAdminAction('reject', r.id, 'Reject Verification')} title="Reject Verification">
                                <IconX size={14} />
                              </button>
                            </>
                          )}
                          {(profile?.verificationStatus === 'Verified' || profile?.verificationStatus === 'Under Review') && (
                            <>
                              <button
                                type="button"
                                className="ts-action-btn warn"
                                onClick={() => { setWarningTargetId(r.id); setIsWarningModalOpen(true); }}
                                title="Issue Warning"
                              >
                                <IconAlertTriangle size={14} />
                              </button>
                              <button type="button" className="ts-action-btn suspend" onClick={() => handleAdminAction('suspend', r.id, 'Suspend Retailer')} title="Suspend">
                                <IconBan size={14} />
                              </button>
                            </>
                          )}
                          {profile?.verificationStatus === 'Suspended' && (
                            <>
                              <button type="button" className="ts-action-btn restore" onClick={() => handleAdminAction('restore', r.id, 'Restore Retailer')} title="Restore Account">
                                <IconRefresh size={14} />
                              </button>
                              <button type="button" className="ts-action-btn ban" onClick={() => handleAdminAction('ban', r.id, 'Permanently Ban Retailer')} title="Permanently Ban">
                                <IconBan size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== COMPLAINTS SECTION ===== */}
      {activeSection === 'complaints' && (
        <div className="ts-section">
          <div className="ts-section-header-row">
            <h2 className="ts-section-title">Customer Reviews &amp; Complaints</h2>
            <button type="button" className="ts-btn-primary" onClick={() => setIsReviewModalOpen(true)}>
              + Submit Review
            </button>
          </div>
          <div className="ts-complaints-list">
            {reviews.length === 0 ? (
              <div className="ts-empty-state">
                <IconMessageSquare size={40} />
                <p>No reviews or complaints yet.</p>
              </div>
            ) : (
              [...reviews].sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)).map(rev => (
                <div key={rev.id} className={`ts-complaint-card ${rev.complaintCategory ? 'has-complaint' : ''}`}>
                  <div className="ts-complaint-header">
                    <div className="ts-complaint-meta">
                      <span className="ts-complaint-customer">{rev.customerName}</span>
                      {rev.verifiedPurchase ? (
                        <span className="ts-verified-badge"><IconCheck size={11} /> Verified Purchase</span>
                      ) : (
                        <span className="ts-unverified-badge">Unverified</span>
                      )}
                      <span className="ts-complaint-date">{rev.submissionDate}</span>
                    </div>
                    <div className="ts-complaint-right">
                      <div className="ts-star-rating">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: s <= rev.starRating ? '#f59e0b' : '#d1d5db' }}>★</span>
                        ))}
                      </div>
                      {rev.investigationStatus && rev.investigationStatus !== 'None' && (
                        <span className={`ts-inv-status ${rev.investigationStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                          {rev.investigationStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ts-complaint-retailer">
                    Re: <strong>{getRetailerName(rev.retailerId)}</strong>
                    {rev.complaintCategory && (
                      <span className="ts-category-pill">{rev.complaintCategory}</span>
                    )}
                  </div>
                  <p className="ts-complaint-desc">{rev.description}</p>
                  {rev.retailerResponse && (
                    <div className="ts-retailer-response">
                      <span className="ts-response-label">Retailer Response:</span>
                      <p>{rev.retailerResponse}</p>
                    </div>
                  )}
                  {rev.adminResolution && (
                    <div className="ts-admin-resolution">
                      <span className="ts-resolution-label">Admin Resolution:</span>
                      <p>{rev.adminResolution}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===== WARNINGS SECTION ===== */}
      {activeSection === 'warnings' && (
        <div className="ts-section">
          <div className="ts-section-header-row">
            <h2 className="ts-section-title">Warning Management</h2>
            <button
              type="button"
              className="ts-btn-secondary"
              onClick={() => { setWarningTargetId(retailers[0]?.id); setIsWarningModalOpen(true); }}
            >
              + Issue Warning
            </button>
          </div>
          <div className="ts-warnings-list">
            {warnings.length === 0 ? (
              <div className="ts-empty-state">
                <IconAlertTriangle size={40} />
                <p>No warnings issued yet.</p>
              </div>
            ) : (
              [...warnings].sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate)).map(w => (
                <div key={w.id} className={`ts-warning-card lvl-${w.level} ${w.isResolved ? 'resolved' : ''}`}>
                  <div className="ts-warning-card-header">
                    <div className="ts-warning-card-left">
                      <span className={`ts-warning-pill lvl-${w.level}`}>Warning {w.level}</span>
                      <span className="ts-warning-retailer">{getRetailerName(w.retailerId)}</span>
                      {w.isResolved && <span className="ts-resolved-pill">Resolved</span>}
                    </div>
                    <div className="ts-warning-card-right">
                      <span className="ts-warning-issued">Issued: {w.issuedDate}</span>
                      {!w.isResolved && <span className="ts-warning-deadline">Deadline: {w.deadline}</span>}
                    </div>
                  </div>
                  <p className="ts-warning-reason"><strong>Reason:</strong> {w.reason}</p>
                  {w.retailerResponse && (
                    <div className="ts-retailer-response">
                      <span className="ts-response-label">Retailer Response:</span>
                      <p>{w.retailerResponse}</p>
                    </div>
                  )}
                  {w.adminNotes && (
                    <div className="ts-admin-note">
                      <span className="ts-note-label"><IconInfo size={13} /> Admin Notes:</span>
                      <p>{w.adminNotes}</p>
                    </div>
                  )}
                  {!w.isResolved && (
                    <div className="ts-warning-actions">
                      <button
                        type="button"
                        className="ts-action-pill resolve"
                        onClick={() => { resolveWarning(w.id, 'Resolved by admin.'); showToast('Warning resolved.'); }}
                      >
                        <IconCheck size={13} /> Clear Warning
                      </button>
                      <button
                        type="button"
                        className="ts-action-pill view-profile"
                        onClick={() => openProfile(w.retailerId)}
                      >
                        <IconEye size={13} /> View Profile
                      </button>
                      <button
                        type="button"
                        className="ts-action-pill suspend"
                        onClick={() => handleAdminAction('suspend', w.retailerId, 'Suspend Retailer')}
                      >
                        <IconBan size={13} /> Suspend Retailer
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===== NOTIFICATIONS SECTION ===== */}
      {activeSection === 'notifications' && (
        <div className="ts-section">
          <div className="ts-section-header-row">
            <h2 className="ts-section-title">System Notifications</h2>
            {unreadNotificationsCount > 0 && (
              <button type="button" className="ts-btn-secondary" onClick={markAllNotificationsRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className="ts-notifs-list">
            {notifications.length === 0 ? (
              <div className="ts-empty-state">
                <IconBell size={40} />
                <p>No notifications.</p>
              </div>
            ) : (
              [...notifications]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(n => (
                  <div
                    key={n.id}
                    className={`ts-notif-card ts-notif-${n.type} ${n.isRead ? 'read' : 'unread'}`}
                    onClick={() => !n.isRead && markNotificationRead(n.id)}
                  >
                    <div className="ts-notif-icon">
                      {n.type.includes('warning') ? <IconAlertTriangle size={18} /> :
                        n.type.includes('approved') ? <IconShieldCheck size={18} /> :
                        n.type.includes('banned') || n.type.includes('suspended') ? <IconBan size={18} /> :
                        <IconBell size={18} />}
                    </div>
                    <div className="ts-notif-content">
                      <span className="ts-notif-retailer">{getRetailerName(n.retailerId)}</span>
                      <p className="ts-notif-message">{n.message}</p>
                      <span className="ts-notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    {!n.isRead && <div className="ts-notif-unread-dot" />}
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* ===== MODALS ===== */}

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="ts-modal-backdrop" onClick={() => setConfirmAction(null)}>
          <div className="ts-modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="ts-modal-title">{confirmAction.label}</h3>
            {['reject', 'suspend', 'ban', 'reverify'].includes(confirmAction.type) && (
              <div className="ts-modal-field">
                <label className="ts-label">
                  {confirmAction.type === 'reverify' ? 'Reason for Re-verification' : 'Reason / Admin Note'}
                </label>
                <textarea
                  className="ts-textarea"
                  rows={3}
                  placeholder="Enter reason..."
                  value={confirmReason}
                  onChange={e => setConfirmReason(e.target.value)}
                />
              </div>
            )}
            {confirmAction.type === 'approve' && (
              <p className="ts-modal-desc">Are you sure you want to approve the verification for this retailer?</p>
            )}
            {confirmAction.type === 'restore' && (
              <p className="ts-modal-desc">This will restore the retailer account and set it to Under Review status.</p>
            )}
            <div className="ts-modal-footer">
              <button type="button" className="ts-btn-cancel" onClick={() => setConfirmAction(null)}>Cancel</button>
              <button
                type="button"
                className={`ts-btn-confirm ${['ban', 'suspend', 'reject'].includes(confirmAction.type) ? 'danger' : ''}`}
                onClick={executeAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust Profile Modal */}
      {isProfileOpen && selectedRetailerId && (
        <RetailerTrustProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          retailer={retailers.find(r => r.id === selectedRetailerId)}
          trustSafety={trustSafety}
          onIssueWarning={(id) => { setWarningTargetId(id); setIsWarningModalOpen(true); }}
          onAdminAction={handleAdminAction}
          showToast={showToast}
        />
      )}

      {/* Submit Review Modal */}
      {isReviewModalOpen && (
        <SubmitReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          retailers={retailers}
          onSubmit={(data) => { submitReview(data); showToast('Review submitted.'); setIsReviewModalOpen(false); }}
        />
      )}

      {/* Issue Warning Modal */}
      {isWarningModalOpen && warningTargetId && (
        <IssueWarningModal
          isOpen={isWarningModalOpen}
          onClose={() => setIsWarningModalOpen(false)}
          retailer={retailers.find(r => r.id === warningTargetId)}
          existingWarnings={warnings.filter(w => w.retailerId === warningTargetId && !w.isResolved)}
          onIssue={(reason) => {
            issueWarning(warningTargetId, reason);
            showToast('Warning issued.');
            setIsWarningModalOpen(false);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`ts-toast ts-toast-${toast.type}`}>
          {toast.type === 'success' ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
