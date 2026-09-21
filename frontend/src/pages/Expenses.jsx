import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Receipt, Tags } from 'lucide-react';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import expenseService from '../services/expenseService';
import categoryService from '../services/categoryService';
import { getCategoryColor, getCategoryBadgeStyle } from '../utils/categoryColors';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'NetBanking', 'Other'];

export default function Expenses() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [noCategoryModalOpen, setNoCategoryModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    amount: '',
    description: '',
    paymentMethod: 'UPI',
    expenseDate: new Date().toISOString().split('T')[0],
    categoryId: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [page, filterCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getMyCategories();
      setCategories(data);
    } catch {
      // silent
    }
  };

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getMyExpenses(
        page,
        10,
        filterCategory || null
      );
      setExpenses(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      addToast('Failed to load expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    if (categories.length === 0) {
      setNoCategoryModalOpen(true);
      return;
    }
    setEditingExpense(null);
    setForm({
      amount: '',
      description: '',
      paymentMethod: 'UPI',
      expenseDate: new Date().toISOString().split('T')[0],
      categoryId: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    const cat = categories.find((c) => c.name === exp.categoryName);
    setForm({
      amount: String(exp.amount),
      description: exp.description || '',
      paymentMethod: exp.paymentMethod || 'UPI',
      expenseDate: exp.expenseDate || '',
      categoryId: cat ? String(cat.id) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.amount || !form.categoryId || !form.expenseDate || !form.paymentMethod) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      amount: parseFloat(form.amount),
      description: form.description,
      paymentMethod: form.paymentMethod,
      expenseDate: form.expenseDate,
      categoryId: parseInt(form.categoryId),
    };

    setSaving(true);
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, payload);
        addToast('Expense updated successfully', 'success');
      } else {
        await expenseService.createExpense(payload);
        addToast('Expense added successfully', 'success');
      }
      setModalOpen(false);
      loadExpenses();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save expense';
      if (error.response?.data?.error === 'Budget Exceeded') {
        addToast(msg, 'warning');
      } else {
        addToast(msg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expenseService.deleteExpense(deleteTarget.id);
      addToast('Expense deleted successfully', 'success');
      setDeleteTarget(null);
      loadExpenses();
    } catch {
      addToast('Failed to delete expense', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track and manage your daily spending</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <select
          className="form-select"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(0);
          }}
          aria-label="Filter expenses by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : expenses.length > 0 ? (
        <>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.description || '—'}</td>
                    <td>
                      {(() => {
                        const color = getCategoryColor(exp.categoryId, exp.categoryName, categories);
                        return (
                          <span className="badge" style={getCategoryBadgeStyle(color)}>
                            <span className="badge-dot" style={{ backgroundColor: color }} />
                            {exp.categoryName || 'Uncategorized'}
                          </span>
                        );
                      })()}
                    </td>
                    <td>{formatDate(exp.expenseDate)}</td>
                    <td>{exp.paymentMethod}</td>
                    <td className="amount-negative">-{formatCurrency(exp.amount)}</td>
                    <td>
                      <div className="category-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon"
                          onClick={() => openEditModal(exp)}
                          title="Edit expense"
                          aria-label="Edit expense"
                        >
                          <Pencil size={14} strokeWidth={2} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => setDeleteTarget(exp)}
                          title="Delete expense"
                          aria-label="Delete expense"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Tags size={24} strokeWidth={2} />
          </div>
          <h3>No categories yet</h3>
          <p>Create a category before recording your first expense.</p>
          <Link to="/categories" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Category</span>
          </Link>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Receipt size={24} strokeWidth={2} />
          </div>
          <h3>No expenses yet</h3>
          <p>
            {filterCategory
              ? 'Try selecting a different category filter'
              : 'Create a category and record your first expense.'}
          </p>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={openAddModal}>
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Expense</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Amount *</label>
          <input
            type="number"
            className="form-input"
            placeholder="₹ 0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            min="0"
            step="0.01"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="What did you spend on?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method *</label>
          <select
            className="form-select"
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date *</label>
          <input
            type="date"
            className="form-input"
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
          />
        </div>
      </Modal>

      {/* Category Prerequisite Modal */}
      <Modal
        isOpen={noCategoryModalOpen}
        onClose={() => setNoCategoryModalOpen(false)}
        title="Category Required First"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setNoCategoryModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setNoCategoryModalOpen(false);
                navigate('/categories');
              }}
            >
              Go to Categories
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Tags size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              No Categories Created Yet
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              In ExpenseFlow, every expense must be assigned to a category (e.g., Food, Travel, Rent, Bills). Please create at least one category before logging your expenses.
            </p>
          </div>
        </div>
      </Modal>

      {/* In-App Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Expense"
        message={`Are you sure you want to delete the expense "${deleteTarget?.description || deleteTarget?.categoryName || 'this item'}" of ₹${Number(deleteTarget?.amount || 0).toLocaleString('en-IN')}? This action cannot be undone.`}
        confirmText="Delete Expense"
      />
    </div>
  );
}
