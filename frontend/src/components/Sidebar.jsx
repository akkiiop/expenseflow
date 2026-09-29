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
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#0F2A29',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.12)',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#0F2A29" />
                <path d="M10 26 C 16 26, 18 14, 26 14 C 30 14, 32 18, 34 20" stroke="#34C7A5" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <circle cx="26" cy="14" r="3" fill="#ECEEE7" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>ExpenseFlow</h1>
              <span style={{ fontSize: '0.7rem', color: '#728D87', marginTop: '2px' }}>Smart Personal Finance</span>
            </div>
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
