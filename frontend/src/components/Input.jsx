function Input({
    label,
    type="text",
    name,
    value,
    onChange,
    placeholder="",
    required = false
}) {

    return (

<div className="">

<label className="form-label d-block text-start">
{label}
</label>

<input
type={type}
name={name}
value={value}
onChange={onChange}
placeholder={placeholder}
className="form-control mb-3"
required={required}
/>

</div>

    );
}

export default Input;