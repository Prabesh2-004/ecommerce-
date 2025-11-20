import { ChevronDown } from 'lucide-react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const Navbar = ({ user, setUser }) => {
  const [open, setOpen] = React.useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <nav className='flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all'>
      <Link to='/' className='text-2xl font-bold'>
        ShoppyWeb
      </Link>
      <div className='hidden sm:flex items-center gap-8'>
        <NavLink className='p-2' to='/'>
          Home
        </NavLink>
        <NavLink className='p-2' to='/product'>
          product
        </NavLink>
        <NavLink className='p-2' to='/about'>
          About
        </NavLink>
        <NavLink className='p-2' to='/contact'>
          Contact
        </NavLink>

        <div className='hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full'>
          <input
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            type='text'
            placeholder='Search products'
          />
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10.836 10.615 15 14.695'
              stroke='#7A7B7D'
              strokeWidth='1.2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              clipRule='evenodd'
              d='M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783'
              stroke='#7A7B7D'
              strokeWidth='1.2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <Link to='/cart'>
          <div className='relative cursor-pointer'>
            <svg
              width='18'
              height='18'
              viewBox='0 0 14 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0'
                stroke='#615fff'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <button className='absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full'>
              {totalItems}
            </button>
          </div>
        </Link>
        {user ? (
          <div>
            <button
              onClick={() => setOpen(!open)}
              className='flex items-center gap-3 py-2 px-2 cursor-pointer mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm'
            >
              <img className='h-8 w-8 rounded-full' src={user.user.avatar} alt='' />
              <span className='flex gap-2'>
                {user.user.username} <ChevronDown />
              </span>
            </button>

            {open && (
              <ul className='absolute bg-white p-3 top-20 right-30 rounded-2xl text-black flex flex-col gap-3 shadow-2xl'>
                <li>
                  <Link to='#'>Profile</Link>
                </li>
                <li>
                  <button
                    className='py-2 px-3 bg-indigo-500 text-white cursor-pointer font-bold rounded-2xl'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link to='/login'>
            <button className='cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full'>
              Login
            </button>
          </Link>
        )}
      </div>
      <button
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        aria-label='Menu'
        className='sm:hidden'
      >
        {/* Menu Icon SVG */}
        <svg
          width='21'
          height='15'
          viewBox='0 0 21 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect width='21' height='1.5' rx='.75' fill='#426287' />
          <rect x='8' y='6' width='13' height='1.5' rx='.75' fill='#426287' />
          <rect x='6' y='13' width='15' height='1.5' rx='.75' fill='#426287' />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? 'flex' : 'hidden'
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <a href='#' className='block'>
          Home
        </a>
        <a href='#' className='block'>
          About
        </a>
        <a href='#' className='block'>
          Contact
        </a>
        {user ? (
          <button className='cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm'>
            Logout
          </button>
        ) : (
          <button className='cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm'>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
