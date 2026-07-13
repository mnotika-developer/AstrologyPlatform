import { Link } from "react-router-dom";
import { getUser, logout } from "../helper/auth.js";
import { dashboardStat } from "../helper/apiHelper.js";
import { useEffect, useState } from "react";
import api from "../services/api.js";

function CustomerDashboard(){

    const user = getUser();
    const [dashboard,setDashboardCard]=useState({})
    const [loading,setLoading]=useState(false)

    if(!user){
        return <p>User Not found</p>;
    }
    
    useEffect(()=>{
            dashboardStat("/dashboard",setDashboardCard,setLoading);
        },[])
    if(loading){
        return <h2>Loading...</h2>
    }
    return (
        <div>
            <h3>Customer Dashboard :{user.name}</h3>
            <p>Total Appointments : {dashboard.totalAppointment}</p>
            <p>Pending : {dashboard.totalpendingappointment}</p>
            <p>Confirmed : {dashboard.totalconfirmedappointment}</p>
            <p>Completed : {dashboard.totalcompletedppointment}</p>
            <p>Cancelled : {dashboard.totalcancelledappointment}</p> 
            
        </div>
    )
}
export default CustomerDashboard;