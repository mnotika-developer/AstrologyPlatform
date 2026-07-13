function Select({
    label,
    name,
    value,
    onChange,
    options = []
}) {
    return (
        <div className="mb-3">
            <label className="form-label">
                {label}
            </label>
            <select
                className="form-select"
                name={name}
                value={value}
                onChange={onChange}
            >
                <option value="">Select</option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;