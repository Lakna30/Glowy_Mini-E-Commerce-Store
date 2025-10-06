import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useCart } from "../../../contexts/CartContext";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);

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
        <h1 className="text-2xl font-domine font-bold mb-4">
          Product not found
        </h1>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#D4B998] text-[#3b332b] px-6 py-3 rounded-lg font-semibold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#484139] min-h-screen flex flex-col items-center text-[#D4B998] font-domine px-6 py-10">
      {/* Centered container */}
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-12 items-stretch justify-between max-h-[600px]">
        {/* Product Info */}
        <div className="bg-[#D4B998] text-[#3b332b] rounded-3xl p-8 shadow-xl w-full lg:w-1/3 flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg mb-4">
            {product.description || "No description available."}
          </p>

          <div className="text-3xl font-bold mb-4">
            LKR {product.price?.toFixed(2)}
          </div>

          <div className="flex items-center gap-1 mb-6">
            {(() => {
              const displayRating = Math.round(
                Number(product?.rating ?? product?.avgRating ?? 0)
              );
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

          <div className="flex gap-4 mt-auto">
            <button
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="bg-[#3b332b] text-[#D4B998] px-8 py-3 rounded-full font-semibold hover:bg-[#2e2821] transition"
            >
              Buy Now
            </button>
            <button className="border-2 border-[#3b332b] bg-[#D4B998] text-[#3b332b] p-3 rounded-full hover:bg-[#e1caa5] transition">
              🛒
            </button>
            <button className="border-2 border-[#3b332b] bg-[#D4B998] text-[#3b332b] p-3 rounded-full hover:bg-[#e1caa5] transition">
              ♥
            </button>
          </div>
        </div>

        {/* Product Images */}
        <div className="flex gap-4 w-full lg:w-2/3 flex-col lg:flex-row items-stretch">
          {/* Main image */}
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

          {/* Thumbnails: only image index 1 & 2 */}
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
        <p className="mb-6">No reviews</p>

        <h3 className="text-2xl font-serif font-bold mb-4">Write a review</h3>

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

        <textarea
          placeholder="Write a review"
          className="w-full h-32 p-4 bg-[#E3D5C5] text-[#83715E] rounded-xl border border-[#bfa57f] focus:outline-none focus:border-[#3b332b] mb-4"
        ></textarea>

        <button className="bg-[#D4B998] text-[#3b332b] w-full py-3 rounded-full font-semibold hover:bg-[#e1caa5] transition">
          Submit
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-3 border-2 border-[#3b332b] text-[#3b332b] bg-transparent py-3 rounded-full font-semibold hover:bg-[#e1caa5] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Product;
