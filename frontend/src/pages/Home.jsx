import React, { useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ product }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate('/product');
  };
  const productPerPage = 4;
  const pageVisited = pageNumber * productPerPage;
  const displayProducts = product
    .slice(pageVisited, pageVisited + productPerPage)
    .map((products) => (
      <div
        key={products._id}
        className='bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group'
      >
        <div className='relative'>
          <div className='text-8xl flex items-center justify-center bg-white'>
            <img src={products.image[0]} alt={products.title} />
          </div>
          <button className='absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition'>
            <Heart size={20} className='text-gray-600' />
          </button>
        </div>
        <div className='p-4'>
          <h4 className='font-semibold text-gray-800 mb-2'>{products.title}</h4>
          <div className='flex items-center justify-between'>
            <span className='text-2xl font-bold text-indigo-600'>
              Rs{products.price}
            </span>
            <button onClick={() => navigate('/product')} className='bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    ));

  return (
    <div className='min-h-screen bg-gray-50'>
      <section
        style={{ backgroundImage: "url('../../about_bg.jpeg')" }}
        className='bg-no-repeat bg-cover bg-linear-to-r from-indigo-600 to-purple-600 text-white py-20'
      >
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <h2 className='text-5xl font-bold mb-4'>Summer Sale is Here!</h2>
            <p className='text-xl mb-8'>
              Get up to 50% off on selected items. Limited time offer!
            </p>
            <button
              onClick={navigateTo}
              className='bg-white cursor-pointer text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center'
            >
              Shop Now <ChevronRight className='ml-2' size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center mb-8'>
            <h3 className='text-3xl font-bold text-gray-800'>
              Featured Products
            </h3>
            <Link
              to='/product'
              className='text-indigo-600 font-semibold hover:underline flex items-center'
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {displayProducts}
          </div>
        </div>
      </section>

      <section className='py-16 bg-linear-to-r from-pink-500 to-orange-500'>
        <div className='container mx-auto px-4 text-center text-white'>
          <h3 className='text-4xl font-bold mb-4'>Join Our Newsletter</h3>
          <p className='text-xl mb-8'>
            Get exclusive deals and updates straight to your inbox!
          </p>
          <div className='flex max-w-md mx-auto'>
            <input
              type='email'
              placeholder='Enter your email'
              className='flex-1 border px-4 py-3 rounded-l-lg focus:outline-none text-gray-800'
            />
            <button className='bg-gray-800 text-white px-6 py-3 rounded-r-lg hover:bg-gray-900 transition'>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
