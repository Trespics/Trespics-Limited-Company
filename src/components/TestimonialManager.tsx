import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Loader2, Quote as QuoteIcon, MessageSquare } from 'lucide-react';
import './TestimonialManager.css'; // Add this import

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company?: string;
}

const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    quote: '',
    author: '',
    company: '',
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      fetchTestimonials();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ quote: '', author: '', company: '' });
    } catch (err) {
      console.error('Failed to save testimonial', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData(t);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to delete testimonial', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="testimonial-manager">
      <div className="testimonial-header">
        <h2 className="header-title">Testimonials</h2>
        <button
          onClick={() => { 
            setIsAdding(true); 
            setEditingId(null); 
            setFormData({ quote: '', author: '', company: '' }); 
          }}
          className="add-button"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {isAdding && (
        <div className="form-container">
          <h3 className="form-title">
            <MessageSquare size={20} />
            {editingId ? 'Edit Testimonial' : 'New Testimonial'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Quote</label>
              <textarea
                value={formData.quote}
                onChange={e => setFormData({ ...formData, quote: e.target.value })}
                className="form-textarea"
                rows={4}
                required
                placeholder="What did the client say? ..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="form-input"
                  required
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company (Optional)</label>
                <input
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="form-input"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={saving}
              >
                {saving ? <Loader2 className="animate-spin" size={16} style={{ marginRight: '8px' }} /> : null}
                {saving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Testimonial' : 'Save Testimonial')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="testimonials-grid">
        {testimonials.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <QuoteIcon size={40} />
            </div>
            <h3 className="empty-state-title">No Testimonials Yet</h3>
            <p className="empty-state-text">
              Click the "Add Testimonial" button to create your first testimonial.
            </p>
          </div>
        ) : (
          testimonials.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="card-actions">
                <button
                  onClick={() => handleEdit(t)}
                  className="action-button edit"
                  title="Edit testimonial"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="action-button delete"
                  title="Delete testimonial"
                  disabled={deletingId === t.id}
                >
                  {deletingId === t.id ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
              
              <QuoteIcon className="quote-icon" size={32} />
              
              <p className="testimonial-quote">"{t.quote}"</p>
              
              <div>
                <p className="testimonial-author">{t.author}</p>
                {t.company && (
                  <p className="testimonial-company">{t.company}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;