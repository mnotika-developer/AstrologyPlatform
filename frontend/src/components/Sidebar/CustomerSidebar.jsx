import { NavLink } from "react-router-dom";
import logo from "../../assets/astro1.jpg";
import { getUser } from "../../helper/auth";

function CustomerSidebar() {
    const user = getUser();
    return (
        <div
            className="customsidebar vh-100"
            style={{ position: "sticky", top: 0 }}
        >
            <div className="list-group rounded-0">

                <img src="/astrofav.png" className="img-fluid logoimg"/>

                <NavLink to="/customer/dashboard"
                        className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-home me-2"></i>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/customer/appointments"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-calendar-check me-2"></i>
                    My Appointments
                </NavLink>
                
                <NavLink
                    to="/customer/addappointments"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-plus-circle me-2"></i>
                    Book Appointment
                </NavLink>

                <NavLink
                    to="/customer/profile"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-user me-2"></i>
                    Profile
                </NavLink>

            </div>
        </div>
    );
}

export default CustomerSidebar;