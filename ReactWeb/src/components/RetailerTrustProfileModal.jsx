import React, { useState } from 'react';
import {
  IconX, IconShieldCheck, IconAlertTriangle, IconBan, IconCheck,
  IconRefresh, IconActivity, IconMessageSquare, IconTrendingUp,
  IconInfo, IconEye, IconSend, IconChevronDown, IconChevronUp,
} from './Icons';
import { getTrustClassification, getVerificationStatusStyle, TRUST_SCORE_WEIGHTS, COMPLAINT_CATEGORIES } from '../data/trustSafetyData';

export function RetailerTrustProfileModal({
  isOpen, onClose, retailer, trustSafety, onIssueWarning, onAdminAction, showToast
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [replyText, setReplyText] = useState({});
  const [adminRemark, setAdminRemark] = useState('');
  const [showAdminRemark, setShowAdminRemark] = useState(false);

  if (!isOpen || !retailer) return null;

  const {
    getProfileForRetailer, getReviewsForRetailer, getWarningsForRetailer,
    getNotificationsForRetailer, getScoreHistoryForRetailer,
    addRetailerResponseToReview, resolveComplaint, addRetailerResponseToWarning,
    resolveWarning, updateAdminRemarks, requestReverification,
  } = trustSafety;

  const profile = getProfileForRetailer(retailer.id);
  const reviews = getReviewsForRetailer(retailer.id);
  const warningsList = getWarningsForRetailer(retailer.id);
  const notifications = getNotificationsForRetailer(retailer.id);
  const scoreHistory = getScoreHistoryForRetailer(retailer.id);

  if (!profile) return null;

  const score = profile.trustScore || 0;
  const cls = getTrustClassification(score);
  const vs = getVerificationStatusStyle(profile.verificationStatus);

  const verificationChecks = [
    { label: 'Business Email', passed: profile.emailVerified, note: 'Email verified via confirmation link' },
    { label: 'Business Phone', passed: profile.phoneVerified, note: 'Phone number verified via OTP' },
    { label: 'Website HTTPS', passed: profile.websiteHttps, note: profile.websiteHttps ? 'Secure HTTPS connection' : 'HTTP only — not conclusive of fraud, reduces confidence' },
    { label: 'Website Reachable', passed: profile.websiteReachable, note: profile.websiteReachable === null ? 'Manual check pending' : profile.websiteReachable ? 'Site is reachable' : 'Site unreachable' },
    { label: 'Business Reg. No.', passed: !!profile.businessRegNumber, note: profile.businessRegNumber || 'Not provided' },
    { label: 'GSTIN Check', passed: profile.gstinStatus === 'verified', note: profile.gstinStatus === 'not_applicable' ? 'Not applicable for this entity' : profile.gstinStatus === 'pending' ? 'Pending manual verification' : 'GSTIN verified' },
  ];

  const handleReply = (reviewId) => {
    if (!replyText[reviewId]) return;
    addRetailerResponseToReview(reviewId, replyText[reviewId]);
    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    showToast('Response added.');
  };

  const handleWarningReply = (warningId) => {
    if (!replyText[`w-${warningId}`]) return;
    addRetailerResponseToWarning(warningId, replyText[`w-${warningId}`]);
    setReplyText(prev => ({ ...prev, [`w-${warningId}`]: '' }));
    showToast('Response submitted.');
  };

  const handleSaveAdminRemark = () => {
    updateAdminRemarks(retailer.id, adminRemark);
    setShowAdminRemark(false);
    showToast('Admin remarks updated.');
  };

  return (
    <div className="ts-modal-backdrop" onClick={onClose}>
      <div className="ts-profile-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="ts-profile-header">
          <div className="ts-profile-header-info">
            <img src={retailer.image} alt={retailer.name} className="ts-profile-thumb" />
            <div>
              <h2 className="ts-profile-name">{retailer.name}</h2>
              <div className="ts-profile-meta-row">
                <span className="ts-vstatus-pill" style={{ color: vs.color, background: vs.bg }}>
                  {profile.verificationStatus}
                </span>
                <span className="ts-score-badge" style={{ background: cls.color }}>
                  {score}/100 — {cls.label}
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="ts-modal-close" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>

        {/* Score Bar */}
        <div className="ts-profile-score-bar">
          <div className="ts-score-track">
            <div
              className="ts-score-fill"
              style={{ width: `${score}%`, background: cls.color }}
            />
          </div>
          <span className="ts-score-pct">{score}</span>
        </div>

        {/* Profile Tabs */}
        <div className="ts-profile-tabs">
          {[
            { id: 'overview', label: 'Business Info' },
            { id: 'score', label: 'Trust Score' },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
            { id: 'warnings', label: `Warnings (${warningsList.length})` },
            { id: 'history', label: 'Score History' },
            { id: 'admin', label: 'Admin' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`ts-profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ts-profile-body">
          {/* Business Info Tab */}
          {activeTab === 'overview' && (
            <div className="ts-profile-tab-content">
              <div className="ts-info-grid">
                {[
                  { label: 'Business Name', value: profile.businessName },
                  { label: 'Owner / Contact', value: profile.ownerName || '—' },
                  { label: 'Business Email', value: profile.businessEmail },
                  { label: 'Business Phone', value: profile.businessPhone },
                  { label: 'Business Address', value: profile.businessAddress },
                  { label: 'Website', value: profile.website },
                  { label: 'GSTIN', value: profile.gstin || 'Not provided' },
                  { label: 'Reg. Number', value: profile.businessRegNumber || 'Not provided' },
                  { label: 'Registration Date', value: profile.registrationDate },
                  { label: 'Verification Date', value: profile.verificationDate || 'Pending' },
                  { label: 'Account Status', value: profile.accountStatus },
                  { label: 'Warning Count', value: profile.warningCount },
                  { label: 'Complaint Count', value: profile.complaintCount },
                ].map(item => (
                  <div key={item.label} className="ts-info-item">
                    <span className="ts-info-label">{item.label}</span>
                    <span className="ts-info-value">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Verification Checks */}
              <div className="ts-checks-section">
                <h4 className="ts-checks-title">Verification Checks</h4>
                <div className="ts-checks-note">
                  <IconInfo size={13} />
                  <span>Missing HTTPS or documents alone do not constitute fraud. These reduce verification confidence.</span>
                </div>
                {verificationChecks.map(check => (
                  <div key={check.label} className={`ts-check-row ${check.passed === null ? 'pending' : check.passed ? 'pass' : 'fail'}`}>
                    <span className="ts-check-icon">
                      {check.passed === null ? '⏳' : check.passed ? '✓' : '⚠'}
                    </span>
                    <span className="ts-check-label">{check.label}</span>
                    <span className="ts-check-note">{check.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Score Tab */}
          {activeTab === 'score' && (
            <div className="ts-profile-tab-content">
              <div className="ts-score-breakdown-header">
                <div className="ts-score-big" style={{ color: cls.color }}>
                  <span className="ts-score-big-num">{score}</span>
                  <span className="ts-score-big-label">{cls.label}</span>
                </div>
                <div className="ts-score-classification-bands">
                  {[
                    { range: '80–100', label: 'Trusted Retailer', color: '#0e8048' },
                    { range: '60–79', label: 'Under Observation', color: '#d97706' },
                    { range: '40–59', label: 'Warning Issued', color: '#ea580c' },
                    { range: '0–39', label: 'High Risk', color: '#dc2626' },
                  ].map(b => (
                    <div key={b.range} className="ts-band-row">
                      <span className="ts-band-dot" style={{ background: b.color }} />
                      <span className="ts-band-range">{b.range}</span>
                      <span className="ts-band-label">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h4 className="ts-breakdown-title">Score Breakdown</h4>
              {Object.entries(TRUST_SCORE_WEIGHTS).map(([key, meta]) => {
                const earned = profile.trustScoreBreakdown?.[key] || 0;
                const pct = Math.round((earned / meta.weight) * 100);
                return (
                  <div key={key} className="ts-breakdown-row">
                    <div className="ts-breakdown-info">
                      <span className="ts-breakdown-label">{meta.label}</span>
                      <span className="ts-breakdown-score">{earned} / {meta.weight}</span>
                    </div>
                    <div className="ts-breakdown-bar-wrap">
                      <div
                        className="ts-breakdown-bar"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 80 ? '#0e8048' : pct >= 60 ? '#d97706' : pct >= 40 ? '#ea580c' : '#dc2626'
                        }}
                      />
                    </div>
                    <span className="ts-breakdown-pct">{pct}%</span>
                  </div>
                );
              })}

              <p className="ts-score-note">
                <IconInfo size={13} /> Scores recalculate automatically when verification status changes, complaints are filed, or warnings are issued. A low score alone does not trigger automatic banning.
              </p>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="ts-profile-tab-content">
              {reviews.length === 0 ? (
                <div className="ts-empty-state"><IconMessageSquare size={36} /><p>No reviews yet.</p></div>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className={`ts-review-card ${rev.complaintCategory ? 'complaint' : ''}`}>
                    <div className="ts-review-header">
                      <div>
                        <span className="ts-review-customer">{rev.customerName}</span>
                        {rev.verifiedPurchase ? <span className="ts-verified-badge"><IconCheck size={11} /> Verified</span> : <span className="ts-unverified-badge">Unverified</span>}
                        <span className="ts-review-date">{rev.submissionDate}</span>
                      </div>
                      <div className="ts-star-rating">
                        {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= rev.starRating ? '#f59e0b' : '#d1d5db' }}>★</span>)}
                      </div>
                    </div>
                    {rev.complaintCategory && <span className="ts-category-pill">{rev.complaintCategory}</span>}
                    <p className="ts-review-desc">{rev.description}</p>
                    {rev.investigationStatus !== 'None' && (
                      <span className={`ts-inv-status ${rev.investigationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>{rev.investigationStatus}</span>
                    )}
                    {rev.retailerResponse ? (
                      <div className="ts-retailer-response">
                        <span className="ts-response-label">Retailer Response:</span>
                        <p>{rev.retailerResponse}</p>
                      </div>
                    ) : (
                      <div className="ts-reply-box">
                        <textarea
                          className="ts-textarea"
                          rows={2}
                          placeholder="Respond to this review..."
                          value={replyText[rev.id] || ''}
                          onChange={e => setReplyText(prev => ({ ...prev, [rev.id]: e.target.value }))}
                        />
                        <button type="button" className="ts-reply-btn" onClick={() => handleReply(rev.id)}>
                          <IconSend size={13} /> Submit Response
                        </button>
                      </div>
                    )}
                    {rev.complaintCategory && rev.investigationStatus !== 'Resolved' && (
                      <button
                        type="button"
                        className="ts-action-pill resolve"
                        style={{ marginTop: 8 }}
                        onClick={() => { resolveComplaint(rev.id, 'Admin marked as resolved.'); showToast('Complaint resolved.'); }}
                      >
                        <IconCheck size={12} /> Mark Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Warnings Tab */}
          {activeTab === 'warnings' && (
            <div className="ts-profile-tab-content">
              <button
                type="button"
                className="ts-btn-primary"
                style={{ marginBottom: 16 }}
                onClick={() => onIssueWarning(retailer.id)}
              >
                + Issue Warning
              </button>
              {warningsList.length === 0 ? (
                <div className="ts-empty-state"><IconAlertTriangle size={36} /><p>No warnings on this account.</p></div>
              ) : (
                warningsList.map(w => (
                  <div key={w.id} className={`ts-warning-card lvl-${w.level} ${w.isResolved ? 'resolved' : ''}`}>
                    <div className="ts-warning-card-header">
                      <span className={`ts-warning-pill lvl-${w.level}`}>Warning {w.level}</span>
                      {w.isResolved && <span className="ts-resolved-pill">Resolved</span>}
                      <span className="ts-warning-issued">Issued: {w.issuedDate}</span>
                      {!w.isResolved && <span className="ts-warning-deadline">Due: {w.deadline}</span>}
                    </div>
                    <p className="ts-warning-reason"><strong>Reason:</strong> {w.reason}</p>
                    {w.retailerResponse ? (
                      <div className="ts-retailer-response">
                        <span className="ts-response-label">Retailer Response:</span>
                        <p>{w.retailerResponse}</p>
                      </div>
                    ) : !w.isResolved && (
                      <div className="ts-reply-box">
                        <textarea
                          className="ts-textarea"
                          rows={2}
                          placeholder="Retailer response..."
                          value={replyText[`w-${w.id}`] || ''}
                          onChange={e => setReplyText(prev => ({ ...prev, [`w-${w.id}`]: e.target.value }))}
                        />
                        <button type="button" className="ts-reply-btn" onClick={() => handleWarningReply(w.id)}>
                          <IconSend size={13} /> Submit Response
                        </button>
                      </div>
                    )}
                    {!w.isResolved && (
                      <div className="ts-warning-actions">
                        <button type="button" className="ts-action-pill resolve"
                          onClick={() => { resolveWarning(w.id, 'Resolved after review.'); showToast('Warning cleared.'); }}>
                          <IconCheck size={12} /> Clear Warning
                        </button>
                        <button type="button" className="ts-action-pill suspend"
                          onClick={() => onAdminAction('suspend', retailer.id, 'Suspend Retailer')}>
                          <IconBan size={12} /> Suspend
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Score History Tab */}
          {activeTab === 'history' && (
            <div className="ts-profile-tab-content">
              <h4 className="ts-checks-title">Trust Score Audit History</h4>
              {scoreHistory.length === 0 ? (
                <div className="ts-empty-state"><IconActivity size={36} /><p>No score history yet.</p></div>
              ) : (
                <div className="ts-history-timeline">
                  {[...scoreHistory].reverse().map((entry, i) => (
                    <div key={i} className="ts-history-entry">
                      <div className="ts-history-date">{entry.date}</div>
                      <div className="ts-history-dot" style={{ background: getTrustClassification(entry.score).color }} />
                      <div className="ts-history-content">
                        <span className="ts-history-score" style={{ color: getTrustClassification(entry.score).color }}>
                          Score: {entry.score}
                        </span>
                        <span className="ts-history-reason">{entry.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin Tab */}
          {activeTab === 'admin' && (
            <div className="ts-profile-tab-content">
              <div className="ts-admin-actions-grid">
                {profile.verificationStatus === 'Pending' && (
                  <>
                    <button type="button" className="ts-admin-action-btn approve"
                      onClick={() => { onAdminAction('approve', retailer.id, 'Approve Verification'); onClose(); }}>
                      <IconShieldCheck size={16} /> Approve Verification
                    </button>
                    <button type="button" className="ts-admin-action-btn reject"
                      onClick={() => { onAdminAction('reject', retailer.id, 'Reject Verification'); onClose(); }}>
                      <IconX size={16} /> Reject Verification
                    </button>
                  </>
                )}
                <button type="button" className="ts-admin-action-btn warn"
                  onClick={() => { onIssueWarning(retailer.id); onClose(); }}>
                  <IconAlertTriangle size={16} /> Issue Warning
                </button>
                <button type="button" className="ts-admin-action-btn reverify"
                  onClick={() => { onAdminAction('reverify', retailer.id, 'Request Re-Verification'); onClose(); }}>
                  <IconRefresh size={16} /> Request Re-Verification
                </button>
                {profile.verificationStatus !== 'Suspended' && profile.verificationStatus !== 'Banned' && (
                  <button type="button" className="ts-admin-action-btn suspend"
                    onClick={() => { onAdminAction('suspend', retailer.id, 'Suspend Retailer'); onClose(); }}>
                    <IconBan size={16} /> Suspend Retailer
                  </button>
                )}
                {profile.verificationStatus === 'Suspended' && (
                  <>
                    <button type="button" className="ts-admin-action-btn restore"
                      onClick={() => { onAdminAction('restore', retailer.id, 'Restore Retailer'); onClose(); }}>
                      <IconRefresh size={16} /> Restore Retailer
                    </button>
                    <button type="button" className="ts-admin-action-btn ban"
                      onClick={() => { onAdminAction('ban', retailer.id, 'Permanently Ban Retailer'); onClose(); }}>
                      <IconBan size={16} /> Permanently Ban
                    </button>
                  </>
                )}
              </div>

              {/* Admin Remarks */}
              <div className="ts-admin-remarks-section">
                <div className="ts-admin-remarks-header">
                  <h4>Admin Remarks</h4>
                  <button type="button" className="ts-btn-secondary" onClick={() => { setAdminRemark(profile.adminRemarks || ''); setShowAdminRemark(!showAdminRemark); }}>
                    Edit
                  </button>
                </div>
                {showAdminRemark ? (
                  <div>
                    <textarea
                      className="ts-textarea"
                      rows={4}
                      value={adminRemark}
                      onChange={e => setAdminRemark(e.target.value)}
                      placeholder="Enter admin notes..."
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="button" className="ts-btn-primary" onClick={handleSaveAdminRemark}>Save</button>
                      <button type="button" className="ts-btn-cancel" onClick={() => setShowAdminRemark(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="ts-admin-remarks-text">{profile.adminRemarks || 'No remarks yet.'}</p>
                )}
              </div>

              {/* Notifications History */}
              <div className="ts-admin-remarks-section">
                <h4>Notification History</h4>
                {notifications.length === 0 ? <p className="ts-empty-text">No notifications.</p> : (
                  notifications.slice(0, 5).map(n => (
                    <div key={n.id} className="ts-notif-mini">
                      <span className="ts-notif-mini-type">{n.type.replace(/_/g, ' ')}</span>
                      <span className="ts-notif-mini-msg">{n.message}</span>
                      <span className="ts-notif-mini-date">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
