import { useState, useEffect } from 'react';
import { TrendingUp, Receipt, Wallet, BarChart3, PieChart, TrendingDown } from 'lucide-react';
import { useToast } from '../components/Toast';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import reportService from '../services/reportService';
import dashboardService from '../services/dashboardService';
import expenseService from '../services/expenseService';
import incomeService from '../services/incomeService';
import categoryService from '../services/categoryService';
import { CATEGORY_COLORS, getCategoryColor } from '../utils/categoryColors';

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

const getShortMonthName = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || '';
};

/* ── SVG Donut Chart ── */
function DonutChart({ data, size = 220, strokeWidth = 32 }) {
  if (!data || data.length === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  let cumulativePercent = 0;

  return (
    <div className="donut-chart-wrapper">
      <svg viewBox={`0 0 ${size} ${size}`} className="donut-chart-svg">
        <g transform={`rotate(-90 ${center} ${center})`}>
          {data.map((item, i) => {
            const percent = total > 0 ? item.amount / total : 0;
            const dashLength = circumference * percent;
            const dashOffset = circumference * (1 - cumulativePercent) + circumference * 0.25;
            cumulativePercent += percent;

            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={item.color || CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                className="donut-segment"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            );
          })}
        </g>
        {/* Center text */}
        <text x={center} y={center - 7} textAnchor="middle" dominantBaseline="middle" className="donut-center-label">
          Total
        </text>
        <text x={center} y={center + 14} textAnchor="middle" dominantBaseline="middle" className="donut-center-value">
          {formatCurrency(total)}
        </text>
      </svg>
      {/* Legend */}
      <div className="donut-legend">
        {data.map((item, i) => (
          <div key={item.name} className="donut-legend-item">
            <span
              className="donut-legend-dot"
              style={{ background: item.color || CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
            />
            <span className="donut-legend-label">{item.name}</span>
            <span className="donut-legend-value">{formatCurrency(item.amount)}</span>
            <span className="donut-legend-percent">
              {total > 0 ? Math.round((item.amount / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SVG Line Chart ── */
function LineChart({ incomeData, expenseData, labels, height = 220 }) {
  const width = 100; // percentage-based via viewBox
  const viewBoxWidth = 500;
  const viewBoxHeight = height;
  const paddingX = 40;
  const paddingY = 30;
  const paddingBottom = 40;
  const chartWidth = viewBoxWidth - paddingX * 2;
  const chartHeight = viewBoxHeight - paddingY - paddingBottom;

  const allValues = [...incomeData, ...expenseData];
  const maxVal = allValues.length > 0 ? Math.max(...allValues, 1) : 1;

  const getX = (i) => paddingX + (i / Math.max(labels.length - 1, 1)) * chartWidth;
  const getY = (val) => paddingY + chartHeight - (val / maxVal) * chartHeight;

  const buildPath = (data) => {
    if (data.length === 0) return '';
    return data
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(val).toFixed(1)}`)
      .join(' ');
  };

  const buildAreaPath = (data) => {
    if (data.length === 0) return '';
    const linePath = data
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(val).toFixed(1)}`)
      .join(' ');
    return `${linePath} L ${getX(data.length - 1).toFixed(1)} ${(paddingY + chartHeight).toFixed(1)} L ${getX(0).toFixed(1)} ${(paddingY + chartHeight).toFixed(1)} Z`;
  };

  // Grid lines
  const gridLines = 4;
  const gridVals = Array.from({ length: gridLines + 1 }, (_, i) => (maxVal / gridLines) * i);

  return (
    <div className="line-chart-wrapper">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid meet" className="line-chart-svg">
        <defs>
          <linearGradient id="incomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridVals.map((val, i) => (
          <g key={i}>
            <line
              x1={paddingX}
              y1={getY(val)}
              x2={viewBoxWidth - paddingX}
              y2={getY(val)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={paddingX - 6}
              y={getY(val) + 4}
              textAnchor="end"
              className="line-chart-axis-label"
            >
              {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={getX(i)}
            y={viewBoxHeight - 10}
            textAnchor="middle"
            className="line-chart-axis-label"
          >
            {label}
          </text>
        ))}

        {/* Area fills */}
        <path d={buildAreaPath(incomeData)} fill="url(#incomeGrad)" className="line-chart-area" />
        <path d={buildAreaPath(expenseData)} fill="url(#expenseGrad)" className="line-chart-area" />

        {/* Lines */}
        <path d={buildPath(incomeData)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="line-chart-line" />
        <path d={buildPath(expenseData)} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="line-chart-line" />

        {/* Data points */}
        {incomeData.map((val, i) => (
          <circle key={`i-${i}`} cx={getX(i)} cy={getY(val)} r="4" fill="#10b981" stroke="#0a0e1a" strokeWidth="2" className="line-chart-dot" />
        ))}
        {expenseData.map((val, i) => (
          <circle key={`e-${i}`} cx={getX(i)} cy={getY(val)} r="4" fill="#f43f5e" stroke="#0a0e1a" strokeWidth="2" className="line-chart-dot" />
        ))}
      </svg>

      {/* Legend */}
      <div className="line-chart-legend">
        <div className="line-chart-legend-item">
          <span className="line-chart-legend-dot" style={{ background: '#10b981' }} />
          Income
        </div>
        <div className="line-chart-legend-item">
          <span className="line-chart-legend-dot" style={{ background: '#f43f5e' }} />
          Expenses
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allTimeSummary, setAllTimeSummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState({ labels: [], income: [], expenses: [] });

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
      const [monthly, expenses, incomes, categoriesData] = await Promise.all([
        dashboardService.getSummary(selectedMonth, selectedYear),
        expenseService.getMyExpenses(0, 1000),
        incomeService.getMyIncomes(0, 1000),
        categoryService.getMyCategories(),
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
        .map(([name, amount], i) => ({
          name,
          amount,
          color: getCategoryColor(null, name, categoriesData || []),
        }))
        .sort((a, b) => b.amount - a.amount);

      setCategorySpending(sorted);

      // Build 6-month trend data
      const trendLabels = [];
      const trendIncome = [];
      const trendExpenses = [];

      for (let i = 5; i >= 0; i--) {
        let m = selectedMonth - i;
        let y = selectedYear;
        while (m <= 0) { m += 12; y--; }

        trendLabels.push(getShortMonthName(m));

        let monthExpTotal = 0;
        (expenses.content || []).forEach((exp) => {
          if (!exp.expenseDate) return;
          const d = new Date(exp.expenseDate);
          if (d.getMonth() + 1 === m && d.getFullYear() === y) {
            monthExpTotal += Number(exp.amount) || 0;
          }
        });

        let monthIncTotal = 0;
        (incomes.content || []).forEach((inc) => {
          if (!inc.incomeDate) return;
          const d = new Date(inc.incomeDate);
          if (d.getMonth() + 1 === m && d.getFullYear() === y) {
            monthIncTotal += Number(inc.amount) || 0;
          }
        });

        trendIncome.push(monthIncTotal);
        trendExpenses.push(monthExpTotal);
      }

      setMonthlyTrend({ labels: trendLabels, income: trendIncome, expenses: trendExpenses });
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
            <div className="summary-cards stagger-children" style={{ marginBottom: '2rem' }}>
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

          {/* Charts Grid */}
          <div className="reports-charts-grid">
            {/* Income vs Expenses Trend (Line Chart) */}
            <div className="report-chart-card">
              <div className="report-chart-header">
                <div className="report-chart-icon trend-icon">
                  <TrendingDown size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3>Income vs Expenses</h3>
                  <p>6-month trend comparison</p>
                </div>
              </div>
              <div className="report-chart-body">
                {monthlyTrend.labels.length > 0 ? (
                  <LineChart
                    incomeData={monthlyTrend.income}
                    expenseData={monthlyTrend.expenses}
                    labels={monthlyTrend.labels}
                    height={240}
                  />
                ) : (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <p>No trend data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Distribution (Donut Chart) */}
            <div className="report-chart-card">
              <div className="report-chart-header">
                <div className="report-chart-icon donut-icon">
                  <PieChart size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3>Expense Distribution</h3>
                  <p>{getMonthName(selectedMonth)} {selectedYear}</p>
                </div>
              </div>
              <div className="report-chart-body">
                {categorySpending.length > 0 ? (
                  <DonutChart data={categorySpending} />
                ) : (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-icon">
                      <PieChart size={24} strokeWidth={2} />
                    </div>
                    <h3>No data</h3>
                    <p>No expenses recorded this month</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Spending Breakdown (Bar Chart) */}
          <div style={{ marginTop: '2rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Category Breakdown — {getMonthName(selectedMonth)} {selectedYear}
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
                            backgroundColor: cat.color || CATEGORY_COLORS[i % CATEGORY_COLORS.length],
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
