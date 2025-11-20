import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + '/api/product/admin',
        formData
      );
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='w-[calc(100vw - 20px)] mt-[72.8px] h-[calc(100vh-72.8px)] flex justify-center items-center bg-slate-900'>
        <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

        <div className='flex flex-col justify-center w-full max-w-80 rounded-xl px-6 py-8 border border-slate-700 bg-slate-900 text-white text-sm'>
          <h2 className='text-2xl font-semibold text-center'>Admin Panel</h2>
          <p className='text-slate-300 mt-1 text-center'>
            Login to Admin Panel
          </p>
          <form className='mt-8' onSubmit={handleSubmit}>
            <label
              htmlFor='email'
              className='block mb-1 font-medium text-slate-300'
            >
              Email address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
              className='w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500'
            />

            <label
              htmlFor='password'
              className='block mb-1 font-medium text-slate-300'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              className='w-full p-2 mb-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500'
            />
            <button
              type='submit'
              className='w-full mt-10 px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
