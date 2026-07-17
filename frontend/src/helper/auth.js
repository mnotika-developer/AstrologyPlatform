export const getToken = () => {
    return localStorage.getItem("access_token");
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

export const logout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.location.href="/";
}

export const getAppointmentRoute =()=>{
    const user = getUser();
    if(user.role==='customer'){
        return "/customer/appointments";
    }
    else if(user.role==='admin'){
        return "/admin/appointments";
    }
    else if(user.role==='astro'){
        return "/astro/appointments";
    }
        return "/";
}

export const getEditAppointmentRoute =(id)=>{
    const user = getUser();
    switch(user.role){
        case "customer":
            return `/customer/appointment/edit/${id}`;
        case "admin":
            return `/admin/appointment/edit/${id}`;
        case "astro":
            return `/astro/appointment/edit/${id}`;
        default:
            return "/";
    }
}

export const getDashboardRoute=()=>{
    const user = getUser();
    if(user.role==='customer'){
        return "/customer/dashboard";
    }
    else if(user.role==='admin'){
        return "/admin/dashboard";
    }
    else if(user.role==='astrologer'){
        return "/astro/dashboard";
    }
    return '/';
}
