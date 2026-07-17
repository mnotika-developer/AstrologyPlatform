import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate, useParams } from "react-router-dom"
import { getAppointmentRoute, getUser } from "../helper/auth"
import Input from "../components/Input"
import Button from "../components/Button"

function EditAppointment(){
    const [services,setService]=useState([])
    const [astrologers,setAstrologer] = useState([]);
    const [slots,setSlots] = useState([]);
    const [formData,setFormdata]=useState({
		service_id:"",
        astrologer_id:"",
        slot_id:"",
        meeting_type:"",
        customer_notes:""
    })
    const user = getUser();
    const { id } = useParams()
    const navigate = useNavigate()

    const getSlots = async (astroid) => {
    try{
        const res = await api.get(`/slots/available/${astroid}`);
        setSlots(res.data.data);
        }
        catch(err){
            setSlots([]);
        }
    }
    const getAstrologers = async ()=>{
    const res = await api.get('/astrologers');
    setAstrologer(res.data.data);
} 
    const getAppointment = async (e)=>{
        const res = await api.get(`/appointments/${id}`)
        setFormdata({
            service_id:res.data.data.service_id,
            astrologer_id:res.data.data.astrologer_id,
            slot_id:res.data.data.availability_id,
            meeting_type:res.data.data.meeting_type,
            customer_notes:res.data.data.customer_notes
        });
        if(res.data.data.astrologer_id){
            await getSlots(res.data.data.astrologer_id);
        }
       // console.log(res.data.data)
    }
    const servicedata=async (e)=>{
        const res = await api.get("/services")
        setService(res.data.services)
    }
    const handleChange = (e)=>{

    setFormdata({
        ...formData,
        [e.target.name]:e.target.value
    });

    if(e.target.name === 'astrologer_id'){
        getSlots(e.target.value);

        setFormdata(prev=>({
            ...prev,
            astrologer_id:e.target.value,
            slot_id:"",
        }));
    }

    if(e.target.name === 'slot_id'){
        const slotid = e.target.value;
        (async ()=>{
            const res = await api.get(`/slots/${slotid}`);
            setFormdata(prev=>({
                ...prev,
                slot_id:slotid,
            }));

        })();
    }
}
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const res =await api.put(`/appointments/${id}`,formData)
        navigate(getAppointmentRoute());
    }
    useEffect(()=>{
        servicedata();
        getAstrologers();
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
        <label className="d-block text-start">
    Astrologer
</label>

<select
    className="form-control"
    name="astrologer_id"
    value={formData.astrologer_id}
    onChange={handleChange}
>
    <option value="">
        Select Astrologer
    </option>

    {astrologers.map((astro)=>(
        <option key={astro.id} value={astro.id}>
            {astro.name}
        </option>
    ))}
</select>

<label className="d-block text-start">
    Slot
</label>

<select
    className="form-control"
    name="slot_id"
    value={formData.slot_id}
    onChange={handleChange}
>
    <option value="">
        Select Slot
    </option>

    {slots.length>0 && slots.map((slot)=>(
        <option key={slot.id} value={slot.id}>
            {slot.available_date} | {slot.start_time} - {slot.end_time}
        </option>
    ))}
</select>

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