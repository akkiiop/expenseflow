import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Receipt,
  Wallet,
  Target,
  ArrowRight,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SummaryCard from '../components/SummaryCard';
import BudgetProgress from '../components/BudgetProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import dashboardService from '../services/dashboardService';
import expenseService from '../services/expenseService';
import incomeService from '../services/incomeService';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import { getCategoryColor, getCategoryBadgeStyle } from '../utils/categoryColors';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
};

const BAR_COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetSpending, setBudgetSpending] = useState({});
  const [categorySpending, setCategorySpending] = useState([]);
  const [categories, setCategories] = useState([]);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [summaryData, expenseData, incomeData, budgetData, allMonthExpenses, categoriesData] = await Promise.all([
        dashboardService.getSummary(currentMonth, currentYear),
        expenseService.getMyExpenses(0, 5),
        incomeService.getMyIncomes(0, 5),
        budgetService.getMyBudgets(),
        expenseService.getMyExpenses(0, 1000),
        categoryService.getMyCategories(),
      ]);

      setSummary(summaryData);
      setRecentExpenses(expenseData.content || []);
      setRecentIncomes(incomeData.content || []);
      setCategories(categoriesData || []);

      // Filter budgets to current month
      const currentBudgets = budgetData.filter(
        (b) => b.month === currentMonth && b.year === currentYear
      );
      setBudgets(currentBudgets);

      // Compute current month spending per category from expenses
      const spending = {};
      const catMap = {};

      (allMonthExpenses.content || []).forEach((exp) => {
        if (!exp.expenseDate) return;
        const d = new Date(exp.expenseDate);
        if (d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear) {
          const cat = exp.categoryName || 'Other';
          const amt = Number(exp.amount) || 0;
          spending[cat] = (spending[cat] || 0) + amt;
          catMap[cat] = (catMap[cat] || 0) + amt;
        }
      });

      setBudgetSpending(spending);

      const sortedCategories = Object.entries(catMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);

      setCategorySpending(sortedCategories);
    } catch (error) {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  const maxSpending = categorySpending.length > 0
    ? Math.max(...categorySpending.map((c) => c.amount))
    : 1;

  const hasCategories = categories.length > 0;
  const hasIncome = recentIncomes.length > 0 || Number(summary?.totalIncome) > 0;
  const hasExpenses = recentExpenses.length > 0 || Number(summary?.totalExpenses) > 0;
  const hasBudgets = budgets.length > 0;

  const setupItems = [
    { label: 'Create categories', completed: hasCategories, to: '/categories', desc: 'Organize your spending' },
    { label: 'Add income', completed: hasIncome, to: '/income', desc: 'Set your starting balance' },
    { label: 'Add your first expense', completed: hasExpenses, to: '/expenses', desc: 'Log daily purchases' },
    { label: 'Create a budget', completed: hasBudgets, to: '/budgets', desc: 'Track spending limits', optional: true },
  ];

  const completedCount = setupItems.filter((i) => i.completed).length;
  const nextIncomplete = setupItems.find((i) => !i.completed) || setupItems[0];
  const showSetupCard = !(hasCategories && hasIncome && hasExpenses);

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="dashboard-greeting-row">
        <div>
          <h1 className="page-greeting">
            {getGreeting()}, {user?.name || 'there'} 👋
          </h1>
          <p className="page-greeting-sub">
            Here's your financial overview for {getMonthName(currentMonth)} {currentYear}
          </p>
        </div>
      </div>

      {/* Smart Dashboard Setup Card */}
      {showSetupCard && (
        <div className="dashboard-setup-card">
          <div className="setup-card-header">
            <div className="setup-card-title-box">
              <span className="section-badge" style={{ margin: 0 }}>GET STARTED</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Initial Setup Checklist
              </h3>
            </div>
            <div className="setup-progress-badge">
              <span className="setup-progress-text">{completedCount} of 4 completed</span>
              <div className="setup-progress-bar-track">
                <div
                  className="setup-progress-bar-fill"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="setup-checklist-grid">
            {setupItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`setup-check-item ${item.completed ? 'completed' : 'pending'}`}
              >
                <div className="setup-check-indicator">
                  {item.completed ? (
                    <CheckCircle2 size={18} className="text-income" />
                  ) : (
                    <Circle size={18} className="text-muted" />
                  )}
                </div>
                <div className="setup-check-info">
                  <div className="setup-check-label">
                    <span>{item.label}</span>
                    {item.optional && <span className="optional-tag">Optional</span>}
                  </div>
                  <span className="setup-check-desc">{item.desc}</span>
                </div>
                <ArrowRight size={14} className="setup-check-arrow" />
              </Link>
            ))}
          </div>

          <div className="setup-card-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.875rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Link to={nextIncomplete.to} className="btn btn-primary btn-sm">
              <span>Continue Setup</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Summary Cards with Lucide Icons */}
      <div className="summary-cards stagger-children">
        <SummaryCard
          icon={TrendingUp}
          label="Total Income"
          value={formatCurrency(summary?.totalIncome)}
          subtitle="This month"
          variant="income"
        />
        <SummaryCard
          icon={Receipt}
          label="Total Expenses"
          value={formatCurrency(summary?.totalExpenses)}
          subtitle="This month"
          variant="expense"
        />
        <SummaryCard
          icon={Wallet}
          label="Remaining Balance"
          value={formatCurrency(summary?.remainingBalance)}
          subtitle="Available balance"
          variant="balance"
        />
        {budgets.length > 0 && (
          <SummaryCard
            icon={Target}
            label="Active Budgets"
            value={budgets.length}
            subtitle={`For ${getMonthName(currentMonth)}`}
            variant="budget"
          />
        )}
      </div>

      {/* Category Spending Breakdown (Simple Visualization using loaded expenses) */}
      {categorySpending.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div className="section-header">
            <h2 className="section-title">Spending by Category</h2>
            <Link to="/reports" className="btn btn-ghost btn-sm">
              <span>View Full Report</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
            <div className="bar-chart">
              {categorySpending.slice(0, 4).map((cat, i) => (
                <div key={cat.name} className="bar-item">
                  <span className="bar-label">{cat.name}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max((cat.amount / maxSpending) * 100, 4)}%`,
                        backgroundColor: getCategoryColor(null, cat.name, categories),
                      }}
                    >
                      {cat.amount / maxSpending > 0.25 ? formatCurrency(cat.amount) : ''}
                    </div>
                  </div>
                  <span className="bar-value">{formatCurrency(cat.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Status */}
      {budgets.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div className="section-header">
            <h2 className="section-title">Budget Status</h2>
            <Link to="/budgets" className="btn btn-ghost btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="budget-grid stagger-children">
            {budgets.slice(0, 4).map((budget) => (
              <BudgetProgress
                key={budget.id}
                categoryName={budget.categoryName}
                budgetAmount={budget.amount}
                spentAmount={budgetSpending[budget.categoryName] || 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="dashboard-transactions-grid">
        {/* Recent Expenses */}
        <div>
          <div className="section-header">
            <h2 className="section-title">Recent Expenses</h2>
            <Link to="/expenses" className="btn btn-ghost btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="data-table-container">
            {recentExpenses.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((exp) => {
                    const color = getCategoryColor(exp.categoryId, exp.categoryName, categories);
                    return (
                      <tr key={exp.id}>
                        <td>{exp.description || '—'}</td>
                        <td>
                          <span className="badge" style={getCategoryBadgeStyle(color)}>
                            <span className="badge-dot" style={{ backgroundColor: color }} />
                            {exp.categoryName || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="amount-negative">-{formatCurrency(exp.amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Receipt size={24} strokeWidth={2} />
                </div>
                <h3>No expenses yet</h3>
                <p>Start tracking your daily spending</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Income */}
        <div>
          <div className="section-header">
            <h2 className="section-title">Recent Income</h2>
            <Link to="/income" className="btn btn-ghost btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="data-table-container">
            {recentIncomes.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncomes.map((inc) => (
                    <tr key={inc.id}>
                      <td style={{ fontWeight: 500 }}>{inc.source}</td>
                      <td>{inc.description || '—'}</td>
                      <td className="amount-positive">+{formatCurrency(inc.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <TrendingUp size={24} strokeWidth={2} />
                </div>
                <h3>No income recorded</h3>
                <p>Add your primary income sources</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-quick-actions">
        <Link to="/expenses" className="btn btn-primary">
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Expense</span>
        </Link>
        <Link to="/income" className="btn btn-secondary">
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Income</span>
        </Link>
        <Link
          to="/ai-insights"
          className="btn btn-ghost"
          style={{ background: 'var(--ai-glow)', color: 'var(--ai-accent)' }}
        >
          <Sparkles size={16} strokeWidth={2} />
          <span>Get AI Insights</span>
        </Link>
      </div>
    </div>
  );
}
