import { Star } from 'lucide-react';

const Rating = ({ rating, totalReviews, onRate, readonly = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate?.(star)}
          className={!readonly ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`${sizes[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            } ${!readonly && 'hover:text-yellow-400 transition'}`}
          />
        </button>
      ))}
      {totalReviews !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;