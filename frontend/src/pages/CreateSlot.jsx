import { useState } from "react"
import api from "../services/api"
import Button from "../components/Button"
import Input from "../components/Input"

function CreateSlot(){
    const [slotData,addSlotData]=useState({
        "slot_date":"",
        "start_time":"",
        "end_time":""
    })
    const handleChange=(e)=>{
        addSlotData({
            ...slotData,[e.target.name]:e.target.value
        })
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        try{
            const res = await api.post('/slots',slotData)
            console.log(res.data)
            navigate('/astro/slots');
        }catch(err){
            console.log(err.response?.data)
        }
    }
    return(
    <div className="container">
      <div className="row justify-content-center">
      <div className="col-md-10">
     <div className="card shadow">
      <div className="card-body">
      <h2 class="dark-title">Add Slot</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="date"
          name="slot_date"
          placeholder="Slot Date"
          className="form-control mb-3"
          label="Slot Date"
          onChange={handleChange}
        />

      <Input
          type="time"
          name="start_time"
          placeholder="Slot Start Time"
          className="form-control mb-3"
          label="Slot Start Time"
          onChange={handleChange}
        />

        <Input
          type="time"
          name="end_time"
          placeholder="slot_end_time"
          className="form-control mb-3"
          label="Slot End Time"
          onChange={handleChange}
        />
        <Button type="submit" className="mb-3">
          Submit
        </Button>
      </form>
    </div></div></div></div></div>
    )
}
export default CreateSlot;