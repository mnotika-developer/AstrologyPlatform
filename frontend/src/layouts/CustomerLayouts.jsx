import React from 'react'
import { Outlet } from "react-router-dom";
import Footer from "../components/Common/Footer";
import CustomerNavbar from "../components/Navbar/CustomerNavbar";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import { getUser } from "../helper/auth";

export default function CustomerLayouts() {

  const user = getUser();
  return (
    <div className='container-fluid p-0 min-vh-100 d-flex flex-column'>
      <div className="row g-0 flex-grow-1">
           <div className='col-md-3 col-lg-2'>
              <CustomerSidebar/>
           </div>
           <div className='col-md-9 col-lg-10 d-flex flex-column'>
            <CustomerNavbar/>

            <div className='p-4 flex-grow-1'>
                <Outlet/>
            </div>
            <Footer/>
             </div></div></div>
  )
}
