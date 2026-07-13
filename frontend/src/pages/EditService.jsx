import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import PageTitle from "../components/PageTitle"
import Button from "../components/Button"
import Input from "../components/Input"

function EditService(){
    const [service,setService]=useState({})
    const [formData,setFormdata]=useState({
        "title":"",
        "description":"",
        "price":"",
        "duration":""
    })

    const navigate = useNavigate();

    const { id } = useParams()

    const servicedetail=async (e)=>{
        const res = await api.get(`/services/${id}`)
        setService(res.data.services);
        setFormdata({
            title: res.data.services.title,
            description: res.data.services.description,
            price: res.data.services.price,
            duration: res.data.services.duration_minutes
        });
    }

    useEffect(()=>{
        servicedetail();
    },[])

    const handleChange =(e)=>{
        setFormdata({
            ...formData,[e.target.name]:e.target.value
        });
    }
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const res = await api.put(`/services/${id}`,formData);
        navigate('/admin/dashboard');
        console.log(res.data)
    }
    return(
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
          <h2 clasName="dark-title">Edit Service</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
      />
        <br /><br />
        <Input
          label="Title"
          name="description"
          value={formData.description}
          onChange={handleChange}
      />
        <br/><br/>
        <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
        />
        <br /><br />
        <Input
            label="Duration"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
        />
        <br /><br />
        <Button type="submit">
    Update Service
</Button>
      </form>
    </div></div></div></div></div>
    )
}

export default EditService;