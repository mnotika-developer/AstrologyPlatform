import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate, useParams } from "react-router-dom"
import { getAppointmentRoute, getUser } from "../helper/auth"
import Input from "../components/Input"
import Button from "../components/Button"

function EditAppointment(){
    const [services,setService]=useState([])
    const [formData,setFormdata]=useState({
		"service_id":"",
		"meeting_type":"",
		"appointment_date":"",
		"appointment_time":"",
		"customer_notes":""

    })
    const user = getUser();
    const { id } = useParams()
    const navigate = useNavigate()
    const getAppointment = async (e)=>{
        const res = await api.get(`/appointments/${id}`)
        setFormdata({
            "service_id":res.data.data.service_id,
            "meeting_type":res.data.data.meeting_type,
            "appointment_date":res.data.data.appointment_date,
            "appointment_time":res.data.data.appointment_time,
            "customer_notes":res.data.data.customer_notes
        });
       // console.log(res.data.data)
    }
    const servicedata=async (e)=>{
        const res = await api.get("/services")
        setService(res.data.services)
    }
    const handleChange=(e)=>{
        setFormdata({
            ...formData,[e.target.name]:e.target.value
        })
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const res =await api.put(`/appointments/${id}`,formData)
        navigate(getAppointmentRoute());
    }
    useEffect(()=>{
        servicedata();
        getAppointment();
    },[])

   
    return(
       <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
           <h2 className="dark-title">Edit Appointment</h2>
    <form onSubmit={handleSubmit}>
        <label className="d-block text-start">Service</label><br />
        <select
            className="form-control"
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
        >
            <option value="">Select Service</option>
            {services.map((service)=>(
                <option key={service.id} value={service.id}>{service.title}</option>
            ))}
        </select>

        <br /><br />

        <label className="form-label d-block text-start">Meeting Type</label><br />
        <select
            className="form-control"
            name="meeting_type"
            value={formData.meeting_type}
            onChange={handleChange}
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
        />

        <br /><br />
        <Input
            type="time"
            name="appointment_time"
            value={formData.appointment_time}
            label="Appointment Time"
            onChange={handleChange}
        />
        <br /><br />

        <label className="form-label d-block text-start">Customer Notes</label><br />
        <textarea
            className="form-control"
            name="customer_notes"
            rows="4"
            cols="40"
            value={formData.customer_notes}
            onChange={handleChange}
        ></textarea>

        <br /><br />
        <Button type="submit">
            Update Appointment
        </Button>
    </form>
</div></div></div></div></div>
    )
}
export default EditAppointment;