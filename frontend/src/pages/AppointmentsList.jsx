import { useEffect, useState } from "react";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import { getEditAppointmentRoute, getUser } from "../helper/auth";
import Button from "../components/Button";

function AppointmentList(){

    const [appointList,setAppointList]=useState([]);
    const [appointStatus,setAppointStatus]=useState(null)
    const [appointSelectStatus,setSelectStatus]=useState('')
    const [loading, setLoading] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [selectedAppointment,setSelectedAppointment] = useState(null);
    const [astrologers,setAstrologers] = useState([]);
    const [selectedAstrologer,setSelectedAstrologer] = useState('');
    const navigate = useNavigate();

    const setAstrologer =async ()=>{
        await api.put(
            `/appointments/${selectedAppointment}/astrologer`,
            {
                astro_id:selectedAstrologer
            }
        );
        await getAppointment();
        setShowModal(false);
    }

    const getAstrologer =async ()=>{
        const res = await api.get('/astrologers');
        setAstrologers(res.data.data);
    }


    const getAppointment= async () => {
        try{
            setLoading(true)
        const res=await api.get('/appointments');
        setAppointList(res.data.data);
        console.log(res.data);
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    const handleDelete=async (id)=>{
        if(window.confirm('Are you sure?')){
            const res = await api.delete(`/appointments/${id}`)
            console.log(res.data);
            await getAppointment();
        }
    }
    useEffect(()=>{
        getAppointment();
    },[])

    const handleEdit=(id,status)=>{
        setAppointStatus(id);
        setSelectStatus(status);
    }
    const updateStatus= async (id)=>{
        const res = await api.put(`/appointments/${id}/status`, {
            status:appointSelectStatus 
        });
        console.log(res.data)
        setAppointList((prev) =>
            prev.map((appointment) =>
                appointment.id === id
                    ? { ...appointment, status: appointSelectStatus }
                    : appointment
            )
        );
        setAppointStatus(null);
        setSelectStatus('');
        //await getAppointment();
    }
    const user = getUser();
    const openAssignedModal = (appointmentid,astroid)=>{
        setSelectedAppointment(appointmentid);
        getAstrologer();
        setShowModal(true);
        setSelectedAstrologer(astroid);
    }
    const appointmentdetail = appointList.map((appointment,index)=>(
        <tr key={appointment.id}>
            <td>{index + 1}</td>
            <td>{appointment.user.name}</td>
            <td>{appointment.service.title}</td>
            <td>{appointment.appointment_date}</td>
            <td>{appointment.appointment_time}</td>
            <td>{appointment.customer_notes}</td>
            <td>{appointment.astrologer? appointment.astrologer.name: 'Not Assigned'} &nbsp;<Button onClick={()=>openAssignedModal(appointment.id,appointment.astrologer_id)}>Assign</Button></td>
            <td className="mb-3">Appointment Status:
                {appointStatus===appointment.id ?
                (
                    <select className="form-control" value={appointSelectStatus} onChange={(e)=>setSelectStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>)
                :
                 (appointment.status)
                }
            
            {user?.role==='admin' && (
    appointStatus===appointment.id ?(
        <Button className="btn-success" onClick={()=>updateStatus(appointment.id)}>Save</Button>
    ):<Button className="btn-info" style={{color:'#fff'}} onClick={()=>handleEdit(appointment.id,appointment.status)}>Edit Status</Button>
)}
            </td>
           <td>
            <Button onClick={()=>navigate(getEditAppointmentRoute(appointment.id))}>Edit</Button> 
            <Button onClick={()=>handleDelete(appointment.id)}>Delete</Button>
            </td>
        </tr>
    ));
    if (loading) {
    return <h2>Loading appointments...</h2>;
}
    return(
        <>
        <div className="card-shadow">
            <div className="card-body">
                 <h2 className="dark-title">Appointment List</h2>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Notes</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Assign Astrologer</th>
                    <th>Status</th>
                    <th width="180">Action</th>
                </tr>
            </thead>
            <tbody>
                {appointmentdetail}
                </tbody>
            </table>
            </div>
        </div>
        {showModal && (
<div className="modal fade show d-block">
    <div className="modal-dialog">
        <div className="modal-content">

            <div className="modal-header">
                <h5 className="modal-title">
                    Assign Astrologer
                </h5>

                <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                ></button>
            </div>

            <div className="modal-body">

                <select
                    className="form-control"
                    value={selectedAstrologer}
                    onChange={(e)=>
                        setSelectedAstrologer(e.target.value)
                    }
                    required
                >
                    <option value="">
                        Select Astrologer
                    </option>

                    {astrologers.map((astro)=>(
                        <option
                            key={astro.id}
                            value={astro.id}
                        >
                            {astro.name}
                        </option>
                    ))}
                </select>

            </div>

            <div className="modal-footer">

                <Button
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                >
                    Close
                </Button>

                <Button
                    className="btn-primary"
                    onClick={setAstrologer}
                >
                    Assign
                </Button>

            </div>

        </div>
    </div>
</div>
)}
        
        </>
    )
}
export default AppointmentList;