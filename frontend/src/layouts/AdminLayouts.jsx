import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function AdminLayout() {
    return (
        <div className="container-fluid p-0 d-flex flex-column">
            <div className="row g-0 flex-grow-1">

                {/* Sidebar */}
                <div className="col-md-3 col-lg-2">
                    <Sidebar />
                </div>

                {/* Content */}
                <div className="col-md-9 col-lg-10 d-flex flex-column">

                    <Navbar />

                    <div className="p-4 flex-grow-1">
                        <Outlet />
                    </div>

                    <Footer />

                </div>

            </div>
        </div>
    );
}

export default AdminLayout;