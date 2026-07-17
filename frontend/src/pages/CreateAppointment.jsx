import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

function CreateAppointment(){
    const [formData,setFormData]=useState({
		"service_id":"",
        "astrologer_id":"",
        "slot_id":"",
		"meeting_type":"",
		"customer_notes":""

    })
    const [users,setUsers]=useState([])
    const [services,setServices]=useState([])
    const [astrologers,setAstrologer]=useState([])
    const [slots,setSlots]=useState([])
    const navigate = useNavigate()

    const handleChange=(e)=>{
        setFormData({
            ...formData,[e.target.name]:e.target.value
        })
        console.log(e.target.value);
        if(e.target.name=='astrologer_id'){
            setSlots([]);

            const astroid = e.target.value;
            (async ()=>{
                const res = await api.get(`/slots/available/${astroid}`);
                setSlots(res.data.data);
            })();
        }
        if(e.target.name=='slot_id'){
            const slotid = e.target.value;
            (async ()=>{
                const res = await api.get(`/slots/${slotid}`);
            })();
        }
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
    const getastrologers=async ()=>{
        const res = await api.get('/astrologers');
        setAstrologer(res.data.data);
    }
    
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const res = await api.post('/appointments',formData)
        console.log(res.data);
        navigate('/customer/appointments')
    }
    const handleEditorChange = (content) => {
        setFormData({
            ...formData,
            customer_notes: content
        });
    };
    useEffect(()=>{
        getusers();
        getservices();
        getastrologers();
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
        </select><br></br>
        <label className="d-block text-start">Astrologer</label><br />
        <select
            name="astrologer_id"
            value={formData.astrologer_id}
            onChange={handleChange}
            class="form-control"
            required
        >
            <option value="">Select Astrologer</option>
            {astrologers.map((astro)=>(
                <option key={astro.id} value={astro.id}>{astro.name}</option>
            ))}
        </select>

        <br /><br />
        <label className="d-block text-start">Select Slot</label><br />
        <select
            name="slot_id"
            value={formData.availability_id}
            onChange={handleChange}
            class="form-control"
            required
        >
            <option value="">Select Slot</option>
            {slots !='' && slots.map((slot)=>(
                <option key={slot.id} value={slot.id}>{slot.available_date} {slot.start_time}-{slot.end_time}</option>
            ))}
        </select>

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

        <label className="d-block text-start">Customer Notes</label><br />
        <div className="editorContent">
          <ReactQuill className="editor" theme="snow" value={formData.customer_notes} onChange={handleEditorChange} />
        </div>

        <br /><br />

        <Button type="submit">
            Book Appointment
        </Button>

    </form>
</div></div></div></div></div>
    )
}
export default CreateAppointment;