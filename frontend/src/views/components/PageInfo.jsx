import React from 'react';

const PageInfo = ({ pagination, itemsPerPage = 6 }) => {
  if (pagination.count <= 0) {
    return null;
  }

  const start = ((pagination.current_page - 1) * itemsPerPage) + 1;
  const end = Math.min(pagination.current_page * itemsPerPage, pagination.count);

  return (
    <div className="text-center text-gray-500 mt-4">
      Showing {start} to {end} of {pagination.count} posts
    </div>
  );
};

export default PageInfo;