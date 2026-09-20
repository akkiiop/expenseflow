import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

export default function BudgetProgress({
  categoryName,
  budgetAmount,
  spentAmount,
  onEdit,
  onDelete,
}) {
  const spent = Number(spentAmount) || 0;
  const budget = Number(budgetAmount) || 1;
  const percentage = Math.min(Math.round((spent / budget) * 100), 100);
  const remaining = budget - spent;

  let barClass = 'safe';
  if (percentage >= 85) barClass = 'danger';
  else if (percentage >= 60) barClass = 'caution';

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div>
          <div className="budget-category">{categoryName}</div>
          <div className="budget-amounts">
            ₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="category-actions">
          {onEdit && (
            <button
              className="btn-icon"
              onClick={onEdit}
              title="Edit budget"
              aria-label="Edit budget"
            >
              <Pencil size={14} strokeWidth={2} />
            </button>
          )}
          {onDelete && (
            <button
              className="btn-icon danger"
              onClick={onDelete}
              title="Delete budget"
              aria-label="Delete budget"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${barClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="budget-footer">
        <span
          className="budget-percentage"
          style={{
            color:
              barClass === 'danger'
                ? 'var(--expense)'
                : barClass === 'caution'
                ? 'var(--warning)'
                : 'var(--income)',
          }}
        >
          {percentage}%
        </span>
        <span className="budget-remaining">
          {remaining > 0
            ? `₹${remaining.toLocaleString('en-IN')} remaining`
            : 'Budget exceeded'}
        </span>
      </div>

      {percentage >= 90 && (
        <div className="budget-warning">
          <AlertTriangle size={14} strokeWidth={2} />
          <span>{percentage >= 100 ? 'Budget limit reached' : 'Near budget limit'}</span>
        </div>
      )}
    </div>
  );
}
