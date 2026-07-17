import { useState } from 'react'
import { BrowserRouter,Route,Routes } from "react-router-dom"
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Services from './pages/Services.jsx'
import CreateService from './pages/CreateService.jsx'
import EditService from './pages/EditService.jsx'
import AppointmentList from './pages/AppointmentsList.jsx'
import CreateAppointment from './pages/CreateAppointment.jsx'
import EditAppointment from './pages/EditAppointment.jsx'
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import AstroDashboard from './pages/AstroDashboard.jsx'
import CustomerLayouts from './layouts/CustomerLayouts.jsx'
import AdminLayouts from './layouts/AdminLayouts.jsx'
import AstrologerLayouts from './layouts/AstrologerLayouts.jsx'
import Profile from './pages/Profile.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import CustomerList from './pages/CustomerList.jsx'
import EditCustomer from './pages/EditCustomer.jsx'
import AddCustomer from './pages/AddCustomer.jsx'
import SlotList from './pages/SlotList.jsx'
import CreateSlot from './pages/CreateSlot.jsx'
import EditSlot from './pages/EditSlot.jsx'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      
      <Route element={
        <ProtectedRoute role="astrologer">
          <AstrologerLayouts />
        </ProtectedRoute>
      }>
        <Route path="/astro/dashboard" element={
            <AstroDashboard/>
        }/>
        <Route path="/astro/appointments" element={
            <AppointmentList/>
        }/>
        <Route path="/astro/slots" element={
            <SlotList/>
        }/>
       <Route path="/astro/addslot" element={
            <CreateSlot/>
        }/>
         <Route path="/astro/slot/edit/:id" element={
            <EditSlot/>
        }/>
        <Route path="/astro/profile" element={
            <Profile/>
        }/>
      </Route>
      <Route element={
        <ProtectedRoute  role="admin">
            <AdminLayouts/>
        </ProtectedRoute>
          }>
      <Route path="/admin/dashboard" element={
          <Dashboard/>
      }/>
      <Route path="/admin/services" element={
          <Services/>
      }/>
      <Route path="/admin/addservices" element={
          <CreateService/>
      }/>
      <Route path="/admin/services/edit/:id" element={
          <EditService/>
      }/>
      <Route
        path="/admin/profile"
        element={<Profile/>}
    />
      <Route
        path="/admin/changepassword"
        element={<ChangePassword/>}
    />
      <Route
        path="/admin/appointments"
        element={<AppointmentList />}
    />
     <Route
        path="/admin/customers"
        element={<CustomerList />}
    />
    <Route
        path="/admin/addcustomer"
        element={<AddCustomer />}
    />
    <Route
        path="/admin/addappointments"
        element={<CreateAppointment />}
    />
    <Route path="/admin/appointment/edit/:id" element={
          <EditAppointment/>
       }/>
    <Route path="/admin/customer/edit/:id" element={
          <EditCustomer/>
       }/>
      </Route>
       <Route
        element={
            <ProtectedRoute role="customer">
                <CustomerLayouts />
            </ProtectedRoute>
        }
    >

    <Route
        path="/customer/dashboard"
        element={<CustomerDashboard />}
    />

    <Route
        path="/customer/profile"
        element={<Profile/>}
    />
    <Route
        path="/customer/changepassword"
        element={<ChangePassword/>}
    />

    <Route
        path="/customer/appointments"
        element={<AppointmentList />}
    />
    <Route
        path="/customer/addappointments"
        element={<CreateAppointment />}
    />
    <Route path="/customer/appointment/edit/:id" element={
        <EditAppointment/>
       }/>
  </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
