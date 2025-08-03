'use client';

import { ProjectReview } from '@/types/projects';

interface ProjectReviewsProps {
  reviews?: ProjectReview[];
}

const StarRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 1l2.928 6.076L20 8.191l-5 4.868L16.18 20 10 16.708 3.82 20 5 13.059 0 8.191l7.072-1.115L10 1z"
            clipRule="evenodd"
          />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
    </div>
  );
};

const ProjectReviews = ({ reviews }: ProjectReviewsProps) => {
  const approvedReviews = reviews?.filter(review => review.approved) || [];

  if (!approvedReviews.length) {
    return null;
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-6">Client Reviews</h2>
      <div className="space-y-6">
        {approvedReviews.map((review) => (
          <div
            key={review.id}
            className={`border rounded-lg p-6 bg-gray-50 ${review.featured ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {review.reviewer_name || review.display_name || 'Anonymous'}
                </h3>
                {review.company_name && (
                  <p className="text-sm text-gray-600">{review.company_name}</p>
                )}
                <StarRating rating={review.rating} />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {new Date(review.date_created).toLocaleDateString()}
                </span>
                {review.featured && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <blockquote className="text-gray-700 italic border-l-4 border-blue-400 pl-4">
              "{review.content}"
            </blockquote>
          </div>
        ))}
      </div>

      {approvedReviews.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Showing {approvedReviews.length} client review{approvedReviews.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProjectReviews;


