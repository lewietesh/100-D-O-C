// components/Pagination.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g. "/projects/page"
};

const Pagination = ({ currentPage, totalPages, basePath }: Props) => {
  const router = useRouter();

  const goToPage = (page: number) => {
    router.push(`${basePath}/${page}`);
  };

  // Smooth scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-4 py-2 border rounded transition-all duration-200 ${
            currentPage === i
              ? 'bg-black text-white scale-105 shadow-lg'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-10 gap-2 items-center flex-wrap">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 border rounded bg-white text-black disabled:opacity-40"
      >
        &lt;
      </button>
      {renderPages()}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 border rounded bg-white text-black disabled:opacity-40"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
