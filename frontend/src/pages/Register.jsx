import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, ArrowLeft, RotateCw, ShieldCheck, Sparkles, CheckCircle2, PieChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      addToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } else {
      addToast(result.message, 'error');
    }
  };

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

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
            <span>Join ExpenseFlow Free</span>
          </div>

          <h1>
            Take total control of your money from day one.
          </h1>

          <p>
            Create your account to track UPI, cash, and card spending, set realistic monthly category budgets, and let Gemini explain where every rupee goes.
          </p>

          {/* Interactive Micro Showcase */}
          <div className="ef-auth-showcase">
            <div className="ef-auth-mini-card">
              <div className="ef-auth-mini-head">
                <span className="ef-auth-mini-title">
                  <PieChart size={14} color="#17806A" />
                  <span>Category Discipline</span>
                </span>
                <span className="ef-auth-mini-stat" style={{ color: '#0F2A29' }}>4 of 4 On Track</span>
              </div>
              <div className="ef-auth-mini-bar">
                <div className="ef-auth-mini-fill" style={{ width: '65%', background: '#34C7A5' }}></div>
              </div>
              <p className="ef-auth-mini-desc">
                Food, Transport, Rent, and Subscriptions tracked in real-time with visual budget bars.
              </p>
            </div>

          </div>
        </section>

        {/* Right Authentication Card */}
        <div className="ef-auth-card-wrap">
          <div className="ef-auth-card">
            <div className="ef-auth-card-header">
              <h2>Create your account</h2>
              <p>Start tracking your expenses and mastering your monthly cash flow.</p>
            </div>

            <form className="ef-auth-form" onSubmit={handleSubmit}>
              <div className="ef-form-group">
                <label className="ef-form-label" htmlFor="register-name">
                  <span>Full name *</span>
                </label>
                <div className="ef-input-wrapper">
                  <input
                    id="register-name"
                    type="text"
                    className="ef-auth-input"
                    placeholder="Akshay Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                  <User className="ef-input-icon-left" size={17} />
                </div>
              </div>

              <div className="ef-form-group">
                <label className="ef-form-label" htmlFor="register-email">
                  <span>Email address *</span>
                </label>
                <div className="ef-input-wrapper">
                  <input
                    id="register-email"
                    type="email"
                    className="ef-auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="ef-input-icon-left" size={17} />
                </div>
              </div>

              <div className="ef-form-group">
                <label className="ef-form-label" htmlFor="register-password">
                  <span>Password *</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 400 }}>Min 6 characters</span>
                </label>
                <div className="ef-input-wrapper">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className="ef-auth-input has-toggle"
                    placeholder="Create a strong password"
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

              <div className="ef-form-group">
                <label className="ef-form-label" htmlFor="register-confirm">
                  <span>Confirm password *</span>
                  {passwordsMatch && (
                    <span style={{ fontSize: '11.5px', color: 'var(--green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={12} /> Matches
                    </span>
                  )}
                </label>
                <div className="ef-input-wrapper">
                  <input
                    id="register-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="ef-auth-input has-toggle"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Lock className="ef-input-icon-left" size={17} />
                  <button
                    type="button"
                    className="ef-toggle-pw-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordsMismatch && (
                  <span className="ef-field-hint error">Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                className="ef-auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RotateCw size={17} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    <span>Create Account</span>
                    <ArrowRight className="ef-arrow-icon" size={16} />
                  </>
                )}
              </button>
            </form>

            <footer className="ef-auth-card-footer">
              <div>
                Already have an account?{' '}
                <Link to="/login" className="ef-auth-link">
                  Sign in
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
