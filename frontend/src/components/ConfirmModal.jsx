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
          padding: '2rem 1.75rem',
          borderRadius: '20px',
          background: 'var(--sheet, #F8F9F4)',
          border: '1px solid rgba(15, 42, 41, 0.1)',
          boxShadow: '0 24px 48px -12px rgba(15, 42, 41, 0.22), 0 0 0 1px rgba(15, 42, 41, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginRight: '-0.25rem', marginBottom: '0.25rem' }}>
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

        <div style={{ textAlign: 'center', marginBottom: '1.75rem', padding: '0 0.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: danger ? 'rgba(201, 58, 99, 0.1)' : 'rgba(185, 138, 46, 0.12)',
              color: danger ? 'var(--rose)' : 'var(--brass)',
              border: danger
                ? '1px solid rgba(201, 58, 99, 0.25)'
                : '1px solid rgba(185, 138, 46, 0.28)',
              boxShadow: danger
                ? '0 0 20px rgba(201, 58, 99, 0.12)'
                : '0 0 20px rgba(185, 138, 46, 0.12)',
              marginBottom: '1rem',
            }}
          >
            {danger ? (
              <Trash2 size={24} strokeWidth={2.25} />
            ) : (
              <AlertTriangle size={24} strokeWidth={2.25} />
            )}
          </div>
          <h3
            style={{
              fontFamily: 'var(--display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--muted)',
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
            style={{ height: '42px', justifyContent: 'center', fontWeight: 600, borderRadius: '9999px' }}
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
              background: danger ? 'var(--rose)' : 'var(--brass)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              borderRadius: '9999px',
              boxShadow: danger
                ? '0 4px 14px rgba(201, 58, 99, 0.3)'
                : '0 4px 14px rgba(185, 138, 46, 0.3)',
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
