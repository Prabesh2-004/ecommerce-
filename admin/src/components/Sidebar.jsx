import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { List, Plus, ShoppingBag } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className='w-0 mt-[72.8px] md:w-56'>
      <aside
        id='default-sidebar'
        className='fixed left-0 z-40 w-56 h-full transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default'>
          <ul className='space-y-2 font-medium'>
            <li>
              <NavLink
                to='/add'
                className='flex hover:bg-slate-900 rounded-xl items-center justify-end px-2 py-3 text-body hover:bg-neutral-tertiary hover:text-fg-brand group'
              >
                <span className='ms-3 flex gap-3'>Add <Plus /></span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/'
                className='flex hover:bg-slate-900 rounded-xl items-center justify-end px-2 py-3 text-body hover:bg-neutral-tertiary hover:text-fg-brand group'
              >
                <span className='ms-3 flex gap-3'>List <List /></span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/order'
                className='flex hover:bg-slate-900 rounded-xl items-center justify-end px-2 py-3 text-body hover:bg-neutral-tertiary hover:text-fg-brand group'
              >
                
                <span className='ms-3 flex gap-3'>Order <ShoppingBag /></span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
