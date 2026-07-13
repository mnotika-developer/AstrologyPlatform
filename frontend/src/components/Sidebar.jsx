import { NavLink } from "react-router-dom";
import logo from "../assets/astro1.jpg";

import { getUser } from "../helper/auth";

function Sidebar() {
    const user = getUser();
    return (
        <div
            className="bg-dark vh-100"
            style={{ position: "sticky", top: 0 }}
        >
            <div className="list-group rounded-0">

                <img src="/astrofav.png" className="img-fluid logoimg"/>

                <NavLink to="/admin/dashboard"
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
                    to="/admin/customers"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-users me-2"></i>
                     Customers
                </NavLink>
                <NavLink
                    to="/admin/services"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-calendar-check me-2"></i>
                    Services
                </NavLink>

                <NavLink
                    to="/admin/addservices"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-plus-circle me-2"></i>
                    Add Service
                </NavLink>
                <NavLink
                    to="/admin/appointments"
                    className={({ isActive }) =>
                        `list-group-item list-group-item-action border-0 rounded-0 ${
                            isActive
                                ? "active"
                                : "bg-dark text-white"
                        }`
                    }
                ><i className="fas fa-calendar-check me-2"></i>
                    Appointments
                </NavLink>
                        <NavLink
                    to="/admin/addappointments"
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
                    to="/admin/profile"
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

export default Sidebar;