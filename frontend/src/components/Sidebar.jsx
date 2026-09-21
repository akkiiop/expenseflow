import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Tags,
  Target,
  BarChart3,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const navItems = [
    {
      section: null,
      items: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      ],
    },
    {
      section: 'Transactions',
      items: [
        { to: '/expenses', icon: Receipt, label: 'Expenses' },
        { to: '/income', icon: TrendingUp, label: 'Income' },
      ],
    },
    {
      section: 'Management',
      items: [
        { to: '/categories', icon: Tags, label: 'Categories' },
        { to: '/budgets', icon: Target, label: 'Budgets' },
      ],
    },
    {
      section: 'Insights',
      items: [
        { to: '/reports', icon: BarChart3, label: 'Reports' },
        { to: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
      ],
    },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <h1>ExpenseFlow</h1>
            <span>Personal Finance Manager</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
            title="Close menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group, gi) => (
            <div key={gi}>
              {group.section && (
                <div className="sidebar-section-label">{group.section}</div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <span className="icon">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={handleLogout} style={{ width: '100%' }}>
            <span className="icon">
              <LogOut size={18} strokeWidth={2} />
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
