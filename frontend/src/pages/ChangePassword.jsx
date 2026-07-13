import React, { useEffect, useState } from 'react'
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

export default function ChangePassword() {

  const [message,setMessage]=useState('')
  const [formData,setFormdata]=useState({
        "name" : "",
        "email" : "",
  })
  const navigate = useNavigate();
  const handleChange =(e)=>{
        setFormdata({
            ...formData,[e.target.name]:e.target.value
        });
  };
  
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
          const res = await api.put("/updatePassword",formData);
          setMessage('Password Changed')
          console.log(res);
        }catch (err) {
            console.log(err.response?.data);
            //alert(JSON.stringify(err.response?.data));
        }

    }
  return (
    <div className="container-mt-5">
          <div className="row justify-content-center">
            <div className="col-md-5">
     <div className="card">
      <div className="card-body">
           <h2 className='dark-title'>Change Password</h2>
      <h4 id="message" className="text-danger">{message}</h4>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="oldpassword"
          placeholder="Old Password"
          onChange={handleChange}
          className="form-control mb-3"
          label="Old Password"
       required />
        <Input
          type="text"
          name="newpassword"
          placeholder="New Password"
          className="form-control mb-3"
          label="New Password"
          onChange={handleChange}
       required />
        <Input
          type="text"
          name="confirmpassword"
          placeholder="Confirm Password"
          className="form-control mb-3"
          label="Confirm Password"
          onChange={handleChange}
       required />
        <Button type="submit">
          Update
        </Button>
      </form>
    </div></div></div></div></div>
  )
}
