import { useEffect, useState } from "react"
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Services(){

    const [services,setServices]=useState([]);
    const [loading,setLoading]=useState(false);

    const navigate = useNavigate();
    const fetchservices= async () =>{
        try{
            setLoading(true);
            const res = await api.get('/services');
            console.log(res.data);
            setServices(res.data.services);   
        }catch(error){
            console.log(error)
        }finally{
                setLoading(false);
        }
    }

    const handleDelete=async (id)=>{
        if(window.confirm("Are you sure?")){
        const res = await api.delete(`/services/${id}`)
        fetchServices();
        }
    }
    useEffect(()=>{
        fetchservices();
    },[]);

    const servicelist = services.map((service,index)=>(
        <tr key={service.id}>
            <td>{index + 1}</td>
            <td>{service.title}</td>
            <td>{service.description}</td>
            <td>{service.price}</td>
            <td><Button onClick={()=>navigate(`/admin/services/edit/${service.id}`)}>Edit</Button><Button onClick={()=>handleDelete(service.id)}>Delete</Button></td>
        </tr>
    ));
    if(loading){
        return <h2>Loading Service....</h2>;
    }
    return(
        <>
        <div className="card-shadow">
            <div className="card-body">
             <h2 className="dark-title">Services</h2> 
                <table className="table table-borered table-hover">
                    <thead className="table-dark">
                        <tr>
                        <th>#</th>
                         <th>Title</th>
                          <th>Description</th>
                           <th>Price</th>
                            <th>Action</th>
                            </tr>
                    </thead>
                    <tbody>
                    {servicelist}
                    </tbody>
                </table>
            </div>
        </div></>
    )
}
export default Services;