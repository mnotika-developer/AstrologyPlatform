import { getUser, logout } from "../helper/auth";

function AstroDashboard(){
    const user = getUser();
    if(!user){
        return <p>User Not Found</p>;
    }
    return (
        <div>
            <p>Welcome to Astrologer Dashboard :{user.name}</p>
            ----------------------------------------------<br></br>
            <Link to="#">Today's Appointments</Link><br/>
            <Link to="#">Completed Appointments</Link><br/>
            <Link to="#">Profile</Link><br/>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
export default AstroDashboard;