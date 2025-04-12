import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const handlePreviousPage = () => {
    if (pagination.previous) {
      onPageChange(pagination.current_page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      onPageChange(pagination.current_page + 1);
    }
  };

  // Function to generate page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(pagination.total_pages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md hover:cursor-pointer ${
            pagination.current_page === i
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  if (pagination.total_pages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={!pagination.previous}
          className={`px-3 py-1 rounded-md hover:cursor-pointer ${
            !pagination.previous
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          ← Previous
        </button>
        
        {renderPageNumbers()}
        
        <button
          onClick={handleNextPage}
          disabled={!pagination.next}
          className={`px-3 py-1 rounded-md hover:cursor-pointer ${
            !pagination.next
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;