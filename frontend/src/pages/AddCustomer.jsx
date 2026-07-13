import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input';
import Button from '../components/Button';

export default function AddCustomer() {

    const [formdata,setformdata]=useState({
        "name":'',
        "email":'',
        "password":'',
        "role":'',
    })
    const navigate = useNavigate();
    const handleChange=(e)=>{
        setformdata({
            ...formdata,[e.target.name]:e.target.value
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const res = await api.post('/users',formdata)
        console.log('Customer Added Successfully');
        navigate('/admin/customers')
        console.log(res.data.data);
    }
  return (
    
       <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
           <h2 className="dark-title">Add Customer/Astrologer</h2>
<Button onClick={()=>navigate('/admin/customers')} className='mb-3'>Back</Button>
           
    <form onSubmit={handleSubmit}>
        <Input
            type="text"
            name="name"
            onChange={handleChange}
            label="Customer Name"
            required
        />
        <Input
            type="email"
            name="email"
            onChange={handleChange}
            label="Email"
            required
        />
        <Input
            type="password"
            name="password"
            onChange={handleChange}
            label="Password"
            required
        />
        <label className="form-label d-block text-start mb-3">Select Role</label>
        <select
            className="form-control"
            name="role"
            onChange={handleChange}
        >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="astrologer">Astrologer</option>
        </select>
        <Button type="submit">
            Submit
        </Button>
    </form>
</div></div></div></div></div>
  )
}
