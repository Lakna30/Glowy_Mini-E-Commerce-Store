import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { Heart, ShoppingCart, ChevronLeft, X, CheckCircle, AlertCircle } from "lucide-react";

const gradientClass = "bg-gradient-to-b from-[#484139] via-[#544C44] via-[#5D554C] via-[#655E54] to-[#6B5B4F]";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // 🔹 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  // 🔹 Fetch reviews (only approved messages; star-only entries are always shown)
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        const reviewsRef = collection(db, 'reviews');
        // Avoid composite index requirement by not ordering in the query; sort client-side
        const q = query(reviewsRef, where('productId', '==', id));
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Filter: show only approved if there is a comment; star-only (no comment) are visible immediately
        .filter(r => (r.comment && r.comment.trim().length > 0) ? r.approved === true : true)
        // Sort by createdAt desc, handling missing timestamps gracefully
        .sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt || 0);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt || 0);
          return (bDate instanceof Date ? bDate.getTime() : bDate) - (aDate instanceof Date ? aDate.getTime() : aDate);
        });
        
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  // 🔹 Submit review (allow stars only, text only, or both)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showError('Please log in to submit a review.');
      return;
    }

    if (selectedRating === 0 && !reviewText.trim()) {
      showError('Please add a star rating or write a review.');
      return;
    }

    setSubmittingReview(true);

    try {
      const hasMessage = !!reviewText.trim();
      const reviewData = {
        productId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        userEmail: currentUser.email,
        rating: selectedRating || 0,
        comment: hasMessage ? reviewText.trim() : '',
        createdAt: serverTimestamp(),
        // Star-only reviews are auto-approved; message reviews require admin approval
        approved: hasMessage ? false : true
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      showSuccess(hasMessage ? 'Review submitted! It will be visible after admin approval.' : 'Rating submitted successfully!');
      
      // Reset form
      setSelectedRating(0);
      setReviewText('');
      
      // Refresh reviews (same client-side sort to avoid index requirement)
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, where('productId', '==', id));
      const querySnapshot = await getDocs(q);
      const refreshed = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(r => (r.comment && r.comment.trim().length > 0) ? r.approved === true : true)
        .sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt || 0);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt || 0);
          return (bDate instanceof Date ? bDate.getTime() : bDate) - (aDate instanceof Date ? aDate.getTime() : aDate);
        });
      setReviews(refreshed);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      showError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#484139] text-center text-[#D4B998] h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#484139] text-center text-[#D4B998] h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Product not found</h1>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#D4B998] text-[#3b332b] px-6 py-3 rounded-lg font-semibold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // 🔹 Add to cart with popup
  const handleAddToCart = () => {
    try {
      addToCart(product, 1);
      showSuccess(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Failed to add product to cart");
    }
  };

  return (
    <div className={`${gradientClass} min-h-screen flex flex-col items-center text-[#D4B998] px-6 py-10`}>
      {/* Back Icon */}
      <div
        onClick={() => navigate("/products")}
        className="absolute top-30 left-7 cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200"
      >
        <ChevronLeft
          size={32}
          className="text-[#D4B998] hover:text-[#e1caa5] transition transform hover:scale-110"
          title="Back to Products"
        />
      </div>

      {/* Product Section */}
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-12 items-stretch justify-between max-h-[600px]">
        {/* Product Info */}
        <div className="bg-[#D4B998] text-[#463C30] rounded-3xl p-8 shadow-xl w-full lg:w-1/3 flex flex-col">
          <h1 className="text-4xl font-domine font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-[#463C30] mb-4">{product.description || "No description available."}</p>

          <div className="text-3xl font-bold mb-4">LKR {product.price?.toFixed(2)}</div>

          {/* Rating Display */}
          <div className="flex items-center gap-1 mb-6">
            {(() => {
              const displayRating = Math.round(Number(product?.rating ?? product?.avgRating ?? 0));
              return [...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill={i < displayRating ? "#facc15" : "#ffffff"}
                  stroke="#000000"
                  strokeWidth="1"
                >
                  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
                </svg>
              ));
            })()}
          </div>

          <div className="flex items-center justify-end mt-auto">
            <button
              onClick={() => navigate("/confirm-order", { state: { product, quantity: 1 } })}
              className="bg-[#463C30] text-[#D4B998] px-8 py-3 rounded-xl font-semibold text-lg hover:bg-[#2e2821] transition mr-20"
            >
              Buy Now
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="w-14 h-14 flex items-center justify-center bg-[#463C30] text-[#D4B998] rounded-xl hover:bg-[#2e2821] transition"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
              <button className="w-14 h-14 flex items-center justify-center bg-[#463C30] text-[#D4B998] rounded-xl hover:bg-[#2e2821] transition">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="flex gap-4 w-full lg:w-2/3 flex-col lg:flex-row items-stretch">
          <div className="flex-1">
            <img
              src={
                Array.isArray(product.images) && product.images[0]
                  ? typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0]?.url
                  : "/placeholder-product.jpg"
              }
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {product.images && product.images.length > 2 && (
            <div className="flex flex-col gap-4 h-full justify-between">
              {[1, 2].map((index) => {
                const image = product.images[index];
                return (
                  <img
                    key={index}
                    src={typeof image === "string" ? image : image?.url || "/placeholder-product.jpg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-1/2 object-cover rounded-lg border-2 border-transparent"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-14 rounded-3xl p-8 text-[#E3D5C5] w-full max-w-6xl">
        <h2 className="text-3xl font-serif font-bold mb-4">Reviews</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#E3D5C5] bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[#E3D5C5]">{review.userName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-[#E3D5C5] opacity-70">
                    {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <p className="text-[#E3D5C5]">{review.comment}</p>
                {review.status === 'pending' && (
                  <span className="text-xs text-yellow-400 mt-2 block">Pending approval</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-6">No reviews yet</p>
        )}

        <h3 className="text-2xl font-serif font-bold mb-4">Write a review</h3>
        
        {!currentUser && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Please log in to write a review.
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedRating(i + 1)}
              aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
              className="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-7 h-7"
                fill={i < selectedRating ? "#facc15" : "#ffffff"}
                stroke="#000000"
                strokeWidth="1"
              >
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmitReview}>
          <textarea
            placeholder="Write a review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full h-32 p-4 bg-[#E3D5C5] text-[#83715E] rounded-xl border border-[#bfa57f] focus:outline-none focus:border-[#3b332b] mb-4"
            required
          ></textarea>

          <button 
            type="submit"
            disabled={submittingReview || !currentUser}
            className="bg-[#D4B998] text-[#3b332b] w-full py-3 rounded-full font-semibold hover:bg-[#e1caa5] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {submittingReview ? (
              <>
                <div className="w-4 h-4 border-2 border-[#3b332b] border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-3 border-2 border-[#D4B998] text-[#E3D5C5] bg-transparent py-3 rounded-full font-semibold hover:bg-[#e1caa5] hover:text-[#3b332b] transition"
        >
          Cancel
        </button>
      </div>

    </div>
  );
};

export default Product;
