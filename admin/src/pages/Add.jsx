import React, { useState } from 'react';
import axios from 'axios'
import { backendUrl } from '../App';

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [details, setDetails] = useState({
    title: '',
    description: '',
    price: '',
  });

  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sizes, setSizes] = useState([]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();

        formData.append('title', details.title)
        formData.append('description', details.description)
        formData.append('price', details.price)
        formData.append('category', category)
        formData.append('subCategory', subCategory)
        sizes.forEach(size => formData.append("sizes[]", size));

        image1 && formData.append('image1', image1)
        image2 && formData.append('image2', image2)
        image3 && formData.append('image3', image3)
        image4 && formData.append('image4', image4)

        const   response = await axios.post(backendUrl + "/api/product/create", formData,{headers:{token}})

        if(response.data.success){
            setDetails({
                title: '',
                description: '',
                price: ''
            });
            setImage1(false);
            setImage2(false)
            setImage3(false)
            setImage4(false)
        }

    } catch (error) {
        console.error(error);
        
    }
  }

  return (
    <div className='w-full px-4 mb-10 md:px-5 mt-20 md:w-[calc(100%-250px)]'>
      <form action='#' className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <p className='text-xl'>Upload Image</p>
        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5'>
          <label
            htmlFor='fileInput1'
            className='border bg-white rounded-md text-sm w-full max-w-[280px] mx-auto border-indigo-600/60 p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-indigo-500 transition'
          >
            {!image1 ? (
              <div>
                {' '}
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 44 44'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667'
                    stroke='#2563EB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='text-gray-500'>Drag & drop your files here</p>
                <p className='text-gray-400'>
                  Or <span className='text-indigo-500 underline'>click</span> to
                  upload
                </p>
              </div>
            ) : (
              <img src={URL.createObjectURL(image1)} alt='image1' />
            )}
            ;
            <input
              id='fileInput1'
              type='file'
              className='hidden'
              onChange={(e) => setImage1(e.target.files[0])}
            />
          </label>

          <label
            htmlFor='fileInput2'
            className='border bg-white rounded-md text-sm w-full max-w-[280px] mx-auto border-indigo-600/60 p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-indigo-500 transition'
          >
            {!image2 ? (
              <div>
                {' '}
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 44 44'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667'
                    stroke='#2563EB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='text-gray-500'>Drag & drop your files here</p>
                <p className='text-gray-400'>
                  Or <span className='text-indigo-500 underline'>click</span> to
                  upload
                </p>
              </div>
            ) : (
              <img src={URL.createObjectURL(image2)} alt='image1' />
            )}
            ;
            <input
              id='fileInput2'
              type='file'
              className='hidden'
              onChange={(e) => setImage2(e.target.files[0])}
            />
          </label>

          <label
            htmlFor='fileInput3'
            className='border bg-white rounded-md text-sm w-full max-w-[280px] mx-auto border-indigo-600/60 p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-indigo-500 transition'
          >
            {!image3 ? (
              <div>
                {' '}
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 44 44'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667'
                    stroke='#2563EB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='text-gray-500'>Drag & drop your files here</p>
                <p className='text-gray-400'>
                  Or <span className='text-indigo-500 underline'>click</span> to
                  upload
                </p>
              </div>
            ) : (
              <img src={URL.createObjectURL(image3)} alt='image3' />
            )}
            ;
            <input
              id='fileInput3'
              type='file'
              className='hidden'
              onChange={(e) => setImage3(e.target.files[0])}
            />
          </label>

          <label
            htmlFor='fileInput4'
            className='border bg-white rounded-md text-sm w-full max-w-[280px] mx-auto border-indigo-600/60 p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-indigo-500 transition'
          >
            {!image4 ? (
              <div>
                {' '}
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 44 44'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667'
                    stroke='#2563EB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <p className='text-gray-500'>Drag & drop your files here</p>
                <p className='text-gray-400'>
                  Or <span className='text-indigo-500 underline'>click</span> to
                  upload
                </p>
              </div>
            ) : (
              <img src={URL.createObjectURL(image4)} alt='image4' />
            )}
            ;
            <input
              id='fileInput4'
              type='file'
              className='hidden'
              onChange={(e) => setImage4(e.target.files[0])}
            />
          </label>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='name'>Product Name: </label>
          <input
            type='text'
            placeholder='Product Name'
            id='name'
            value={details.title}
            onChange={handleChange}
            name='title'
            className='p-2'
            required
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='description'>Product Description: </label>
          <textarea
            placeholder='Product Description'
            id='description'
            value={details.description}
            onChange={handleChange}
            name='description'
            className='p-2'
            required
          />
        </div>
        <div className='grid gap-5 md:flex'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='category'>Category: </label>
            <select className='p-2' onChange={(e)=> setCategory(e.target.value)}>
              <option value='men'>Men</option>
              <option value='women'>Women</option>
              <option value='kid'>Kid</option>
            </select>
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='subcategory'>SubCategory: </label>
            <select className='p-2' onChange={(e)=> setSubCategory(e.target.value)}>
              <option value='top'>Top Wear</option>
              <option value='bottom'>Bottom Wear</option>
              <option value='winter'>Winter Wear</option>
              <option value='summer'>Summer Wear</option>
            </select>
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='price'>Product Price: </label>
            <input
              type='number'
              placeholder='Product price'
              id='price'
              value={details.price}
              onChange={handleChange}
              name='price'
              className='p-2'
              required
            />
          </div>
        </div>
        <div>
          <p>Product Size: </p>
          <div className='grid gap-3 sm:flex'>
            <div onClick={()=>setSizes(prev => prev.includes('S') ? prev.filter(item => item !== 'S') : [...prev, 'S'])} className={` ${sizes.includes('S') ? 'border' : 'border-0'} p-2 px-3 cursor-pointer bg-[#0f172a] `}>
              <p>S</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('M') ? prev.filter(item => item !== 'M') : [...prev, 'M'])} className={` ${sizes.includes('M') ? 'border' : 'border-0'} p-2 px-3 cursor-pointer bg-[#0f172a] `}>
              <p>M</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('L') ? prev.filter(item => item !== 'L') : [...prev, 'L'])} className={` ${sizes.includes('L') ? 'border' : 'border-0'} p-2 px-3 cursor-pointer bg-[#0f172a] `}>
              <p>L</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('XL') ? prev.filter(item => item !== 'XL') : [...prev, 'XL'])} className={` ${sizes.includes('XL') ? 'border' : 'border-0'} p-2 px-3 cursor-pointer bg-[#0f172a] `}>
              <p>XL</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('XXL') ? prev.filter(item => item !== 'XXL') : [...prev, 'XXL'])} className={` ${sizes.includes('XXL') ? 'border' : 'border-0'} p-2 px-3 cursor-pointer bg-[#0f172a] `}>
              <p>XXL</p>
            </div>
          </div>
        </div>
        <div className='relative group overflow-hidden bg-white/20 p-0.5 h-9 w-20 rounded-md active:scale-100 hover:scale-105 transition-all duration-300'>
          <button className='text-white text-sm bg-linear-to-t from-black/50 to-black h-full w-full rounded cursor-pointer'>
            ADD
          </button>
          <div className='absolute -bottom-12 group-hover:-bottom-10 transition-all duration-200 left-1/2 -z-10 -translate-x-1/2 blur size-14 rounded-full bg-white'></div>
        </div>
      </form>
    </div>
  );
};

export default Add;
