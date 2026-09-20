import React from 'react';

export default function SummaryCard({ icon: Icon, label, value, subtitle, variant = 'balance' }) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null)) {
      return <Icon size={20} strokeWidth={2} />;
    }
    return Icon;
  };

  return (
    <div className={`summary-card ${variant}`}>
      <div className="card-icon">{renderIcon()}</div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  );
}
