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

    <h2 className="mb-4 dark-title">
        Admin Dashboard
    </h2>

    <div className="row">

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center dashboard-card">
                <div className="card-body">
                    <i className="fa fa-users fa-3x mb-3 text-primary"></i>
                    <h5>Total Customers</h5>
                    <h2>{dashboard.totalCustomer}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-user-md fa-3x mb-3 text-success"></i>
                    <h5>Total Astrologers</h5>
                    <h2>{dashboard.totalAstrologer}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-star fa-3x mb-3 text-warning"></i>
                    <h5>Total Services</h5>
                    <h2>{dashboard.totalService}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-calendar fa-3x mb-3 text-info"></i>
                    <h5>Total Appointments</h5>
                    <h2>{dashboard.totalAppointment}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-clock fa-3x mb-3 text-warning"></i>
                    <h5>Pending</h5>
                    <h2>{dashboard.totalpendingappointment}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-check-circle fa-3x mb-3 text-primary"></i>
                    <h5>Confirmed</h5>
                    <h2>{dashboard.totalconfirmedappointment}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-check-double fa-3x mb-3 text-success"></i>
                    <h5>Completed</h5>
                    <h2>{dashboard.totalcompletedppointment}</h2>
                </div>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="card shadow border-0 text-center">
                <div className="card-body">
                    <i className="fa fa-times-circle fa-3x mb-3 text-danger"></i>
                    <h5>Cancelled</h5>
                    <h2>{dashboard.totalcancelledappointment}</h2>
                </div>
            </div>
        </div>

    </div>

</div>
    </>
    )
}

export default Dashboard;