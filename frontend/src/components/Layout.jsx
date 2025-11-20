import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, user, setUser}) => {
  const location = useLocation()
  
  const hideFooterRoutes = ['/login', '/register']
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      {children}
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout