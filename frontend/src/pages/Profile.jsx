import React, { useEffect, useState } from 'react'
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Profile() {

  const [message,setMessage]=useState('')
  const [passmsg,setPassMessage]=useState('')
  const [formData,setFormdata]=useState({
        "name" : "",
        "email" : "",
  })
  const [password,setNewPassword]=useState({})
  const navigate = useNavigate();
  const handleChange =(e)=>{
        setFormdata({
            ...formData,[e.target.name]:e.target.value
        });
  };
  const handlePasswordChange =(e)=>{
        setNewPassword({
            ...password,[e.target.name]:e.target.value
        });
  };
  const getProfile = async (e)=>{
    const res = await api.get('/profile');

    setFormdata({
        "name" : res.data.data.name,
        "email" : res.data.data.email
    });
    console.log(res);
  }

  useEffect(()=>{
    getProfile();
  },[])
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
          const res = await api.put("/profile",formData);
          getProfile();
          setMessage('Profile Updated')
          console.log(res);
        }catch (err) {
            console.log(err.response?.data);
            //alert(JSON.stringify(err.response?.data));
        }

    }
    const handlePasswordSubmit = async (e)=>{
        e.preventDefault();
        try{
          const res = await api.put("/updatepassword",password);
          setPassMessage('Password Changed')
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
           <h2 className='dark-title'>My Profile</h2>
      <h4 id="message" className="text-danger">{message}</h4>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
       required />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
       required />

        <Button type="submit">
          Update
        </Button>
      </form>
    </div></div></div>
    <div className="col-md-5">
     <div className="card">
      <div className="card-body">
           <h2 className='dark-title'>Change Password</h2>
      <h4 id="message" className="text-danger">{passmsg}</h4>
      <form onSubmit={handlePasswordSubmit}>
        <Input
          type="password"
          name="oldpassword"
          placeholder="Old Password"
          onChange={handlePasswordChange}
       required />
        <Input
          type="password"
          name="newpassword"
          placeholder="New Password"
          onChange={handlePasswordChange}
       required />
        <Input
          type="password"
          name="confirmpassword"
          placeholder="Confirm Password"
          onChange={handlePasswordChange}
       required />
        <Button type="submit">
          Update
        </Button>
      </form>
    </div></div></div>
    
    </div></div>
  )
}
