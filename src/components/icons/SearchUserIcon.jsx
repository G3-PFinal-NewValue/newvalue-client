export default function SearchUserIcon({ size = 48, color = "currentColor", strokeWidth = 1, ...props }) {
  // Ajustamos el strokeWidth por defecto a 1, como hicimos en HomePage
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24" // Mantenemos el viewBox
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Usuario (más pequeño y a la derecha) */}
      <path d="M18 20v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1"></path> 
      <circle cx="13" cy="11" r="3"></circle> 
      
      {/* Lupa (más a la izquierda) */}
      <circle cx="8" cy="8" r="6"></circle> 
      <line x1="12.5" y1="12.5" x2="17" y2="17"></line> 
      
      {/* Número 1 dentro de la lupa */}
      <text 
        x="8" 
        y="9.5" // Ajustar verticalmente si es necesario
        textAnchor="middle" 
        fontSize="6" // Tamaño del número
        fill={color} // Usar el mismo color del stroke
        stroke="none" // Sin borde para el número
        fontWeight="bold"
      >
        1
      </text>
    </svg>
  );
}