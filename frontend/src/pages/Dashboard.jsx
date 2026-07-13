import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../helper/auth.js";
import { dashboardStat } from "../helper/apiHelper.js";
import { useEffect, useState } from "react";
import api from "../services/api.js";

function Dashboard(){

    const user = getUser();
    const [dashboard,setdashboardcards]=useState({})
    const [loading,setLoading]=useState(false)
    if(!user){
        return <p>User not found</p>;
    }
    const Navigate = useNavigate();

    useEffect(()=>{
        dashboardStat("/dashboard",setdashboardcards,setLoading);
    },[])

    if(loading){
        return <h2>Stats Loading...</h2>
    }
    
    return(
        <>
        <div className="container-fluid">
        <h2 className="mb-4">Admin Dashboard</h2>

        <div className="col-md-12 mb-4">

    <div className="card shadow ">

        <div className="card-body">

        <p>Total Customers : {dashboard.totalCustomer}</p>

        <p>Total Astrologers : {dashboard.totalAstrologer}</p>

        <p>Total Services : {dashboard.totalService}</p>

        <p>Total Appointments : {dashboard.totalAppointment}</p>

        <p>Pending : {dashboard.totalpendingappointment}</p>

        <p>Confirmed : {dashboard.totalconfirmedappointment}</p>

        <p>Completed : {dashboard.totalcompletedppointment}</p>

        <p>Cancelled : {dashboard.totalcancelledappointment}</p>
        </div>
        </div>
        </div>
        </div>
    </>
    )
}

export default Dashboard;