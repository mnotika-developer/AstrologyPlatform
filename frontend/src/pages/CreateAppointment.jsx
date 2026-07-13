import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"

function CreateAppointment(){
    const [formData,setFormData]=useState({
		"service_id":"",
		"meeting_type":"",
		"appointment_date":"",
		"appointment_time":"",
		"customer_notes":""

    })
    const [users,setUsers]=useState([])
    const [services,setServices]=useState([])
    const navigate = useNavigate()

    const handleChange=(e)=>{
        setFormData({
            ...formData,[e.target.name]:e.target.value
        })
    }
    const getusers=async (e)=>{
        const userdata = await api.get('/userlist');
        console.log(userdata)
        setUsers(userdata.data.users);
    }
    const getservices=async (e)=>{
        const services = await api.get('/services');
        console.log(services)
        setServices(services.data.services);
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const res = await api.post('/appointments',formData)
        console.log(res.data);
        navigate('/appointments')
    }
    useEffect(()=>{
        getusers();
        getservices();
    },[])
    return(
      <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
         <h2 className="dark-title">Book Appointment</h2>
    <form onSubmit={handleSubmit}>
        <label className="d-block text-start">Service</label><br />
        <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            class="form-control"
            required
        >
            <option value="">Select Service</option>
            {services.map((service)=>(
                <option key={service.id} value={service.id}>{service.title}</option>
            ))}
        </select>

        <br /><br />

        <label className="d-block text-start">Meeting Type</label><br />
        <select
            name="meeting_type"
            class="form-control"
            value={formData.meeting_type}
            onChange={handleChange}
            required
        >
            <option value="">Select Meeting Type</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
        </select>

        <br /><br />

        <Input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            label="Appointment Date"
            onChange={handleChange}
            required
        />

        <br /><br />

        <Input
            type="time"
            name="appointment_time"
            value={formData.appointment_time}
            label="Appointment Time"
            onChange={handleChange}
            required
        />

        <br /><br />

        <label className="d-block text-start">Customer Notes</label><br />
        <textarea
            name="customer_notes"
            rows="4"
            cols="40"
            value={formData.customer_notes}
            onChange={handleChange}
            class="form-control"
        ></textarea>

        <br /><br />

        <Button type="submit">
            Book Appointment
        </Button>

    </form>
</div></div></div></div></div>
    )
}
export default CreateAppointment;