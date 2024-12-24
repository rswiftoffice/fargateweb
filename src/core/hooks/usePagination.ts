import { useState } from "react";

export function usePagination() {
  const limit = 10;
  const [prevPage, setPrevPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handleChangePage = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    setPrevPage(page);
    setCurrentPage(page);
  };

  return { limit, prevPage, currentPage, setCurrentPage, handleChangePage };
}
