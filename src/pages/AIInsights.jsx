import { useState } from 'react';
import {
  Sparkles,
  Brain,
  Bot,
  TrendingUp,
  Receipt,
  Wallet,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import SummaryCard from '../components/SummaryCard';
import aiService from '../services/aiService';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const renderFormattedAnalysis = (text) => {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} style={{ height: '0.75rem' }} />;
    }

    // Parse **bold** markdown tags
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formatted = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    const isListItem = /^\d+\.\s/.test(trimmed) || /^[-*]\s/.test(trimmed);

    return (
      <div
        key={idx}
        style={{
          marginBottom: isListItem ? '0.75rem' : '0.5rem',
          paddingLeft: isListItem ? '0.5rem' : '0',
          lineHeight: 1.7,
        }}
      >
        {formatted}
      </div>
    );
  });
};

export default function AIInsights() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.getInsights();
      setInsights(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate insights. Please try again.';
      setError(msg);
      addToast('Failed to generate AI insights', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Insights</h1>
          <p className="page-subtitle">Personalized financial advisory powered by Google Gemini</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="ai-hero">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--ai-glow)',
            color: 'var(--ai-accent)',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={24} strokeWidth={2} />
        </div>
        <h2>AI Spending Insights</h2>
        <p>Understand your financial patterns and receive actionable guidance</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Analyzes your current month's income, expenses, and category distributions
        </p>
        <button
          className="btn-ai"
          onClick={handleAnalyze}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {loading ? (
            <>
              <RotateCw size={16} strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing your spending...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} strokeWidth={2.5} />
              <span>Analyze My Spending</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Shimmer */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="shimmer" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }}></div>
          <div className="shimmer" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          className="card"
          style={{
            borderColor: 'rgba(244, 63, 94, 0.3)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--expense-glow)',
              color: 'var(--expense)',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={24} strokeWidth={2} />
          </div>
          <h3 style={{ color: 'var(--expense)', marginBottom: '0.5rem' }}>Analysis Failed</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: '450px', margin: '0 auto 1.25rem' }}>
            {error}
          </p>
          <button className="btn btn-secondary btn-sm" onClick={handleAnalyze}>
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {insights && !loading && (
        <div className="animate-fade-in-up">
          {/* Financial Summary */}
          <div className="summary-cards stagger-children" style={{ marginBottom: '1.5rem' }}>
            <SummaryCard
              icon={TrendingUp}
              label="Total Income"
              value={formatCurrency(insights.totalIncome)}
              subtitle="Current month"
              variant="income"
            />
            <SummaryCard
              icon={Receipt}
              label="Total Expenses"
              value={formatCurrency(insights.totalExpenses)}
              subtitle="Current month"
              variant="expense"
            />
            <SummaryCard
              icon={Wallet}
              label="Remaining"
              value={formatCurrency(insights.remainingBalance)}
              subtitle="Available surplus"
              variant="balance"
            />
          </div>

          {/* AI Analysis Card */}
          <div className="ai-result">
            <div className="ai-result-header">
              <Brain size={20} strokeWidth={2} style={{ color: 'var(--ai-accent)' }} />
              <h3>Your Financial Insights</h3>
            </div>
            <div className="ai-result-body">
              <div className="ai-analysis-text">
                {renderFormattedAnalysis(insights.aiAnalysis)}
              </div>
              <div className="ai-powered-badge">
                <Sparkles size={13} strokeWidth={2} />
                <span>Powered by Gemini 2.5 Flash</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial State - before first click */}
      {!insights && !loading && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            className="empty-icon"
            style={{
              margin: '0 auto 1rem',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--ai-glow)',
              color: 'var(--ai-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={28} strokeWidth={2} />
          </div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Ready to Analyze</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Click the button above to generate personalized financial tips and observations based on your database records
          </p>
        </div>
      )}
    </div>
  );
}
