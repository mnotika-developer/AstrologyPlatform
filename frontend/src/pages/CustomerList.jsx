import { useEffect, useState } from "react";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import { getEditAppointmentRoute, getUser } from "../helper/auth";
import Button from "../components/Button";

function CustomerList(){

    const [customerList,setCustomerList]=useState([]);
    const [CustomerStatus,setCustomerStatus]=useState(null)
    const [customerSelectStatus,setSelectStatus]=useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getCustomer= async () => {
        try{
            setLoading(true)
        const res=await api.get('/users');
        setCustomerList(res.data.users);
        console.log(res.data.users);
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    const handleDelete=async (id)=>{
        if(window.confirm('Are you sure?')){
            const res = await api.delete(`/users/${id}`)
            console.log(res.data);
            getCustomer();
        }
    }
    useEffect(()=>{
        getCustomer();
    },[])

    const handleEdit=(id,status)=>{
        setCustomerStatus(id);
        setSelectStatus(status);
    }
    const updateStatus= async (id)=>{
        const res = await api.put(`/users/${id}/status`, {
            status:customerSelectStatus 
        });
        console.log(res.data)
        setCustomerList((prev) =>
            prev.map((customer) =>
                customer.id === id
                    ? { ...customer, status: customerSelectStatus }
                    : customer
            )
        );
        setCustomerStatus(null);
        setSelectStatus('');
        //await getAppointment();
    }
    const user = getUser();
    const customerdetail = customerList.map((customer,index)=>(
        <tr key={customer.id}>
            <td>{index + 1}</td>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.role}</td>
           <td className="mb-3">Customer Status:
                {CustomerStatus===customer.id ?
                (
                    <select className="form-control" value={customerSelectStatus} onChange={(e)=>setSelectStatus(e.target.value)}>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>)
                :
                 customer.status==1?('Active'):'Inactive'
                }
            
            {user?.role==='admin' && (
    CustomerStatus===customer.id ?(
      <><br /><Button className="btn-success" onClick={()=>updateStatus(customer.id)}>Save</Button></>
    ):<><br /><Button className="btn-info" style={{color:'#fff'}} onClick={()=>handleEdit(customer.id,customer.status)}><i className="fa fa-edit"></i></Button></>
)}
</td>
            <td>
            <Button onClick={()=>navigate(`/admin/customer/edit/${customer.id}`)}><i className="fa fa-edit"></i></Button> <Button onClick={()=>handleDelete(customer.id)}><i className="fa fa-trash"></i></Button>

            </td>
           
        </tr>
    ));
    if (loading) {
    return <h2>Loading customers...</h2>;
}
    return(
        <>
        <div className="card-shadow">
            <div className="card-body">
                 <h2 className="dark-title">Customer/Astrologer List</h2>
                 <Button onClick={()=>navigate('/admin/addcustomer')} className="mb-3">Add Customer</Button>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th width="180">Action</th>
                </tr>
            </thead>
            <tbody>
                {customerdetail}
                </tbody>
            </table>
            </div>
        </div></>
    )
}
export default CustomerList;