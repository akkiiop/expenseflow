import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date());

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

      </div>

      <div className="navbar-right">
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--muted)',
          background: 'rgba(15, 42, 41, 0.04)',
          border: '1px solid rgba(15, 42, 41, 0.08)',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px'
        }}>
          {todayFormatted}
        </span>
        <div className="navbar-user" style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 42, 41, 0.1)',
          padding: '0.25rem 0.75rem 0.25rem 0.35rem',
          borderRadius: '9999px',
          boxShadow: '0 1px 4px rgba(15, 42, 41, 0.04)'
        }}>
          <div className="navbar-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>{getInitials()}</div>
          <span className="navbar-username" style={{ fontSize: '0.8125rem' }}>{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
