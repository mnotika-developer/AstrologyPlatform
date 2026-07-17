import { getUser } from "../helper/auth.js";
import { dashboardStat } from "../helper/apiHelper.js";
import { useEffect, useState } from "react";

function CustomerDashboard() {

    const user = getUser();

    const [dashboard,setDashboardCard] = useState({});
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        dashboardStat(
            "/dashboard",
            setDashboardCard,
            setLoading
        );
    }, []);

    if(!user){
        return <p>User not found</p>;
    }

    if(loading){
        return <h2>Loading...</h2>;
    }

    return(
        <div className="container-fluid">

            <h2 className="mb-4 dark-title">
                Welcome, {user.name}
            </h2>

            <div className="row">

                <div className="col-md-4 mb-4">
                    <div className="card shadow border-0 dashboard-card text-center h-100">
                        <div className="card-body">
                            <i className="fa fa-calendar fa-3x text-primary mb-3"></i>
                            <h6>Total Appointments</h6>
                            <h2>{dashboard.totalAppointment || 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow border-0 dashboard-card text-center h-100">
                        <div className="card-body">
                            <i className="fa fa-clock fa-3x text-warning mb-3"></i>
                            <h6>Pending</h6>
                            <h2>{dashboard.totalpendingappointment || 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow border-0 dashboard-card text-center h-100">
                        <div className="card-body">
                            <i className="fa fa-check-circle fa-3x text-info mb-3"></i>
                            <h6>Confirmed</h6>
                            <h2>{dashboard.totalconfirmedappointment || 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow border-0 dashboard-card text-center h-100">
                        <div className="card-body">
                            <i className="fa fa-check-double fa-3x text-success mb-3"></i>
                            <h6>Completed</h6>
                            <h2>{dashboard.totalcompletedappointment || 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow border-0 dashboard-card text-center h-100">
                        <div className="card-body">
                            <i className="fa fa-times-circle fa-3x text-danger mb-3"></i>
                            <h6>Cancelled</h6>
                            <h2>{dashboard.totalcancelledappointment || 0}</h2>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CustomerDashboard;