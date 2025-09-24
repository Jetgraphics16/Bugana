import React, { useState } from 'react';

const StarIcon: React.FC<{ filled: boolean; color?: string; onClick?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; isInteractive: boolean }> = ({ filled, color = "text-yellow-400", onClick, onMouseEnter, onMouseLeave, isInteractive }) => (
    <svg 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-6 w-6 ${isInteractive ? 'cursor-pointer' : ''} ${filled ? color : 'text-gray-300'}`} 
      viewBox="0 0 20 20" 
      fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void; interactive?: boolean }> = ({ rating, onRatingChange, interactive = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleRatingClick = (rate: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(rate);
        }
    };
    
    const handleMouseEnter = (rate: number) => {
        if (interactive) {
            setHoverRating(rate);
        }
    };
    
    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    return (
        <div className="flex items-center" onMouseLeave={interactive ? handleMouseLeave : undefined}>
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon 
                    key={star} 
                    filled={star <= (hoverRating || rating)}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    isInteractive={interactive}
                />
            ))}
        </div>
    );
};

export default StarRating;
