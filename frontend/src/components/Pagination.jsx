import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} strokeWidth={2} />
        <span>Previous</span>
      </button>
      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        className="btn btn-secondary btn-sm"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
