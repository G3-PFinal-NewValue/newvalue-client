export default function LaptopUserIcon({ size = 48, color = "currentColor", strokeWidth = 1, ...props }) {
  // Ajustamos el strokeWidth por defecto a 1
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Base del Laptop */}
      <rect x="2" y="15" width="20" height="4" rx="1"></rect> 
      {/* Pantalla del Laptop */}
      <path d="M4 15V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10"></path>

      {/* Icono de usuario simple (más pequeño y centrado) */}
      {/* Cabeza */}
      <circle cx="12" cy="8" r="2"></circle> 
      {/* Cuerpo */}
      <path d="M12 10c-1.5 0-2.7 1.2-2.7 2.7v.8h5.4v-.8c0-1.5-1.2-2.7-2.7-2.7z"></path> 
    </svg>
  );
}