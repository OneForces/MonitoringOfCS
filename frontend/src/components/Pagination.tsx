import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPages = () => {
    const pages = [];

    const range = 3; // сколько кнопок вокруг текущей
    const min = Math.max(1, currentPage - range);
    const max = Math.min(totalPages, currentPage + range);

    if (min > 1) pages.push(<button key="1" onClick={() => onPageChange(1)}>1</button>);
    if (min > 2) pages.push(<span key="dots-start">...</span>);

    for (let i = min; i <= max; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? 'active' : ''}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (max < totalPages - 1) pages.push(<span key="dots-end">...</span>);
    if (max < totalPages) pages.push(
      <button key={totalPages} onClick={() => onPageChange(totalPages)}>
        {totalPages}
      </button>
    );

    return pages;
  };

  return (
    <div className="pagination">
      {renderPages()}
    </div>
  );
};

export default Pagination;
