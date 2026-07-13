import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardRoute } from "../helper/auth";
import Button from "../components/Button";
import logo from "../assets/astro1.jpg"

function Login(){
    const [FormaData,setFormData] = useState({
        "email":'',
        "password":''
    });

    const navigate = useNavigate();
    const handleChange=(e)=>{
            setFormData({
                ...FormaData,[e.target.name]:e.target.value
            })
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
        try{
            const res = await api.post("/login",FormaData);
            localStorage.setItem('access_token',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));
            navigate(getDashboardRoute());
            console.log(res.data);
        }catch(err){
            console.log(err.response?.data);
        }
    }

    return(
<div className="auth-bg min-vh-100 d-flex flex-column justify-content-center align-items-center">      
                  <img src="/astrofav.png" className="mb-2 auth-logo" style={{width:150,height:120}}/>

         
          <div className="row justify-content-center">
            
            <div className="col-md-12">
     <div className="card shadow-lg border-0 auth-card">
     
      <div className="card-body">
          <h2 className="dark-title">Login</h2>
      <form onSubmit={handleSubmit}>
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange} required
        />


        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange} required
        />
     
        <Button type="submit">
          Login
        </Button>
          <p className="mt-3 text-center">
    Don't have an account?
    <Link to="/register" className="ms-1">
        Register
    </Link>
</p>
      </form>
    </div></div></div></div></div>
    )

}

export default Login;