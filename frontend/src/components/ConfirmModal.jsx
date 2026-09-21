import { useEffect } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  loading = false,
  danger = true,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{
          maxWidth: '440px',
          padding: '1.75rem',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-0.25rem' }}>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            title="Close"
            style={{ opacity: loading ? 0.4 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: danger ? 'rgba(244, 63, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: danger ? 'var(--expense)' : 'var(--warning)',
              border: danger
                ? '1px solid rgba(244, 63, 94, 0.28)'
                : '1px solid rgba(245, 158, 11, 0.28)',
              boxShadow: danger
                ? '0 0 20px rgba(244, 63, 94, 0.15)'
                : '0 0 20px rgba(245, 158, 11, 0.15)',
              marginBottom: '1rem',
            }}
          >
            {danger ? (
              <Trash2 size={26} strokeWidth={2} />
            ) : (
              <AlertTriangle size={26} strokeWidth={2} />
            )}
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.625rem',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              wordBreak: 'break-word',
            }}
          >
            {message}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{ height: '42px', justifyContent: 'center', fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            style={{
              height: '42px',
              justifyContent: 'center',
              background: danger ? 'var(--expense)' : 'var(--warning)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              boxShadow: danger
                ? '0 4px 14px rgba(244, 63, 94, 0.35)'
                : '0 4px 14px rgba(245, 158, 11, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                <span>Deleting...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
