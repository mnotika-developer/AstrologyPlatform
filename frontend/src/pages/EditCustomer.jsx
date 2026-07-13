import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate, useParams } from "react-router-dom"
import { getAppointmentRoute, getUser } from "../helper/auth"
import Input from "../components/Input"
import Button from "../components/Button"

function EditCustomer(){
    const [formData,setFormdata]=useState({
		"name":"",
		"email":"",
        "role":"",
    })
    const user = getUser();
    const { id } = useParams()
    const navigate = useNavigate()
    const getCustomer = async (e)=>{
        const res = await api.get(`/users/${id}`)
        setFormdata({
            "name":res.data.data.name,
            "email":res.data.data.email,
            "role":res.data.data.role
        });
       // console.log(res.data.data)
    }
    const handleChange=(e)=>{
        setFormdata({
            ...formData,[e.target.name]:e.target.value
        })
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const res =await api.put(`/users/${id}`,formData)
        navigate('/admin/customers');
    }
    useEffect(()=>{
        getCustomer();
    },[])

   
    return(
       <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
           <h2 className="dark-title">Edit Customer/Astrologer</h2>
           <Button onClick={()=>navigate('/admin/customers')} className='mb-3'>Back</Button>
           
    <form onSubmit={handleSubmit}>
        <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Customer Name"
            required
        />
        <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            required
        />
        <label className="form-label d-block text-start mb-3">Select Role</label>
        <select
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled
        >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="astrologer">Astrologer</option>
        </select>
        <Button type="submit" className="mt-2">
            Update Customer
        </Button>
    </form>
</div></div></div></div></div>
    )
}
export default EditCustomer;