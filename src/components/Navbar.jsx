import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();

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
      </div>
    </header>
  );
}
