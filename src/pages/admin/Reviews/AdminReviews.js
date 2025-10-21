import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const AdminReviews = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [rejectedReviews, setRejectedReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const qPending = query(reviewsRef, where('approved', '==', false));
        const qApproved = query(reviewsRef, where('approved', '==', true));
        const qRejected = query(reviewsRef, where('rejected', '==', true));

        const [snapPending, snapApproved, snapRejected] = await Promise.all([
          getDocs(qPending),
          getDocs(qApproved),
          getDocs(qRejected)
        ]);

        const toSorted = (arr) => arr
          .filter(r => typeof r.comment === 'string' && r.comment.trim().length > 0)
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt || 0);
            const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt || 0);
            return (bDate instanceof Date ? bDate.getTime() : bDate) - (aDate instanceof Date ? aDate.getTime() : aDate);
          });

        const pending = snapPending.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(r => !r.rejected && !r.approved);
        const approved = snapApproved.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(r => r.approved && !r.rejected);
        const rejected = snapRejected.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(r => r.rejected && !r.approved);

        setPendingReviews(toSorted(pending));
        setApprovedReviews(toSorted(approved));
        setRejectedReviews(toSorted(rejected));
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
      await updateDoc(doc(db, 'reviews', reviewId), { approved: true, rejected: false });
      
      // Remove from pending and add to approved
      setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
      
      // Find the review in pending to move to approved
      const reviewToApprove = pendingReviews.find(r => r.id === reviewId);
      if (reviewToApprove) {
        const updatedReview = { ...reviewToApprove, approved: true, rejected: false };
        setApprovedReviews(prev => {
          // Check if review already exists to prevent duplicates
          const exists = prev.some(r => r.id === reviewId);
          if (!exists) {
            return [updatedReview, ...prev].sort((a, b) => {
              const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt || 0);
              const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt || 0);
              return (bDate instanceof Date ? bDate.getTime() : bDate) - (aDate instanceof Date ? aDate.getTime() : aDate);
            });
          }
          return prev;
        });
      }
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { approved: false, rejected: true });
      
      // Remove from pending and add to rejected
      setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
      
      // Find the review in pending to move to rejected
      const reviewToReject = pendingReviews.find(r => r.id === reviewId);
      if (reviewToReject) {
        const updatedReview = { ...reviewToReject, approved: false, rejected: true };
        setRejectedReviews(prev => {
          // Check if review already exists to prevent duplicates
          const exists = prev.some(r => r.id === reviewId);
          if (!exists) {
            return [updatedReview, ...prev].sort((a, b) => {
              const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt || 0);
              const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt || 0);
              return (bDate instanceof Date ? bDate.getTime() : bDate) - (aDate instanceof Date ? aDate.getTime() : aDate);
            });
          }
          return prev;
        });
      }
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

  const renderReviewList = (reviews, showActions = false) => {
    if (reviews.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No reviews found
        </div>
      );
    }

    return (
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
              <div className="flex items-center space-x-2">
                {showActions ? (
                  <>
                    <button onClick={() => handleApprove(review.id)} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200">Approve</button>
                    <button onClick={() => handleReject(review.id)} className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200">Reject</button>
                  </>
                ) : (
                  <span className={`px-3 py-1 text-sm rounded-full h-fit ${
                    activeTab === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {activeTab === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-reviews">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Reviews</h1>
        <p className="text-gray-600">Monitor and manage customer reviews.</p>
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({pendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved ({approvedReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'rejected'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Rejected ({rejectedReviews.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {activeTab === 'pending' && 'Pending Reviews'}
            {activeTab === 'approved' && 'Approved Reviews'}
            {activeTab === 'rejected' && 'Rejected Reviews'}
          </h2>
        </div>
        
        {activeTab === 'pending' && renderReviewList(pendingReviews, true)}
        {activeTab === 'approved' && renderReviewList(approvedReviews, false)}
        {activeTab === 'rejected' && renderReviewList(rejectedReviews, false)}
      </div>
    </div>
  );
};

export default AdminReviews;
