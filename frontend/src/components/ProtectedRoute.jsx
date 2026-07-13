import { Navigate } from "react-router-dom";

function ProtectedRoute({children,role}){
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    if(!token || !user){
        return <Navigate to="/"/>;
    }
    // If no role is specified, only check login
    if (!role) {
        return children;
    }
    if(role==user.role){
        return children;
    }
    return <Navigate to="/"/>;
}

export default ProtectedRoute;