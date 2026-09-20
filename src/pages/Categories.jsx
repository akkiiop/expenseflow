import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import categoryService from '../services/categoryService';

const CATEGORY_COLORS = [
  '#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
];

export default function Categories() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getMyCategories();
      setCategories(data);
    } catch {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryName.trim());
        addToast('Category updated successfully', 'success');
      } else {
        await categoryService.createCategory(categoryName.trim());
        addToast('Category created successfully', 'success');
      }
      setModalOpen(false);
      loadCategories();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save category';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.deleteCategory(deleteTarget.id);
      addToast('Category deleted successfully', 'success');
      setDeleteTarget(null);
      loadCategories();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete category';
      addToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize and classify your expenses</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Category</span>
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="category-grid stagger-children">
          {categories.map((cat, i) => (
            <div key={cat.id} className="category-card">
              <div className="category-info">
                <div
                  className="category-dot"
                  style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                ></div>
                <span className="category-name">{cat.name}</span>
              </div>
              <div className="category-actions">
                <button
                  className="btn-icon"
                  onClick={() => openEditModal(cat)}
                  title="Edit category"
                  aria-label="Edit category"
                >
                  <Pencil size={14} strokeWidth={2} />
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => setDeleteTarget(cat)}
                  title="Delete category"
                  aria-label="Delete category"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Tags size={24} strokeWidth={2} />
          </div>
          <h3>No categories yet</h3>
          <p>Create categories like Food, Travel, Shopping to organize your expenses</p>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={openAddModal}>
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Your First Category</span>
          </button>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label" htmlFor="category-name">
            Category Name *
          </label>
          <input
            id="category-name"
            type="text"
            className="form-input"
            placeholder="e.g. Food, Travel, Utilities"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
      </Modal>

      {/* Custom In-App Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name || 'this category'}"? Any expenses tied to this category may be affected.`}
        confirmText="Delete Category"
      />
    </div>
  );
}
