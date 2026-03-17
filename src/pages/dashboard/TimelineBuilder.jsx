import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { timelineService } from '../../services/timelineService';
import { FUNCTIONS } from '../../utils/constants/weddingConstants';

const TimelineBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    function: 'wedding',
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    venue: '',
    notes: ''
  });

  useEffect(() => {
    fetchTimeline();
  }, [id]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const data = await timelineService.getTimeline(id);
      setTimeline(data);
    } catch (error) {
      toast.error('Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      if (editingItem) {
        await timelineService.updateItem(id, editingItem._id, formData);
        toast.success('Timeline item updated');
      } else {
        await timelineService.addItem(id, formData);
        toast.success('Timeline item added');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        function: 'wedding',
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        venue: '',
        notes: ''
      });
      fetchTimeline();
    } catch (error) {
      toast.error(editingItem ? 'Failed to update item' : 'Failed to add item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      function: item.function,
      name: item.name,
      description: item.description || '',
      startTime: item.startTime ? new Date(item.startTime).toISOString().slice(0, 16) : '',
      endTime: item.endTime ? new Date(item.endTime).toISOString().slice(0, 16) : '',
      venue: item.venue || '',
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this timeline item?')) {
      try {
        await timelineService.deleteItem(id, itemId);
        toast.success('Timeline item deleted');
        fetchTimeline();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const getFunctionIcon = (func) => {
    const icons = {
      mehendi: '🌿',
      sangeet: '🎵',
      wedding: '💒',
      reception: '🥂',
      haldi: '🟡',
      cocktail: '🍸',
      other: '📌'
    };
    return icons[func] || '📅';
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/dashboard/wedding/${id}`)}
              className="p-2 hover:bg-saffron-100 rounded-lg transition"
            >
              ← Back
            </button>
            <h1 className="font-heading text-3xl text-saffron-600">Wedding Timeline</h1>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                function: 'wedding',
                name: '',
                description: '',
                startTime: '',
                endTime: '',
                venue: '',
                notes: ''
              });
              setShowForm(true);
            }}
            className="btn-primary"
          >
            + Add Event
          </button>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeline?.items?.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getFunctionIcon(item.function)}</span>
                  <h3 className="font-heading text-lg text-saffron-600">{item.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                  }`}>
                  {item.status || 'planned'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{item.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅</span>
                  <span>{formatDate(item.startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">⏰</span>
                  <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                </div>
                {item.venue && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span>{item.venue}</span>
                  </div>
                )}
              </div>

              {/* Checklist */}
              {item.checklist?.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">Checklist:</p>
                  {item.checklist.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={task.completed} readOnly className="rounded" />
                      <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.task}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                <button
                  onClick={() => handleEditItem(item)}
                  className="text-sm text-saffron-600 hover:text-saffron-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-sm text-indian-red-500 hover:text-indian-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {(!timeline?.items || timeline.items.length === 0) && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl">
              <span className="text-6xl mb-4 block">📅</span>
              <p className="text-gray-500 text-lg mb-2">No timeline events yet</p>
              <p className="text-gray-400 mb-4">Add your first wedding event</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add Event
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="font-heading text-2xl text-saffron-600 mb-4">
                  {editingItem ? 'Edit Event' : 'Add New Event'}
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }} className="space-y-4">
                  {/* Function Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Function Type</label>
                    <select
                      value={formData.function}
                      onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                      className="input-field"
                      required
                    >
                      {FUNCTIONS.map(f => (
                        <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                      ))}
                      <option value="other">📌 Other</option>
                    </select>
                  </div>

                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field"
                      rows="2"
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  {/* Venue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Main Lawn, Ballroom"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-field"
                      rows="2"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingItem ? 'Update Event' : 'Add Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineBuilder;