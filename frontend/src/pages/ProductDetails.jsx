import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError('');
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError('Please select a size');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      await addToCart(product._id, selectedSize);
    }
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    setSelectedSize(null);
    setQuantity(1);
  };

  return (
    <div className='flex justify-center m-20'>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {showSuccess && (
        <div className='fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'>
          <div className='flex items-center'>
            <svg className='w-6 h-6 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            Product added to cart successfully!
          </div>
        </div>
      )}

      <div className='flex flex-col md:flex-row bg-white shadow-md w-3xl max-md:max-w-80'>
        <img
          className='w-80 md:w-64 h-96 object-cover object-top'
          src={product.image[0]}
          alt={product.title}
        />
        <div className='p-5'>
          <div className='flex items-center justify-between'>
            <h3 className='text-2xl font-medium text-slate-800'>{product.title}</h3>
            {product.bestSeller && (
              <span className='ml-5 px-3 py-1 bg-red-500 text-white rounded text-sm'>
                BEST SELLER
              </span>
            )}
          </div>
          <p className='max-w-xs text-sm mt-2 text-slate-500'>{product.description}</p>
          <p className='text-xl font-medium text-slate-800 mt-4'>$ {product.price}</p>

          <div className='mb-6 mt-5'>
            <label className='block text-sm font-semibold text-gray-700 mb-3'>
              Select Size: <span className='text-red-500'>*</span>
            </label>
            <div className='flex flex-wrap gap-3'>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && <p className='text-red-500 text-sm mt-2'>{sizeError}</p>}
          </div>

          <div className='mb-5'>
            <label className='block text-sm font-semibold text-gray-700 mb-3'>
              Quantity:
            </label>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => handleQuantityChange(-1)}
                className='w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center font-bold text-lg'
              >
                −
              </button>
              <input
                type='number'
                value={quantity}
                readOnly
                className='w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-medium'
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className='w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center font-bold text-lg'
              >
                +
              </button>
            </div>
          </div>

          <div className='flex gap-3'>
            <button 
              onClick={handleAddToCart}
              className='flex-1 px-8 py-2 cursor-pointer bg-slate-800 hover:bg-slate-700 hover:shadow-lg transition-all text-white uppercase font-medium'
            >
              Add to cart
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className='px-6 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all text-white uppercase font-medium'
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;