import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { guestService } from '../../services/guestService';
import RSVPStats from '../../components/guest/RSVPStats';
import GuestTable from '../../components/guest/GuestTable';
import GuestForm from '../../components/guest/GuestForm';
import { generateCSVTemplate, parseCSVToGuests } from "../../utils/helpers/guestHelpers";

const GuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    rsvpStatus: 'all',
    category: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Mock weddingId - replace with actual from context
  const weddingId = 'test-wedding-123';

  useEffect(() => {
    fetchGuests();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      console.log('Fetching guests for weddingId:', weddingId); // Add this
      console.log('Filters:', filters); // Add this
      console.log('Pagination:', pagination.page); // Add this

      const data = await guestService.getGuests(weddingId, {
        ...filters,
        page: pagination.page,
        limit: 10
      });

      console.log('Data received from API:', data); // Add this
      console.log('Guests array:', data.guests); // Add this
      console.log('Total guests:', data.total); // Add this

      setGuests(data.guests);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
    } catch (error) {
      console.error('Error in fetchGuests:', error); // Add this
      toast.error('Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await guestService.getGuestStats(weddingId);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleAddGuest = () => {
    setSelectedGuest(null);
    setShowForm(true);
  };

  const handleEditGuest = (guest) => {
    setSelectedGuest(guest);
    setShowForm(true);
  };

  const handleDeleteGuest = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestService.deleteGuest(id);
        toast.success('Guest deleted successfully');
        fetchGuests();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete guest');
      }
    }
  };

  const handleSubmitGuest = async (data) => {
    try {
      if (selectedGuest) {
        await guestService.updateGuest(selectedGuest._id, { ...data, weddingId });
        toast.success('Guest updated successfully');
      } else {
        await guestService.createGuest({ ...data, weddingId });
        toast.success('Guest added successfully');
      }
      setShowForm(false);
      fetchGuests();
      fetchStats();
    } catch (error) {
      toast.error(selectedGuest ? 'Failed to update guest' : 'Failed to add guest');
    }
  };

  const handleBulkRSVP = async (status) => {
    if (selectedGuests.length === 0) {
      toast.error('Please select guests first');
      return;
    }

    try {
      await guestService.bulkUpdateRSVP(selectedGuests, status);
      toast.success(`RSVP status updated for ${selectedGuests.length} guests`);
      setSelectedGuests([]);
      fetchGuests();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update RSVP status');
    }
  };

  const handleExportTemplate = () => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-import-template.csv';
    a.click();
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const guests = parseCSVToGuests(e.target.result);
        await guestService.bulkImport(weddingId, guests);
        toast.success(`Successfully imported ${guests.length} guests`);
        fetchGuests();
        fetchStats();
      } catch (error) {
        toast.error('Failed to import guests');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="font-heading text-3xl text-saffron-600 mb-2">👥 Guest Management</h1>
          <div className="kantha-line w-32 mb-1"></div>
          <p className="text-gray-400 text-sm">Manage your wedding guests and track RSVPs</p>
        </div>

        {/* Stats Section */}
        {stats && <RSVPStats stats={stats} />}

        {/* Actions Bar */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddGuest}
                className="btn-primary flex items-center"
              >
                <span className="mr-2">+</span> Add Guest
              </button>

              <button
                onClick={handleExportTemplate}
                className="btn-outline flex items-center"
              >
                <span className="mr-2">📥</span> Download Template
              </button>

              <label className="btn-outline cursor-pointer flex items-center">
                <span className="mr-2">📤</span> Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label>
            </div>

            {selectedGuests.length > 0 && (
              <div className="flex gap-2">
                <select
                  onChange={(e) => handleBulkRSVP(e.target.value)}
                  className="input-field text-sm py-1"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Update RSVP</option>
                  <option value="confirmed">✅ Mark as Confirmed</option>
                  <option value="pending">⏳ Mark as Pending</option>
                  <option value="declined">❌ Mark as Declined</option>
                  <option value="maybe">🤔 Mark as Maybe</option>
                </select>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input
              type="text"
              placeholder="Search guests..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
            />

            <select
              value={filters.rsvpStatus}
              onChange={(e) => setFilters({ ...filters, rsvpStatus: e.target.value })}
              className="input-field"
            >
              <option value="all">All RSVP Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
              <option value="maybe">Maybe</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <option value="family">Family</option>
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Guest Table */}
        {loading ? (
          <div className="text-center py-16">
            <div className="diya-spinner mx-auto mb-5"></div>
            <p className="text-saffron-700 font-heading">Loading guests...</p>
          </div>
        ) : (
          <>
            <GuestTable
              guests={guests}
              onEdit={handleEditGuest}
              onDelete={handleDeleteGuest}
              selectedGuests={selectedGuests}
              onSelect={setSelectedGuests}
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex gap-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagination({ ...pagination, page: i + 1 })}
                      className={`px-4 py-2 rounded ${pagination.page === i + 1
                        ? 'bg-saffron-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-saffron-100'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}

        {/* Guest Form Modal */}
        {showForm && (
          <GuestForm
            guest={selectedGuest}
            onSubmit={handleSubmitGuest}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GuestManagement;