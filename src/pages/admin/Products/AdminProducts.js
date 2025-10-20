import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../../config/firebase';
import { useNotification } from '../../../contexts/NotificationContext';
import { useConfirmation } from '../../../contexts/ConfirmationContext';

const AdminProducts = () => {
  const { showSuccess, showError } = useNotification();
  const { showConfirmation } = useConfirmation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort products: expired and out-of-stock first, then by name
        const sortedProducts = productsData.sort((a, b) => {
          const now = new Date();
          
          // Check if products are expired
          const aExpired = a.expiryDate && new Date(a.expiryDate) < now;
          const bExpired = b.expiryDate && new Date(b.expiryDate) < now;
          
          // Check if products are out of stock
          const aOutOfStock = a.stockQuantity <= 0;
          const bOutOfStock = b.stockQuantity <= 0;
          
          // Priority 1: Expired products first
          if (aExpired && !bExpired) return -1;
          if (!aExpired && bExpired) return 1;
          
          // Priority 2: Out of stock products (but not expired)
          if (!aExpired && !bExpired) {
            if (aOutOfStock && !bOutOfStock) return -1;
            if (!aOutOfStock && bOutOfStock) return 1;
          }
          
          // Priority 3: Sort by name alphabetically
          return (a.name || '').localeCompare(b.name || '');
        });
        
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (product) => {
    const confirmed = await showConfirmation({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone and will remove the product from the store permanently.`,
      confirmText: 'Yes, Delete Product',
      cancelText: 'Keep Product',
      type: 'danger'
    });

    if (!confirmed) return;

    setDeletingProduct(product.id);
    
    try {
      await deleteDoc(doc(db, 'products', product.id));
      setProducts(products.filter(p => p.id !== product.id));
      showSuccess(`Product "${product.name}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product. Please try again.');
    } finally {
      setDeletingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-products">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product inventory.</p>
          </div>
          <Link
            to="/admin/add-product"
            className="bg-[#DDBB92] text-[#2B2A29] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
          >
            Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Products</h2>
        </div>
        
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const now = new Date();
                  const isExpired = product.expiryDate && new Date(product.expiryDate) < now;
                  const isOutOfStock = product.stockQuantity <= 0;
                  
                  return (
                  <tr key={product.id} className={`hover:bg-gray-50 ${isExpired ? 'bg-red-50' : isOutOfStock ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={(Array.isArray(product.images) && (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)) || '/placeholder-product.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                        </span>
                        {isExpired && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            EXPIRED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/product/${product.id}`}
                          className="text-[#DDBB92] hover:text-[#B8A082]"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProduct === product.id}
                          className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {deletingProduct === product.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
