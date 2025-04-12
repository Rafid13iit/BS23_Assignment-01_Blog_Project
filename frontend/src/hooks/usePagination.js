import { useState, useEffect, useCallback } from 'react';

const usePagination = (fetchFunction, initialPage = 1) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    current_page: initialPage,
    next: null,
    previous: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (page = pagination.current_page) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(page);
      
      if (result) {
        setItems(result.results || []);
        setPagination({
          count: result.count || 0,
          total_pages: result.total_pages || 0,
          current_page: result.current_page || page,
          next: result.next,
          previous: result.previous
        });
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setPagination(prev => ({
      ...prev,
      current_page: pageNumber
    }));
  }, []);

  useEffect(() => {
    fetchData(pagination.current_page);
  }, [pagination.current_page, fetchData]);

  return {
    items,
    pagination,
    loading,
    error,
    handlePageChange,
    refreshData: fetchData
  };
};

export default usePagination;