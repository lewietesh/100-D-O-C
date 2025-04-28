'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const Pagination = ({ currentPage, totalPages, basePath }: Props) => {
  const router = useRouter();

  const goToPage = (page: number) => {
    if (page === currentPage) return;
    router.push(`${basePath}/${page}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => goToPage(i)}
            aria-current={currentPage === i ? 'page' : undefined}
            className={`px-4 py-2 border rounded transition-all duration-200 ${
              currentPage === i
                ? 'bg-black text-white scale-105 shadow-lg'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex justify-center mt-10 gap-2 items-center flex-wrap"
    >
      <ul className="flex gap-2 items-center flex-wrap">
        <li>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-disabled={currentPage <= 1}
            className="px-4 py-2 border rounded bg-white text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
        </li>
        {renderPages()}
        <li>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-disabled={currentPage >= totalPages}
            className="px-4 py-2 border rounded bg-white text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
