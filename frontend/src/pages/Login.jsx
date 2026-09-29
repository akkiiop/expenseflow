import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ArrowLeft, RotateCw, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="ef-auth-page">
      {/* Top navigation with official brand mark and home link */}
      <header className="ef-auth-top">
        <Link to="/" className="ef-auth-brand" aria-label="ExpenseFlow home">
          <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#0F2A29" />
            <path d="M5 21 C11 21 12 11 18 11 S23 16 27 9" fill="none" stroke="#34C7A5" strokeWidth="3" strokeLinecap="round" />
            <circle cx="27" cy="9" r="2.4" fill="#ECEEE7" />
          </svg>
          <span>ExpenseFlow</span>
        </Link>
        <Link to="/" className="ef-auth-back-btn">
          <ArrowLeft size={14} />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main split area */}
      <main className="ef-auth-main">
        {/* Left Hero / Product Showcase Panel */}
        <section className="ef-auth-hero">
          <div className="ef-auth-tag">
            <Sparkles size={13} />
            <span>Smart Personal Finance</span>
          </div>

          <h1>
            See where every rupee goes, before the month ends.
          </h1>

          <p>
            Log expenses in seconds, maintain category budget discipline, and receive plain-language financial observations powered by Google Gemini.
          </p>

          {/* Interactive Micro Showcase */}
          <div className="ef-auth-showcase">
            <div className="ef-auth-mini-card">
              <div className="ef-auth-mini-head">
                <span className="ef-auth-mini-title">
                  <TrendingUp size={14} color="#17806A" />
                  <span>Live Cash Flow</span>
                </span>
                <span className="ef-auth-mini-stat">+₹13,200 Surplus</span>
              </div>
              <div className="ef-auth-mini-bar">
                <div className="ef-auth-mini-fill" style={{ width: '76%' }}></div>
              </div>
              <p className="ef-auth-mini-desc">
                ₹70,700 income comfortably covers ₹57,500 expenses with healthy surplus.
              </p>
            </div>

          </div>
        </section>

        {/* Right Authentication Card */}
        <div className="ef-auth-card-wrap">
          <div className="ef-auth-card">
            <div className="ef-auth-card-header">
              <h2>Welcome back</h2>
              <p>Enter your credentials to access your financial dashboard.</p>
            </div>

            <form className="ef-auth-form" onSubmit={handleSubmit}>
              <div className="ef-form-group">
                <label className="ef-form-label" htmlFor="login-email">
                  <span>Email address</span>
                </label>
                <div className="ef-input-wrapper">
                  <input
                    id="login-email"
                    type="email"
                    className="ef-auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <Mail className="ef-input-icon-left" size={17} />
                </div>
              </div>

              <div className="ef-form-group">
                <label className="ef-form-label" htmlFor="login-password">
                  <span>Password</span>
                </label>
                <div className="ef-input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="ef-auth-input has-toggle"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="ef-input-icon-left" size={17} />
                  <button
                    type="button"
                    className="ef-toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="ef-auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RotateCw size={17} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    <span>Sign In</span>
                    <ArrowRight className="ef-arrow-icon" size={16} />
                  </>
                )}
              </button>
            </form>

            <footer className="ef-auth-card-footer">
              <div>
                Don't have an account?{' '}
                <Link to="/register" className="ef-auth-link">
                  Create an account
                </Link>
              </div>
              <div className="ef-auth-security-note">
                <ShieldCheck size={13} color="#17806A" />
                <span>Protected with JWT authentication and BCrypt password hashing.</span>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
