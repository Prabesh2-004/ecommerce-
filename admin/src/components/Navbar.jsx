import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ token, setToken }) => {
  const [open, setOpen] = React.useState(false);
  // const navigate  = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
  }
  
  return (
    <nav className='flex items-center fixed top-0 left-0 right-0 z-50 justify-between bg-[#0f172a] px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300'>
      <Link to='/add' className='text-2xl font-bold text-white flex items-baseline'>
        ShoppyWeb<p className='text-[12px] ml-1'>admin</p>
      </Link>

      {/* Desktop Menu */}
      <div className='hidden sm:flex items-center gap-8'>
        {token ? (
          <button 
            onClick={handleLogout} 
            className='cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full'
          >
            Logout
          </button>
        ) : (
          <button className='cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full'>
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label='Menu'
        className='sm:hidden text-white'
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className='absolute top-full left-0 w-full bg-[#1e293b] shadow-lg py-4 flex flex-col items-start gap-3 sm:hidden'>
          {token ? (
            <button 
              onClick={() => {
                handleLogout()
                setOpen(false);
              }} 
              className='cursor-pointer px-8 ml-5 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full'
            >
              Logout
            </button>
          ) : (
            <button className='cursor-pointer ml-5 px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full'>
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;