import React from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';


const Layout = ({ children, token, setToken }) => {
  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar token={token} setToken={setToken}/>
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 sm:ml-56 w-full'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout
