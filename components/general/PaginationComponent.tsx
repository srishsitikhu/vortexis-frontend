'use client';

import React from 'react';
import { Button } from './Button';

type Props = {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const PaginationComponent: React.FC<Props> = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        text="Previous"
        variant="ghost"
        disabled={page === 1}
        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
      />
      <span className="rounded px-2 py-1 text-sm">
        Page {page} of {totalPages}
      </span>
      <Button
        text="Next"
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
      />
    </div>
  );
};
