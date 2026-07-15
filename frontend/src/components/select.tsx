interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export function Select({ label, value, onChange, options, placeholder = "Select...", required = false }: SelectProps) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select 
        className="form-select" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}