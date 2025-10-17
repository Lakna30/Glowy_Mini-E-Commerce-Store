import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        // Admin sees reviews which have a message and are not yet approved
        const q = query(reviewsRef, where('comment', '!=', ''), where('approved', '==', false));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt || 0);
            const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt || 0);
            return (bDate instanceof Date ? bDate.getTime() : bDate) - (aDate instanceof Date ? aDate.getTime() : aDate);
          });
        setReviews(items);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { approved: true });
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { approved: false, rejected: true });
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (e) {
      console.error('Reject failed', e);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="admin-reviews">
        <div className="text-center">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="admin-reviews">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Reviews</h1>
        <p className="text-gray-600">Monitor and manage customer reviews.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Reviews</h2>
        </div>
        
        {reviews.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Review</h3>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>By {review.userName || review.userEmail}</span>
                      <span className="mx-2">•</span>
                      <span>{review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleApprove(review.id)} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200">Approve</button>
                    <button onClick={() => handleReject(review.id)} className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
