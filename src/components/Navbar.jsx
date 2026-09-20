import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

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
        <div className="navbar-user">
          <div className="navbar-avatar">{getInitials()}</div>
          <span className="navbar-username">{user?.name || 'User'}</span>
        </div>
        <button
          className="btn btn-ghost btn-sm navbar-logout-btn"
          onClick={logout}
          title="Sign out of your account"
          aria-label="Sign out"
        >
          <LogOut size={15} strokeWidth={2} />
          <span className="navbar-logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
}
