import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import PageTitle from "../components/PageTitle"
import Button from "../components/Button"
import Input from "../components/Input"

function EditSlot(){
    const [slot,setSlot]=useState({})
    const [formData,setFormdata]=useState({
        "slot_date":"",
        "start_time":"",
        "end_time":""
    })

    const navigate = useNavigate();

    const { id } = useParams()

    const slotdetail=async (e)=>{
        const res = await api.get(`/slots/${id}`)
        setSlot(res.data.data);
        setFormdata({
            slot_date: res.data.data.available_date,
            start_time: res.data.data.start_time,
            end_time: res.data.data.end_time,
        });
    }

    useEffect(()=>{
        slotdetail();
    },[])

    const handleChange =(e)=>{
        setFormdata({
            ...formData,[e.target.name]:e.target.value
        });
    }
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const res = await api.put(`/slots/${id}`,formData);
        navigate('/astro/slots');
        console.log(res.data)
    }
    return(
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
          <h2 clasName="dark-title">Edit Slot</h2>
      <form onSubmit={handleSubmit}>
         <Input
          type="date"
          name="slot_date"
          placeholder="Slot Date"
          className="form-control mb-3"
          label="Slot Date"
          value={formData.slot_date}
          onChange={handleChange}
        />

      <Input
          type="time"
          name="start_time"
          placeholder="Slot Start Time"
          className="form-control mb-3"
          label="Slot Start Time"
          value={formData.start_time}
          onChange={handleChange}
        />

        <Input
          type="text"
          name="end_time"
          placeholder="slot_end_time"
          className="form-control mb-3"
          label="Slot End Time"
          value={formData.end_time}
          onChange={handleChange}
        />
        <Button type="submit">
    Update Slot
</Button>
      </form>
    </div></div></div></div></div>
    )
}

export default EditSlot;