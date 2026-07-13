import { useState } from "react"
import api from "../services/api"
import Button from "../components/Button"
import Input from "../components/Input"

function CreateService(){
    const [serviceData,addServiceData]=useState({
        "title":"",
        "descripion":"",
        "price":"",
        "duration":"",
    })

    const handleChange=(e)=>{
        addServiceData({
            ...serviceData,[e.target.name]:e.target.value
        })
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        try{
            const res = await api.post('/services',serviceData)
            console.log(res.data)
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
      <h2 class="dark-title">Add Service</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          className="form-control mb-3"
          label="Title"
          onChange={handleChange}
        />

      <Input
          type="text"
          name="description"
          placeholder="Description"
          className="form-control mb-3"
          label="Description"
          onChange={handleChange}
        />

        <Input
          type="text"
          name="price"
          placeholder="Price"
          className="form-control mb-3"
          label="Price"
          onChange={handleChange}
        />

        <Input
          type="text"
          name="duration"
          className="form-control mb-3"
          placeholder="duration"
          label="Duration"
          onChange={handleChange}
        />
        <Button type="submit" className="mb-3">
          Submit
        </Button>
      </form>
    </div></div></div></div></div>
    )
}
export default CreateService;