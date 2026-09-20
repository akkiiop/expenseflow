import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import incomeService from '../services/incomeService';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function Income() {
  const { addToast } = useToast();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    amount: '',
    source: '',
    description: '',
    incomeDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadIncomes();
  }, [page]);

  const loadIncomes = async () => {
    setLoading(true);
    try {
      const data = await incomeService.getMyIncomes(page, 10);
      setIncomes(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      addToast('Failed to load income', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingIncome(null);
    setForm({
      amount: '',
      source: '',
      description: '',
      incomeDate: new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const openEditModal = (inc) => {
    setEditingIncome(inc);
    setForm({
      amount: String(inc.amount),
      source: inc.source || '',
      description: inc.description || '',
      incomeDate: inc.incomeDate || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.amount || !form.source || !form.incomeDate) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      amount: parseFloat(form.amount),
      source: form.source,
      description: form.description,
      incomeDate: form.incomeDate,
    };

    setSaving(true);
    try {
      if (editingIncome) {
        await incomeService.updateIncome(editingIncome.id, payload);
        addToast('Income updated successfully', 'success');
      } else {
        await incomeService.createIncome(payload);
        addToast('Income added successfully', 'success');
      }
      setModalOpen(false);
      loadIncomes();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save income';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await incomeService.deleteIncome(deleteTarget.id);
      addToast('Income deleted successfully', 'success');
      setDeleteTarget(null);
      loadIncomes();
    } catch {
      addToast('Failed to delete income', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Income</h1>
          <p className="page-subtitle">Track your revenue and income streams</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Income</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : incomes.length > 0 ? (
        <>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{inc.source}</td>
                    <td>{inc.description || '—'}</td>
                    <td>{formatDate(inc.incomeDate)}</td>
                    <td className="amount-positive">+{formatCurrency(inc.amount)}</td>
                    <td>
                      <div className="category-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon"
                          onClick={() => openEditModal(inc)}
                          title="Edit income"
                          aria-label="Edit income"
                        >
                          <Pencil size={14} strokeWidth={2} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => setDeleteTarget(inc)}
                          title="Delete income"
                          aria-label="Delete income"
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
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <TrendingUp size={24} strokeWidth={2} />
          </div>
          <h3>No income recorded</h3>
          <p>Add your primary income sources to balance against expenses</p>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={openAddModal}>
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Your First Income</span>
          </button>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIncome ? 'Edit Income' : 'Add Income'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingIncome ? 'Update Income' : 'Add Income'}
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
          <label className="form-label">Source *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Salary, Freelance, Investment"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="Additional details"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date *</label>
          <input
            type="date"
            className="form-input"
            value={form.incomeDate}
            onChange={(e) => setForm({ ...form, incomeDate: e.target.value })}
          />
        </div>
      </Modal>

      {/* Custom In-App Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Income Entry"
        message={`Are you sure you want to delete the income of ₹${Number(deleteTarget?.amount || 0).toLocaleString('en-IN')} from "${deleteTarget?.source || 'this source'}"? This action cannot be undone.`}
        confirmText="Delete Income"
      />
    </div>
  );
}
