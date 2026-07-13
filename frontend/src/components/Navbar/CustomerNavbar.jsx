import { getUser, logout } from "../../helper/auth";
import Button from "./../Button";

function CustomerNavbar() {
    const user = getUser();
    return (

<nav className="navbar px-3 customnavbar">

<span className="navbar-brand text-white">
Astrology Platform
</span>

<span className="text-white">
Welcome {user?.name}
</span>
<Button onClick={logout}><i className="fas fa-sign-out-alt me-2"></i>Logout</Button>

</nav>

    );
}

export default CustomerNavbar;