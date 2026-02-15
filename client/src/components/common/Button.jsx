export default function Button({ children, type = 'button', variant = 'primary', disabled = false, onClick }) {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 border-none text-base disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${disabled ? "" : ""}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
