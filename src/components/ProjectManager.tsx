import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, Loader2, FolderOpen } from 'lucide-react';
import './ProjectManager.css'; // Add this import

interface Project {
  id: string;
  title: string;
  description: string;
  price?: string;
  image_url: string;
  category: string;
  link: string;
}

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    link: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const response = await api.post('/upload', data);
      setFormData({ ...formData, image_url: response.data.url });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      fetchProjects();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', description: '', price: '', image_url: '', category: '', link: '' });
    } catch (err) {
      console.error('Failed to save project', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project', err);
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
    <div className="project-manager">
      <div className="projects-header">
        <h2 className="header-title">Projects</h2>
        <button
          onClick={() => { 
            setIsAdding(true); 
            setEditingId(null); 
            setFormData({ title: '', description: '', price: '', image_url: '', category: '', link: '' }); 
          }}
          className="add-button"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {isAdding && (
        <div className="form-container">
          <h3 className="form-title">
            <FolderOpen size={20} />
            {editingId ? 'Edit Project' : 'New Project'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  required
                  placeholder="Describe the project..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (Optional)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="form-input"
                  placeholder="e.g., $5,000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                  required
                  placeholder="e.g., Web Development"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">External Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  className="form-input"
                  placeholder="https://example.com/project"
                />
              </div>

              <div className="image-upload-section">
                <label className="form-label">Project Image</label>
                <div className="image-preview-container">
                  <div className="image-preview">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" />
                    ) : (
                      <ImageIcon className="image-preview-icon" size={40} />
                    )}
                  </div>
                  <div className="upload-controls">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="file-input"
                      id="project-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="project-image"
                      className={`upload-button ${uploading ? 'uploading' : ''}`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="loading-spinner" size={16} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={16} />
                          Choose Image
                        </>
                      )}
                    </label>
                    <p className="upload-hint">
                      Recommended: 1200x800px, JPG or PNG
                    </p>
                  </div>
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
                  disabled={uploading || saving}
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Project' : 'Save Project')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FolderOpen size={40} />
            </div>
            <h3 className="empty-state-title">No Projects Yet</h3>
            <p className="empty-state-text">
              Click the "Add Project" button to create your first project.
            </p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="card-image-container">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="card-image"
                />
                <div className="image-overlay" />
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(project)}
                    className="action-button edit"
                    title="Edit project"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="action-button delete"
                    title="Delete project"
                    disabled={deletingId === project.id}
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="card-content">
                <span className="card-category">{project.category}</span>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">{project.description}</p>
                
                <div className="card-footer">
                  <span className={`card-price ${!project.price ? 'contact' : ''}`}>
                    {project.price || 'Contact for price'}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;