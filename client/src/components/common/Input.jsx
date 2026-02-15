export default function Input({ label, type = 'text', value, onChange, placeholder, required = false }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                className="p-3 border border-gray-300 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}
