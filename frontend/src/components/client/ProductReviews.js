import React, { useState } from 'react';
import Button from '../shared/Button';

const ProductReviews = ({ product }) => {
  const [reviews] = useState([
    {
      id: 1,
      userName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm rất tốt, chất lượng cao và giao hàng nhanh!',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      userName: 'Trần Thị B',
      rating: 4,
      comment: 'Sản phẩm ok, đúng như mô tả. Sẽ mua lại.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      userName: 'Lê Văn C',
      rating: 5,
      comment: 'Tuyệt vời! Chính xác những gì tôi cần.',
      date: '2024-01-05',
      verified: false
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const renderStars = (rating, size = 'text-sm') => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${size} ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      ></i>
    ));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically send the review to your backend
    ('Submitting review:', newReview);
    alert('Cảm ơn bạn đã đánh giá! (Tính năng này sẽ được phát triển)');
    setNewReview({ rating: 5, comment: '' });
  };

  const averageRating = product.rating?.average || 0;
  const totalReviews = product.rating?.count || 0;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Đánh giá sản phẩm</h3>
      
      {/* Rating Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</span>
              <div className="flex">{renderStars(Math.floor(averageRating))}</div>
            </div>
            <p className="text-gray-600">Dựa trên {totalReviews} đánh giá</p>
          </div>
          
          {/* Rating Breakdown */}
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2 text-sm">
                <span>{rating}</span>
                <i className="fas fa-star text-yellow-400"></i>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${(rating === 5 ? 60 : rating === 4 ? 30 : 10)}%` }}
                  ></div>
                </div>
                <span className="text-gray-500">({rating === 5 ? 3 : rating === 4 ? 2 : 0})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Viết đánh giá của bạn</h4>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn:
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  <i className={`fas fa-star ${
                    rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}></i>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét:
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <Button type="submit" disabled={!newReview.comment.trim()}>
            <i className="fas fa-paper-plane mr-2"></i>
            Gửi đánh giá
          </Button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="font-semibold">Đánh giá từ khách hàng ({reviews.length})</h4>
        
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        <i className="fas fa-check mr-1"></i>
                        Đã mua hàng
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">{renderStars(review.rating, 'text-xs')}</div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 ml-13">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;