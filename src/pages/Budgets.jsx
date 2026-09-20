import { useState, useEffect } from 'react';
import { Plus, Target } from 'lucide-react';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import BudgetProgress from '../components/BudgetProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import expenseService from '../services/expenseService';

const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
};

export default function Budgets() {
  const { addToast } = useToast();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spending, setSpending] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [form, setForm] = useState({
    amount: '',
    month: String(currentMonth),
    year: String(currentYear),
    categoryId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [budgetData, catData, expenseData] = await Promise.all([
        budgetService.getMyBudgets(),
        categoryService.getMyCategories(),
        expenseService.getMyExpenses(0, 1000),
      ]);

      setBudgets(budgetData);
      setCategories(catData);

      // Compute spending per category per month
      const spendMap = {};
      (expenseData.content || []).forEach((exp) => {
        if (!exp.expenseDate) return;
        const d = new Date(exp.expenseDate);
        const key = `${exp.categoryName}-${d.getMonth() + 1}-${d.getFullYear()}`;
        spendMap[key] = (spendMap[key] || 0) + Number(exp.amount);
      });
      setSpending(spendMap);
    } catch {
      addToast('Failed to load budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setForm({
      amount: '',
      month: String(currentMonth),
      year: String(currentYear),
      categoryId: categories.length > 0 ? String(categories[0].id) : '',
    });
    setModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    const cat = categories.find((c) => c.name === budget.categoryName);
    setForm({
      amount: String(budget.amount),
      month: String(budget.month),
      year: String(budget.year),
      categoryId: cat ? String(cat.id) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.amount || !form.categoryId || !form.month || !form.year) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      amount: parseFloat(form.amount),
      month: parseInt(form.month),
      year: parseInt(form.year),
      categoryId: parseInt(form.categoryId),
    };

    setSaving(true);
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, payload);
        addToast('Budget updated successfully', 'success');
      } else {
        await budgetService.createBudget(payload);
        addToast('Budget created successfully', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save budget';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await budgetService.deleteBudget(deleteTarget.id);
      addToast('Budget deleted successfully', 'success');
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast('Failed to delete budget', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Group budgets by month/year
  const groupedBudgets = {};
  budgets.forEach((b) => {
    const key = `${b.month}-${b.year}`;
    if (!groupedBudgets[key]) groupedBudgets[key] = [];
    groupedBudgets[key].push(b);
  });

  // Sort groups, current month first
  const sortedKeys = Object.keys(groupedBudgets).sort((a, b) => {
    const [am, ay] = a.split('-').map(Number);
    const [bm, by] = b.split('-').map(Number);
    return by - ay || bm - am;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Set and track category spending limits</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Set Budget</span>
        </button>
      </div>

      {sortedKeys.length > 0 ? (
        sortedKeys.map((key) => {
          const [m, y] = key.split('-').map(Number);
          return (
            <div key={key} style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>
                {getMonthName(m)} {y}
                {m === currentMonth && y === currentYear && (
                  <span className="badge badge-income" style={{ marginLeft: '0.75rem' }}>
                    Current Month
                  </span>
                )}
              </h2>
              <div className="budget-grid stagger-children">
                {groupedBudgets[key].map((budget) => {
                  const spendKey = `${budget.categoryName}-${budget.month}-${budget.year}`;
                  return (
                    <BudgetProgress
                      key={budget.id}
                      categoryName={budget.categoryName}
                      budgetAmount={budget.amount}
                      spentAmount={spending[spendKey] || 0}
                      onEdit={() => openEditModal(budget)}
                      onDelete={() => setDeleteTarget(budget)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Target size={24} strokeWidth={2} />
          </div>
          <h3>No budgets set</h3>
          <p>Create monthly category budgets to monitor spending limits</p>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={openAddModal}>
            <Plus size={16} strokeWidth={2.5} />
            <span>Set Your First Budget</span>
          </button>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBudget ? 'Edit Budget' : 'Set Budget'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingBudget ? 'Update Budget' : 'Set Budget'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Budget Amount *</label>
          <input
            type="number"
            className="form-input"
            placeholder="₹ 0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            min="0"
            step="0.01"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Month *</label>
            <select
              className="form-select"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {getMonthName(i + 1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Year *</label>
            <input
              type="number"
              className="form-input"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              min="2020"
              max="2030"
            />
          </div>
        </div>
      </Modal>

      {/* Custom In-App Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Budget"
        message={`Are you sure you want to delete the ₹${Number(deleteTarget?.amount || 0).toLocaleString('en-IN')} budget for "${deleteTarget?.categoryName || 'this category'}" (${getMonthName(deleteTarget?.month)} ${deleteTarget?.year})?`}
        confirmText="Delete Budget"
      />
    </div>
  );
}
