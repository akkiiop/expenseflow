import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  Receipt,
  TrendingUp,
  Target,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'features') setFeaturesVisible(true);
            if (entry.target.id === 'how-it-works') setWorkflowVisible(true);
            if (entry.target.id === 'final-cta') setCtaVisible(true);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const featEl = document.getElementById('features');
    const workEl = document.getElementById('how-it-works');
    const ctaEl = document.getElementById('final-cta');

    if (featEl) observer.observe(featEl);
    if (workEl) observer.observe(workEl);
    if (ctaEl) observer.observe(ctaEl);

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  const features = [
    {
      icon: Receipt,
      title: 'Expense Tracking',
      description: 'Record and organize your daily spending.',
      color: 'expense',
    },
    {
      icon: TrendingUp,
      title: 'Income Management',
      description: 'Keep your income organized in one place.',
      color: 'income',
    },
    {
      icon: Target,
      title: 'Budget Management',
      description: 'Set spending limits and monitor your progress.',
      color: 'budget',
    },
    {
      icon: BarChart3,
      title: 'Financial Reports',
      description: 'See where your money goes.',
      color: 'reports',
    },
    {
      icon: Sparkles,
      title: 'AI Spending Insights',
      description: 'Get personalized observations from your spending data.',
      color: 'ai',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Authentication',
      description: 'Protected access with user-isolated financial data.',
      color: 'security',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create your account',
      description: 'Register with your name, email, and password to start your private workspace.',
    },
    {
      num: '02',
      title: 'Create your categories',
      description: 'Define spending categories like Food, Utilities, Shopping, and Travel.',
    },
    {
      num: '03',
      title: 'Add income and expenses',
      description: 'Log your earnings and daily expenses tagged by category and payment method.',
    },
    {
      num: '04',
      title: 'Set a budget if you want',
      description: 'Optionally set monthly category limits to keep your spending within targets.',
    },
    {
      num: '05',
      title: 'Understand your spending with Reports and AI Insights',
      description: 'Review monthly trends, category charts, and personalized AI spending observations.',
    },
  ];

  return (
    <div className="landing-page">
      {/* ── 1. Navbar ── */}
      <header className="landing-navbar">
        <div className="landing-navbar-container">
          <Link to="/" className="landing-brand">
            <span className="brand-logo-icon">
              <Wallet size={20} strokeWidth={2.5} />
            </span>
            <span className="brand-title">ExpenseFlow</span>
          </Link>

          <nav className="landing-nav-links">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="landing-nav-link"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="landing-nav-link"
            >
              How It Works
            </button>
          </nav>

          <div className="landing-nav-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <span>Get Started</span>
                  <ArrowRight size={14} className="btn-arrow-icon" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="landing-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="landing-mobile-link"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="landing-mobile-link"
            >
              How It Works
            </button>
            <div className="landing-mobile-actions">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Get Started</span>
                    <ArrowRight size={16} className="btn-arrow-icon" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── 2. Hero ── */}
      <section className="landing-hero">
        <div className="hero-glow-layer" aria-hidden="true"></div>
        <div className="hero-grid-pattern" aria-hidden="true"></div>

        <div className="landing-hero-content">
          <div className="landing-eyebrow hero-animate hero-delay-1">
            <span className="eyebrow-dot"></span>
            PERSONAL FINANCE, SIMPLIFIED
          </div>
          <h1 className="landing-hero-title hero-animate hero-delay-2">
            Manage your money.<br />
            Understand your spending.
          </h1>
          <p className="landing-hero-subtitle hero-animate hero-delay-3">
            Track expenses, manage income, set budgets and understand your spending — all in one place.
          </p>
          <div className="landing-hero-cta hero-animate hero-delay-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn btn-primary btn-lg"
            >
              <span>Get Started</span>
              <ArrowRight size={18} className="btn-arrow-icon" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="btn btn-secondary btn-lg"
            >
              <span>See How It Works</span>
            </button>
          </div>
        </div>

        {/* ── 3. Product / Dashboard Preview ── */}
        <div className="landing-hero-preview hero-animate hero-delay-5">
          <div className="preview-window">
            <div className="preview-header">
              <div className="preview-controls">
                <span className="preview-dot red"></span>
                <span className="preview-dot yellow"></span>
                <span className="preview-dot green"></span>
              </div>
              <div className="preview-address-bar">expenseflow.dev/dashboard</div>
            </div>

            <div className="preview-body">
              {/* Top 3 Summary Cards */}
              <div className="preview-grid-top">
                <div className="preview-card income">
                  <div className="preview-card-header">
                    <span>Total Income</span>
                    <TrendingUp size={16} className="text-income" />
                  </div>
                  <div className="preview-card-value">₹65,000</div>
                  <div className="preview-card-sub">Current month</div>
                </div>

                <div className="preview-card expense">
                  <div className="preview-card-header">
                    <span>Total Expenses</span>
                    <Receipt size={16} className="text-expense" />
                  </div>
                  <div className="preview-card-value">₹24,800</div>
                  <div className="preview-card-sub">Current month</div>
                </div>

                <div className="preview-card balance">
                  <div className="preview-card-header">
                    <span>Remaining Balance</span>
                    <Wallet size={16} className="text-primary" />
                  </div>
                  <div className="preview-card-value">₹40,200</div>
                  <div className="preview-card-sub">Available balance</div>
                </div>
              </div>

              {/* Bottom 2 Split Panels */}
              <div className="preview-grid-bottom">
                <div className="preview-panel">
                  <div className="preview-panel-title">Spending by Category</div>
                  <div className="preview-table">
                    <div className="preview-row">
                      <span>Food & Dining</span>
                      <span className="preview-tag">UPI</span>
                      <span className="preview-amount negative">-₹8,500</span>
                    </div>
                    <div className="preview-row">
                      <span>Rent & Housing</span>
                      <span className="preview-tag">NetBanking</span>
                      <span className="preview-amount negative">-₹12,000</span>
                    </div>
                    <div className="preview-row">
                      <span>Shopping</span>
                      <span className="preview-tag">Card</span>
                      <span className="preview-amount negative">-₹4,300</span>
                    </div>
                  </div>
                </div>

                <div className="preview-panel">
                  <div className="preview-panel-title">Budget Status</div>
                  <div className="preview-budget-group">
                    <div className="preview-budget-meta">
                      <span>Food & Dining</span>
                      <span>₹8,500 / ₹12,000 (71%)</span>
                    </div>
                    <div className="preview-bar-track">
                      <div className="preview-bar-fill normal" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  <div className="preview-budget-group">
                    <div className="preview-budget-meta">
                      <span>Shopping</span>
                      <span>₹4,300 / ₹5,000 (86%)</span>
                    </div>
                    <div className="preview-bar-track">
                      <div className="preview-bar-fill caution" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Features Section ── */}
      <section id="features" className={`landing-section features-section ${featuresVisible ? 'is-revealed' : ''}`}>
        <div className="landing-container">
          <div className="section-heading-centered section-reveal-header">
            <span className="section-badge">FEATURES</span>
            <h2>Everything you need to manage your finances.</h2>
          </div>

          <div className="features-grid">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="feature-card reveal-card"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className={`feature-icon-wrapper ${feat.color}`}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. How ExpenseFlow Works Section ── */}
      <section id="how-it-works" className={`landing-section workflow-section bg-alt ${workflowVisible ? 'is-revealed' : ''}`}>
        <div className="landing-container">
          <div className="section-heading-centered section-reveal-header">
            <span className="section-badge">RECOMMENDED WORKFLOW</span>
            <h2>How ExpenseFlow Works</h2>
            <p>Get started in a few simple steps.</p>
          </div>

          {/* 5-Step Timeline Grid — All 5 Cards 100% Identical */}
          <div className="workflow-steps-grid">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="workflow-step-card reveal-card"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA ── */}
      <section id="final-cta" className={`landing-final-cta ${ctaVisible ? 'is-revealed' : ''}`}>
        <div className="final-cta-content reveal-card">
          <h2>Ready to take control of your finances?</h2>
          <p>Track. Understand. Improve.</p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="btn btn-primary btn-lg"
          >
            <span>Get Started</span>
            <ArrowRight size={18} className="btn-arrow-icon" />
          </Link>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-grid">
            <div className="footer-col">
              <div className="landing-brand" style={{ marginBottom: '0.75rem' }}>
                <span className="brand-logo-icon" style={{ width: '32px', height: '32px' }}>
                  <Wallet size={16} strokeWidth={2.5} />
                </span>
                <span className="brand-title" style={{ fontSize: '1.1rem' }}>ExpenseFlow</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, maxWidth: '280px' }}>
                Personal Finance Management Platform. Simple, private, and secure.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('features')}
                    className="footer-link-btn"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-it-works')}
                    className="footer-link-btn"
                  >
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Project</h4>
              <ul>
                <li>
                  <a
                    href="https://github.com/akkiiop/expenseflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <span>© {currentYear} ExpenseFlow. Personal Finance Management Platform.</span>
            <span>All user financial data is isolated and encrypted.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
