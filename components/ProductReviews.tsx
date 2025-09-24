import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import StarRating from './StarRating';
import { UserRole } from '../types';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { reviews, addReview, currentUser } = useContext(AppContext) as AppContextType;
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const productReviews = reviews.filter(review => review.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (newComment.trim() === '') {
      setError('Please write a comment.');
      return;
    }
    setError('');
    addReview({ productId, rating: newRating, comment: newComment });
    setNewRating(0);
    setNewComment('');
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
      const count = productReviews.filter(r => r.rating === stars).length;
      const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
      return { stars, count, percentage };
  });

  return (
    <div className="mt-12">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

        {/* Summary */}
        {productReviews.length > 0 && (
            <div className="flex flex-col md:flex-row items-start gap-8 mb-6 p-6 bg-gray-50 rounded-lg border">
                {/* Left Side: Overall Rating */}
                <div className="flex flex-col items-center justify-center text-center w-full md:w-1/3">
                    <span className="text-5xl font-bold text-emerald-600">{averageRating.toFixed(1)}</span>
                    <div className="my-2">
                        <StarRating rating={averageRating} />
                    </div>
                    <p className="text-sm text-gray-500">Based on {productReviews.length} review{productReviews.length > 1 ? 's' : ''}</p>
                </div>
                
                {/* Right Side: Rating Breakdown */}
                <div className="w-full md:w-2/3">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Rating Breakdown</h4>
                    <div className="space-y-1.5">
                        {ratingDistribution.map(({ stars, percentage }) => (
                            <div key={stars} className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600 font-medium w-12">{stars} star{stars > 1 ? 's' : ''}</span>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-gray-500 w-12 text-right">{percentage.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Add Review Form for Customers */}
        {currentUser && currentUser.role === UserRole.CUSTOMER && (
            <div className="mb-8 border-b pb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <StarRating rating={newRating} onRatingChange={setNewRating} interactive={true} />
                </div>
                <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                    id="comment"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="What did you think of the product?"
                    required
                ></textarea>
                </div>
                {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
                <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow font-semibold"
                >
                Submit Review
                </button>
            </form>
            </div>
        )}

        {/* Review List */}
        <div className="space-y-6">
            {productReviews.length > 0 ? (
            productReviews.map(review => (
                <div key={review.id} className="pb-4 border-b last:border-b-0">
                <div className="flex items-center mb-1">
                    <StarRating rating={review.rating} />
                    <p className="ml-4 font-semibold text-gray-800">{review.username}</p>
                </div>
                 <p className="text-xs text-gray-400 mb-2">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
            ))
            ) : (
            <p className="text-gray-500 py-4">No reviews yet. Be the first to share your thoughts!</p>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProductReviews;
