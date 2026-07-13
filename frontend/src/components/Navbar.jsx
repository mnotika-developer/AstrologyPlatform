import { getUser, logout } from "../helper/auth";
import Button from "./Button";

function Navbar() {

    const user = getUser();

    return (

<nav className="navbar navbar-dark bg-dark px-3">

<span className="navbar-brand">
Astrology Platform
</span>

<span className="text-white">
Welcome {user?.name}
</span>
<Button onClick={logout}>Logout</Button>

</nav>

    );
}

export default Navbar;