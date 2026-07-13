import api from "../services/api";

export const dashboardStat = async (url,setDashboardCard,setLoading)=>{
        try{
            setLoading(true);
            const res = await api.get(url)
            setDashboardCard(res.data.data);
        }catch(err){
            console.log(err.response?.data);
        }
        finally{
            setLoading(false);
        }
}