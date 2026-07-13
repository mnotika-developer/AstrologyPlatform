function StatCard({title,value}){

return(

<div className="col-md-3 mb-4">

<div className="card shadow">

<div className="card-body text-center">

<h6>
{title}
</h6>

<h2>
{value}
</h2>

</div>

</div>

</div>

)

}

export default StatCard;