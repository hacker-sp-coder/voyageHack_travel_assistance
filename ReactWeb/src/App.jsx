import { useState, useEffect, useMemo } from 'react';
import { INITIAL_RETAILERS } from './data/initialRetailers';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { SearchFilterBar } from './components/SearchFilterBar';
import { RetailerCard } from './components/RetailerCard';
import { RetailerTable } from './components/RetailerTable';
import { RetailerModal } from './components/RetailerModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RetailerDetailModal } from './components/RetailerDetailModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { HubsView } from './components/HubsView';
import { PerformanceView } from './components/PerformanceView';
import './App.css';

const LOCAL_STORAGE_KEY = 'voyageretail_concessions_v1';

function App() {
  // 1. Core State
  const [retailers, setRetailers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return INITIAL_RETAILERS;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('retailers'); // 'retailers' | 'hubs' | 'performance'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // 2. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHub, setSelectedHub] = useState('All Hubs');
  const [minRating, setMinRating] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');

  // 3. Modals State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [retailerToEdit, setRetailerToEdit] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [retailerToDelete, setRetailerToDelete] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [retailerToView, setRetailerToView] = useState(null);

  // 4. Toast Feedback Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Persist retailers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(retailers));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [retailers]);

  // Brief initial loading state for polished UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // 5. CRUD Operations
  const handleOpenAddModal = () => {
    setRetailerToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (retailer) => {
    setRetailerToEdit(retailer);
    setIsAddEditOpen(true);
  };

  const handleSaveRetailer = (formData) => {
    if (retailerToEdit) {
      // Update existing retailer
      setRetailers((prev) =>
        prev.map((r) => (r.id === retailerToEdit.id ? { ...formData, id: retailerToEdit.id } : r))
      );
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      // Add new retailer
      const newRetailer = {
        ...formData,
        id: `ret-${Date.now()}`
      };
      setRetailers((prev) => [newRetailer, ...prev]);
      showToast(`Added "${formData.name}" to directory!`);
    }
    setIsAddEditOpen(false);
    setRetailerToEdit(null);
  };

  const handleOpenDeleteModal = (retailer) => {
    setRetailerToDelete(retailer);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = (id) => {
    const target = retailers.find((r) => r.id === id);
    setRetailers((prev) => prev.filter((r) => r.id !== id));
    setIsDeleteOpen(false);
    setRetailerToDelete(null);
    showToast(`Removed "${target ? target.name : 'Retailer'}" from directory.`, 'error');
  };

  const handleViewDetails = (retailer) => {
    setRetailerToView(retailer);
    setIsDetailOpen(true);
  };

  const handleResetDemo = () => {
    setRetailers(INITIAL_RETAILERS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Reset to default demo retailers catalog.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedHub('All Hubs');
    setMinRating(0);
    setStatusFilter('All');
  };

  const handleSelectHubFromView = (hubName) => {
    setSelectedHub(hubName);
    setActiveTab('retailers');
  };

  // 6. Filter & Sort Logic
  const filteredRetailers = useMemo(() => {
    return retailers.filter((retailer) => {
      // Search text match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = retailer.name.toLowerCase().includes(query);
        const matchesCategory = retailer.category.toLowerCase().includes(query);
        const matchesHub = retailer.hub.toLowerCase().includes(query);
        const matchesTerminal = retailer.terminal.toLowerCase().includes(query);
        const matchesGate = retailer.gate ? retailer.gate.toLowerCase().includes(query) : false;
        const matchesDesc = retailer.description.toLowerCase().includes(query);
        const matchesPerks = retailer.perks && retailer.perks.some((p) => p.toLowerCase().includes(query));

        if (!matchesName && !matchesCategory && !matchesHub && !matchesTerminal && !matchesGate && !matchesDesc && !matchesPerks) {
          return false;
        }
      }

      // Category match
      if (selectedCategory !== 'All' && retailer.category !== selectedCategory) {
        return false;
      }

      // Hub match
      if (selectedHub !== 'All Hubs' && retailer.hub !== selectedHub) {
        return false;
      }

      // Rating match
      if (minRating > 0 && Number(retailer.rating) < minRating) {
        return false;
      }

      // Status match
      if (statusFilter !== 'All') {
        if (statusFilter === 'Featured' && !(retailer.status === 'Featured' || retailer.isVip)) {
          return false;
        }
        if (statusFilter === 'Active' && retailer.status !== 'Active') {
          return false;
        }
        if (statusFilter === 'Under Review' && retailer.status !== 'Under Review') {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating-desc') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'reviews-desc') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'commission-desc') return (b.commissionRate || 0) - (a.commissionRate || 0);
      return 0;
    });
  }, [retailers, searchQuery, selectedCategory, selectedHub, minRating, statusFilter, sortBy]);

  const isFilterEmpty = retailers.length > 0 && filteredRetailers.length === 0;

  return (
    <div className="app-layout">
      {/* Expedia-style Structured Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onResetDemo={handleResetDemo}
        totalRetailers={retailers.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="main-viewport">
        {/* Hubs Tab View */}
        {activeTab === 'hubs' && (
          <HubsView
            retailers={retailers}
            onSelectHub={handleSelectHubFromView}
          />
        )}

        {/* Performance Tab View */}
        {activeTab === 'performance' && (
          <PerformanceView
            retailers={retailers}
            onSelectRetailer={handleViewDetails}
          />
        )}

        {/* Retailers Directory Tab */}
        {activeTab === 'retailers' && (
          <div className="directory-content">
            {/* Quick Metrics KPI Bar */}
            <StatsBar retailers={retailers} />

            {/* Prominent Expedia Search & Airbnb Filter Strip */}
            <SearchFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedHub={selectedHub}
              setSelectedHub={setSelectedHub}
              minRating={minRating}
              setMinRating={setMinRating}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalResults={filteredRetailers.length}
              onResetFilters={handleResetFilters}
            />

            {/* Content Display: Loading Skeletons, Empty State, or Listings */}
            {isLoading ? (
              <SkeletonLoader viewMode={viewMode} />
            ) : filteredRetailers.length === 0 ? (
              <EmptyState
                isFilterEmpty={isFilterEmpty}
                onResetFilters={handleResetFilters}
                onOpenAddModal={handleOpenAddModal}
                onResetDemo={handleResetDemo}
              />
            ) : viewMode === 'grid' ? (
              <div className="retailers-grid">
                {filteredRetailers.map((retailer) => (
                  <RetailerCard
                    key={retailer.id}
                    retailer={retailer}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <RetailerTable
                retailers={filteredRetailers}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Retailer Modal */}
      <RetailerModal
        key={retailerToEdit ? retailerToEdit.id : 'create-new'}
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setRetailerToEdit(null);
        }}
        onSave={handleSaveRetailer}
        retailerToEdit={retailerToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRetailerToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        retailer={retailerToDelete}
      />

      {/* Detail View Modal */}
      <RetailerDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setRetailerToView(null);
        }}
        retailer={retailerToView}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Clean Light Footer */}
      <Footer onResetDemo={handleResetDemo} />
    </div>
  );
}

export default App;
