function Textarea({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 4
}) {
    return (
        <div className="mb-3">
            <label className="form-label">
                {label}
            </label>
            <textarea
                className="form-control"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
            />
        </div>
    );
}

export default Textarea;