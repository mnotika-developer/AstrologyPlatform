import { Link } from "react-router-dom";
import { getUser, logout } from "../helper/auth";
import { useEffect, useState } from "react";
import { dashboardStat } from "../helper/apiHelper";

function AstroDashboard(){
    const user = getUser();
    const [dashboard,setDashboardCard]=useState({})
    const [loading,setLoading]=useState(false)
    if(!user){
        return <p>User Not Found</p>;
    }
    useEffect(()=>{
        dashboardStat('/dashboard',setDashboardCard,setLoading);
    },[])

    if(loading){
        return "Appointments Loading.."
    }
    return (
<div className="container-fluid">
        <h2 className="mb-4">Admin Dashboard</h2>

        <div className="col-md-12 mb-4">

    <div className="card shadow ">

        <div className="card-body">

        <p>Total Appointments : {dashboard.totalAppointment}</p>

        <p>Pending : {dashboard.totalpendingappointment}</p>

        <p>Confirmed : {dashboard.totalconfirmedappointment}</p>

        <p>Completed : {dashboard.totalcompletedppointment}</p>

        <p>Cancelled : {dashboard.totalcancelledappointment}</p>
        </div>
        </div>
        </div>
        </div>
    )
}
export default AstroDashboard;