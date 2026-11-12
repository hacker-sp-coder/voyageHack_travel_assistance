import { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_TRUST_PROFILES,
  INITIAL_REVIEWS,
  INITIAL_WARNINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRUST_SCORE_HISTORY,
  TRUST_STORAGE_KEYS,
  getTrustClassification,
  TRUST_SCORE_WEIGHTS,
} from '../data/trustSafetyData';

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return fallback;
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function useTrustSafety(retailers) {
  const [trustProfiles, setTrustProfiles] = useState(() =>
    loadFromStorage(TRUST_STORAGE_KEYS.PROFILES, INITIAL_TRUST_PROFILES)
  );
  const [reviews, setReviews] = useState(() =>
    loadFromStorage(TRUST_STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [warnings, setWarnings] = useState(() =>
    loadFromStorage(TRUST_STORAGE_KEYS.WARNINGS, INITIAL_WARNINGS)
  );
  const [notifications, setNotifications] = useState(() =>
    loadFromStorage(TRUST_STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [trustScoreHistory, setTrustScoreHistory] = useState(() =>
    loadFromStorage(TRUST_STORAGE_KEYS.SCORE_HISTORY, INITIAL_TRUST_SCORE_HISTORY)
  );

  // Persist to localStorage on change
  useEffect(() => { saveToStorage(TRUST_STORAGE_KEYS.PROFILES, trustProfiles); }, [trustProfiles]);
  useEffect(() => { saveToStorage(TRUST_STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
  useEffect(() => { saveToStorage(TRUST_STORAGE_KEYS.WARNINGS, warnings); }, [warnings]);
  useEffect(() => { saveToStorage(TRUST_STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(TRUST_STORAGE_KEYS.SCORE_HISTORY, trustScoreHistory); }, [trustScoreHistory]);

  // Ensure new retailers get a default trust profile
  useEffect(() => {
    if (!retailers) return;
    setTrustProfiles(prev => {
      const updated = { ...prev };
      let changed = false;
      retailers.forEach(r => {
        if (!updated[r.id]) {
          updated[r.id] = {
            retailerId: r.id,
            verificationStatus: 'Pending',
            businessName: r.name,
            ownerName: '',
            businessEmail: r.contactEmail || '',
            businessPhone: r.contactPhone || '',
            businessAddress: `${r.terminal}, ${r.hub}`,
            website: r.website || '',
            gstin: '',
            businessRegNumber: '',
            registrationDate: new Date().toISOString().split('T')[0],
            verificationDate: null,
            gstinStatus: 'pending',
            emailVerified: false,
            phoneVerified: false,
            websiteHttps: r.website ? r.website.startsWith('https') : false,
            websiteReachable: null,
            adminRemarks: '',
            trustScore: 50,
            trustScoreBreakdown: { businessIdentity: 10, reviewCredibility: 13, complaintHistory: 10, websiteContact: 10, suspiciousActivity: 7 },
            warningCount: 0,
            complaintCount: 0,
            accountStatus: 'Active',
            appealHistory: [],
          };
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [retailers]);

  const getProfileForRetailer = useCallback((retailerId) => {
    return trustProfiles[retailerId] || null;
  }, [trustProfiles]);

  const getReviewsForRetailer = useCallback((retailerId) => {
    return reviews.filter(r => r.retailerId === retailerId);
  }, [reviews]);

  const getWarningsForRetailer = useCallback((retailerId) => {
    return warnings.filter(w => w.retailerId === retailerId);
  }, [warnings]);

  const getNotificationsForRetailer = useCallback((retailerId) => {
    return notifications.filter(n => n.retailerId === retailerId);
  }, [notifications]);

  const getScoreHistoryForRetailer = useCallback((retailerId) => {
    return trustScoreHistory[retailerId] || [];
  }, [trustScoreHistory]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // ---- Admin Actions ----

  const updateProfile = useCallback((retailerId, updates, scoreReason = null) => {
    setTrustProfiles(prev => {
      const existing = prev[retailerId] || {};
      const updated = { ...existing, ...updates };

      // Recalculate trust score from breakdown if present
      if (updates.trustScoreBreakdown) {
        const newScore = Object.values(updates.trustScoreBreakdown).reduce((a, b) => a + b, 0);
        updated.trustScore = Math.min(100, Math.max(0, newScore));
      }

      return { ...prev, [retailerId]: updated };
    });

    if (scoreReason) {
      setTrustScoreHistory(prev => {
        const history = prev[retailerId] ? [...prev[retailerId]] : [];
        const profile = trustProfiles[retailerId] || {};
        const newScore = updates.trustScore !== undefined ? updates.trustScore :
          (updates.trustScoreBreakdown ? Object.values(updates.trustScoreBreakdown).reduce((a, b) => a + b, 0) : profile.trustScore);
        history.push({ date: new Date().toISOString().split('T')[0], score: newScore, reason: scoreReason });
        return { ...prev, [retailerId]: history };
      });
    }
  }, [trustProfiles]);

  const approveVerification = useCallback((retailerId) => {
    updateProfile(retailerId, {
      verificationStatus: 'Verified',
      verificationDate: new Date().toISOString().split('T')[0],
      trustScoreBreakdown: {
        ...(trustProfiles[retailerId]?.trustScoreBreakdown || {}),
        businessIdentity: Math.min(25, (trustProfiles[retailerId]?.trustScoreBreakdown?.businessIdentity || 10) + 8),
      },
    }, 'Verification approved by admin');
    addNotification(retailerId, 'verification_approved', 'Your retailer account has been verified. Welcome to VoyageRetail!');
  }, [trustProfiles]);

  const rejectVerification = useCallback((retailerId, reason) => {
    updateProfile(retailerId, { verificationStatus: 'Rejected', adminRemarks: reason }, 'Verification rejected');
    addNotification(retailerId, 'verification_rejected', `Your verification request has been rejected. Reason: ${reason}`);
  }, []);

  const issueWarning = useCallback((retailerId, reason, level = null) => {
    const profile = trustProfiles[retailerId];
    const existingWarnings = warnings.filter(w => w.retailerId === retailerId && !w.isResolved);
    const nextLevel = level || Math.min(3, existingWarnings.length + 1);
    const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newWarning = {
      id: `warn-${Date.now()}`,
      retailerId,
      level: nextLevel,
      reason,
      issuedDate: new Date().toISOString().split('T')[0],
      deadline,
      isResolved: false,
      adminId: 'admin-01',
      retailerResponse: null,
      adminNotes: null,
    };

    setWarnings(prev => [...prev, newWarning]);

    // Update profile
    const scoreReduction = nextLevel === 1 ? 5 : nextLevel === 2 ? 10 : 15;
    const currentBreakdown = profile?.trustScoreBreakdown || {};
    updateProfile(retailerId, {
      warningCount: (profile?.warningCount || 0) + 1,
      verificationStatus: nextLevel >= 2 ? 'Under Review' : profile?.verificationStatus,
      trustScoreBreakdown: {
        ...currentBreakdown,
        suspiciousActivity: Math.max(0, (currentBreakdown.suspiciousActivity || 10) - scoreReduction / 2),
        complaintHistory: Math.max(0, (currentBreakdown.complaintHistory || 10) - scoreReduction / 2),
      },
    }, `Warning Level ${nextLevel} issued: ${reason}`);

    const messages = {
      1: `Warning 1 has been issued against your account. Reason: ${reason}. Corrective action required by ${deadline}.`,
      2: `Warning 2: Further non-compliance detected. ${reason}. Final deadline: ${deadline}. Your account is now Under Observation.`,
      3: `Warning 3: Your case has been escalated to the administrator. ${reason}. An investigation is underway.`,
    };
    addNotification(retailerId, `warning_level_${nextLevel}`, messages[nextLevel]);
  }, [trustProfiles, warnings]);

  const suspendRetailer = useCallback((retailerId, reason) => {
    updateProfile(retailerId, { verificationStatus: 'Suspended', accountStatus: 'Suspended', adminRemarks: reason }, 'Account suspended by admin');
    addNotification(retailerId, 'account_suspended', `Your account has been suspended. Reason: ${reason}. You may submit an appeal.`);
  }, []);

  const restoreRetailer = useCallback((retailerId) => {
    updateProfile(retailerId, { verificationStatus: 'Under Review', accountStatus: 'Active', adminRemarks: 'Account restored. Under review.' }, 'Account restored by admin');
    addNotification(retailerId, 'account_restored', 'Your account has been restored and is now Under Review. Please ensure compliance.');
  }, []);

  const banRetailer = useCallback((retailerId, reason) => {
    updateProfile(retailerId, { verificationStatus: 'Banned', accountStatus: 'Banned', adminRemarks: reason }, 'Account permanently banned');
    addNotification(retailerId, 'account_banned', `Your account has been permanently banned. Reason: ${reason}. You have the right to appeal.`);
  }, []);

  const resolveWarning = useCallback((warningId, adminNotes) => {
    setWarnings(prev => prev.map(w => w.id === warningId ? { ...w, isResolved: true, adminNotes } : w));
  }, []);

  const addRetailerResponseToWarning = useCallback((warningId, response) => {
    setWarnings(prev => prev.map(w => w.id === warningId ? { ...w, retailerResponse: response } : w));
  }, []);

  const submitReview = useCallback((reviewData) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      investigationStatus: reviewData.complaintCategory ? 'Open' : 'None',
      retailerResponse: null,
      ...reviewData,
    };
    setReviews(prev => [newReview, ...prev]);

    // Update complaint count and potentially reduce score
    const profile = trustProfiles[reviewData.retailerId];
    if (profile && reviewData.complaintCategory) {
      const currentBreakdown = profile.trustScoreBreakdown || {};
      const reduction = reviewData.verifiedPurchase ? 2 : 1;
      updateProfile(reviewData.retailerId, {
        complaintCount: (profile.complaintCount || 0) + 1,
        trustScoreBreakdown: {
          ...currentBreakdown,
          complaintHistory: Math.max(0, (currentBreakdown.complaintHistory || 10) - reduction),
          reviewCredibility: Math.max(0, (currentBreakdown.reviewCredibility || 10) - (reduction / 2)),
        },
      }, `Complaint submitted: ${reviewData.complaintCategory}`);
      addNotification(reviewData.retailerId, 'complaint_received', `A new complaint has been filed against your account: ${reviewData.complaintCategory}. Please review and respond.`);
    }

    return newReview;
  }, [trustProfiles]);

  const addRetailerResponseToReview = useCallback((reviewId, response) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, retailerResponse: response } : r));
  }, []);

  const resolveComplaint = useCallback((reviewId, resolution) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, investigationStatus: 'Resolved', adminResolution: resolution } : r));
  }, []);

  const addNotification = useCallback((retailerId, type, message) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      retailerId,
      type,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const requestReverification = useCallback((retailerId, reason) => {
    updateProfile(retailerId, { verificationStatus: 'Under Review', adminRemarks: `Re-verification requested: ${reason}` }, 'Re-verification requested');
    addNotification(retailerId, 'reverification_requested', `Your account has been flagged for re-verification. Reason: ${reason}. Please submit updated documents.`);
  }, []);

  const updateAdminRemarks = useCallback((retailerId, remarks) => {
    setTrustProfiles(prev => ({
      ...prev,
      [retailerId]: { ...prev[retailerId], adminRemarks: remarks },
    }));
  }, []);

  const resetTrustData = useCallback(() => {
    setTrustProfiles(INITIAL_TRUST_PROFILES);
    setReviews(INITIAL_REVIEWS);
    setWarnings(INITIAL_WARNINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTrustScoreHistory(INITIAL_TRUST_SCORE_HISTORY);
    Object.values(TRUST_STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }, []);

  // ---- Dashboard Statistics ----
  const getDashboardStats = useCallback(() => {
    const profiles = Object.values(trustProfiles);
    return {
      total: profiles.length,
      verified: profiles.filter(p => p.verificationStatus === 'Verified').length,
      pending: profiles.filter(p => p.verificationStatus === 'Pending').length,
      underInvestigation: profiles.filter(p => p.verificationStatus === 'Under Review').length,
      activeWarnings: warnings.filter(w => !w.isResolved).length,
      suspended: profiles.filter(p => p.verificationStatus === 'Suspended').length,
      banned: profiles.filter(p => p.verificationStatus === 'Banned').length,
      highRisk: profiles.filter(p => p.trustScore < 40).length,
      openComplaints: reviews.filter(r => r.investigationStatus === 'Open' || r.investigationStatus === 'Under Investigation').length,
    };
  }, [trustProfiles, warnings, reviews]);

  return {
    trustProfiles,
    reviews,
    warnings,
    notifications,
    trustScoreHistory,
    unreadNotificationsCount,
    getProfileForRetailer,
    getReviewsForRetailer,
    getWarningsForRetailer,
    getNotificationsForRetailer,
    getScoreHistoryForRetailer,
    updateProfile,
    approveVerification,
    rejectVerification,
    issueWarning,
    suspendRetailer,
    restoreRetailer,
    banRetailer,
    resolveWarning,
    addRetailerResponseToWarning,
    submitReview,
    addRetailerResponseToReview,
    resolveComplaint,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    requestReverification,
    updateAdminRemarks,
    resetTrustData,
    getDashboardStats,
  };
}
