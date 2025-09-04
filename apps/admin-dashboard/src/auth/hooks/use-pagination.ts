import { useCallback } from 'react';

import { useSearchParamsWithSetter } from './use-search-params';

// ----------------------------------------------------------------------

interface ReturnType {
  pageNumber: number;
  navigateToPage: (pageNumber: number, additionalParams?: URLSearchParams) => void;
}

const PAGE_QUERY_NAME = 'page';

// Saves page state in url & returns the page count
export function usePagination(): ReturnType {
  const { searchParams, setSearchParams } = useSearchParamsWithSetter();

  const navigateToPage = useCallback(
    (pageNumber: number) => {
      setSearchParams(PAGE_QUERY_NAME, pageNumber.toString());
    },
    [setSearchParams]
  );

  const pageNumber = searchParams.get(PAGE_QUERY_NAME)
    ? parseInt(searchParams.get(PAGE_QUERY_NAME)!, 10)
    : 1;
  return {
    pageNumber,
    navigateToPage,
  };
}
