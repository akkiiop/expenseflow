import { useState, useEffect } from 'react';
import { TrendingUp, Receipt, Wallet, BarChart3 } from 'lucide-react';
import { useToast } from '../components/Toast';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import reportService from '../services/reportService';
import dashboardService from '../services/dashboardService';
import expenseService from '../services/expenseService';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
};

const BAR_COLORS = [
  '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316'
];

export default function Reports() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allTimeSummary, setAllTimeSummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [categorySpending, setCategorySpending] = useState([]);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    loadAllTimeData();
  }, []);

  useEffect(() => {
    loadMonthlyData();
  }, [selectedMonth, selectedYear]);

  const loadAllTimeData = async () => {
    try {
      const data = await reportService.getSummary();
      setAllTimeSummary(data);
    } catch {
      addToast('Failed to load reports', 'error');
    }
  };

  const loadMonthlyData = async () => {
    setLoading(true);
    try {
      const [monthly, expenses] = await Promise.all([
        dashboardService.getSummary(selectedMonth, selectedYear),
        expenseService.getMyExpenses(0, 1000),
      ]);
      setMonthlySummary(monthly);

      // Group expenses by category for the selected month
      const catMap = {};
      (expenses.content || []).forEach((exp) => {
        if (!exp.expenseDate) return;
        const d = new Date(exp.expenseDate);
        if (d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear) {
          const cat = exp.categoryName || 'Other';
          catMap[cat] = (catMap[cat] || 0) + Number(exp.amount);
        }
      });

      const sorted = Object.entries(catMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);

      setCategorySpending(sorted);
    } catch {
      addToast('Failed to load monthly data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const maxSpending = categorySpending.length > 0
    ? Math.max(...categorySpending.map((c) => c.amount))
    : 1;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Reports</h1>
          <p className="page-subtitle">Analyze your historical income and spending patterns</p>
        </div>
      </div>

      {/* All-time Summary */}
      {allTimeSummary && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            All-Time Summary
          </h2>
          <div className="summary-cards stagger-children">
            <SummaryCard
              icon={TrendingUp}
              label="Total Income"
              value={formatCurrency(allTimeSummary.totalIncome)}
              subtitle="All time cumulative"
              variant="income"
            />
            <SummaryCard
              icon={Receipt}
              label="Total Expenses"
              value={formatCurrency(allTimeSummary.totalExpenses)}
              subtitle="All time cumulative"
              variant="expense"
            />
            <SummaryCard
              icon={Wallet}
              label="Net Balance"
              value={formatCurrency(allTimeSummary.remainingBalance)}
              subtitle="All time cumulative"
              variant="balance"
            />
          </div>
        </div>
      )}

      {/* Monthly Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">Monthly Breakdown</h2>
        </div>
        <div className="filter-bar">
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            aria-label="Select report month"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {getMonthName(i + 1)}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="form-input report-year-input"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            min="2020"
            max="2030"
            aria-label="Select report year"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Monthly Summary */}
          {monthlySummary && (
            <div className="summary-cards stagger-children" style={{ marginBottom: '2.5rem' }}>
              <SummaryCard
                icon={TrendingUp}
                label="Income"
                value={formatCurrency(monthlySummary.totalIncome)}
                subtitle={`${getMonthName(selectedMonth)} ${selectedYear}`}
                variant="income"
              />
              <SummaryCard
                icon={Receipt}
                label="Expenses"
                value={formatCurrency(monthlySummary.totalExpenses)}
                subtitle={`${getMonthName(selectedMonth)} ${selectedYear}`}
                variant="expense"
              />
              <SummaryCard
                icon={Wallet}
                label="Balance"
                value={formatCurrency(monthlySummary.remainingBalance)}
                subtitle={`${getMonthName(selectedMonth)} ${selectedYear}`}
                variant="balance"
              />
            </div>
          )}

          {/* Category Spending Breakdown */}
          <div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Expense Distribution — {getMonthName(selectedMonth)} {selectedYear}
            </h2>
            {categorySpending.length > 0 ? (
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="bar-chart">
                  {categorySpending.map((cat, i) => (
                    <div key={cat.name} className="bar-item">
                      <span className="bar-label">{cat.name}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${Math.max((cat.amount / maxSpending) * 100, 4)}%`,
                            backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
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
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <BarChart3 size={24} strokeWidth={2} />
                </div>
                <h3>No expenses for this period</h3>
                <p>Try selecting a different month or year</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
