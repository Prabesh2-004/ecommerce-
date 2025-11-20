import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';

const List = ({token}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(backendUrl + '/api/product');
      setList(response.data.products);
    };
    fetchData();
  }, []);

  const handleDelete = async (_id) => {
    try {
      await axios.delete(backendUrl + `/api/product/${_id}`, {headers: {token}})
      setList(prevList => prevList.filter(item => item._id !== _id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='mt-20 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-200'>
            All Products
          </h1>
        </div>
        <div className='hidden md:grid grid-cols-[80px_1fr_150px_120px_100px] gap-4 items-center py-3 px-4 bg-gray-100 rounded-lg border border-gray-200 mb-2'>
          <b className='text-sm text-gray-700'>Image</b>
          <b className='text-sm text-gray-700'>Title</b>
          <b className='text-sm text-gray-700'>Category</b>
          <b className='text-sm text-gray-700'>Price</b>
          <b className='text-sm text-gray-700 text-center'>Action</b>
        </div>

        <div className='space-y-3'>
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
              >
                <div className='hidden md:grid grid-cols-[80px_1fr_150px_120px_100px] gap-4 items-center'>
                  <div className='w-16 h-16 rounded-md overflow-hidden bg-gray-100'>
                    <img
                      src={item.image[0]}
                      alt={item.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <p className='text-sm text-gray-800 truncate'>{item.title}</p>
                  <p className='text-sm text-gray-600'>{item.category}</p>
                  <p className='text-sm font-semibold text-gray-800'>
                    ${item.price}
                  </p>
                  <div className='flex justify-center'>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className='px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className='md:hidden space-y-3'>
                  <div className='flex gap-4'>
                    <div className='w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0'>
                      <img
                        src={item.image[0]}
                        alt={item.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-gray-800 mb-1 line-clamp-2'>
                        {item.title}
                      </h3>
                      <p className='text-sm text-gray-600 mb-1'>
                        {item.category}
                      </p>
                      <p className='text-lg font-bold text-gray-800'>
                        ${item.price}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className='w-full px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-12 bg-gray-50 rounded-lg border border-gray-200'>
              <p className='text-gray-500'>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;