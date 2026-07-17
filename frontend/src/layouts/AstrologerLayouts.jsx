import React from 'react'
import { Outlet } from 'react-router-dom'
import AstrologerNavbar from '../components/Navbar/AstrologerNavbar'
import AstrologerSidebar from '../components/Sidebar/AstrologerSidebar'
import Footer from '../components/Footer'

export default function AstrologerLayouts() {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <AstrologerSidebar />
        </div>
        <div className='col-md-9'>
          <AstrologerNavbar/>
            <div className='p-4'>
              <Outlet/>
            </div>
            <Footer/>
        </div>
      </div>
    </div>
  )
}
