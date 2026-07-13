import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Register(){
    const [FormData, setFormData] = useState({
        "name" : "",
        "email" : "",
        "password" : "",
        "password_confirmation" : "",
        "role" : "",
    });
    const navigate = useNavigate();
    const handleChange =(e)=>{
        setFormData({
            ...FormData,[e.target.name]:e.target.value
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const res = await api.post("/register",FormData);
            localStorage.setItem('access_token',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));
            navigate(getDashboardRoute());
            console.log(res.data);
        }catch (err) {
            console.log(err.response?.data);
            //alert(JSON.stringify(err.response?.data));
        }

    }

    return (
<div className="auth-bg min-vh-100 d-flex flex-column justify-content-center align-items-center">      
  <img src="/astrofav.png" className="img-fluid mb-2 auth-logo" style={{width:150,height:120}}/>   
          <div className="row justify-content-center">
            <div className="col-md-12">
     <div className="card shadow-lg border-0 auth-card">
      <div className="card-body">
 <h2 className="dark-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <Button type="submit">
          Register
        </Button>
        <p className="mt-3 text-center">
    Already have an account?
    <Link to="/" className="ms-1">
        Login
    </Link>
</p>
      </form>
    </div>
    </div></div></div></div>
  );
}

export default Register;