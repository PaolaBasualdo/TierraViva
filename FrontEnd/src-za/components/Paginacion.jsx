import React from "react";
import { IconButton, Stack, Button, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const DOTS = "...";

const usePagination = ({ currentPage, totalPages, siblingCount = 1 }) => {
  return React.useMemo(() => {
    const totalNumbers = siblingCount + 5;
    if (totalNumbers >= totalPages) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => totalPages - (3 + 2 * siblingCount) + 1 + i);
      return [firstPageIndex, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [currentPage, totalPages, siblingCount]) || [];
};

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const paginationRange = usePagination({ currentPage, totalPages });
  if (currentPage === 0 || totalPages < 2) return null;

  return (
    <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{ bgcolor: "grey.800", color: "common.white", "&:hover": { bgcolor: "grey.700" } }}
      >
        <ChevronLeft />
      </IconButton>

      {paginationRange.map((page, i) =>
        page === DOTS ? (
          <Typography key={i} sx={{ px: 1.5, py: 1, color: "grey.400" }}>{DOTS}</Typography>
        ) : (
          <Button
            key={i}
            variant={page === currentPage ? "contained" : "outlined"}
            color={page === currentPage ? "warning" : "inherit"}
            onClick={() => onPageChange(page)}
            sx={{
              minWidth: 36,
              bgcolor: page === currentPage ? "orange.500" : "grey.800",
              color: "common.white",
              "&:hover": { bgcolor: page === currentPage ? "orange.600" : "grey.700" },
            }}
          >
            {page}
          </Button>
        )
      )}

      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{ bgcolor: "grey.800", color: "common.white", "&:hover": { bgcolor: "grey.700" } }}
      >
        <ChevronRight />
      </IconButton>
    </Stack>
  );
}
