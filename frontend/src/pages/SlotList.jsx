import { useEffect, useState } from "react"
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function SlotList(){

    const [slots,setSlots]=useState([]);
    const [loading,setLoading]=useState(false);

    const navigate = useNavigate();
    const fetchslots= async () =>{
        try{
            setLoading(true);
            const res = await api.get('/slots');
            console.log(res.data);
            setSlots(res.data.data);   
        }catch(error){
            console.log(error)
        }finally{
                setLoading(false);
        }
    }

    const handleDelete=async (id)=>{
        if(window.confirm("Are you sure?")){
        const res = await api.delete(`/slots/${id}`)
        fetchslots();
        }
    }
    useEffect(()=>{
        fetchslots();
    },[]);

    const slotlist = slots.map((slot,index)=>(
        <tr key={slot.id}>
            <td>{index + 1}</td>
            <td>{slot.astrologer.name}</td>
            <td>{slot.available_date}</td>
            <td>{slot.start_time}</td>
            <td>{slot.end_time}</td>
            <td>{slot.isbooked==1?'Yes':'No'}</td>
            <td><Button onClick={()=>navigate(`/astro/slot/edit/${slot.id}`)}><i class="fa fa-edit"></i></Button>&nbsp;<Button onClick={()=>handleDelete(slot.id)}><i class="fa fa-trash"></i></Button></td>
        </tr>
    ));
    if(loading){
        return <h2>Loading Slots....</h2>;
    }
    return(
        <>
        <div className="card-shadow">
        <div className="card-body">
        <button onClick={()=>navigate('/astro/addslot')} className="btn btn-primary">Add Slot</button>
             <h2 className="dark-title">Slots</h2> 
                <table className="table table-borered table-hover">
                    <thead className="table-dark">
                        <tr>
                        <th>#</th>
                         <th>Astrologer</th>
                          <th>Slot Date</th>
                           <th>Start Time</th>
                           <th>End Time</th>
                            <th>Booking Status</th>
                            <th>Action</th>
                            </tr>
                    </thead>
                    <tbody>
                    {slotlist}
                    </tbody>
                </table>
            </div>
        </div></>
    )
}
export default SlotList;