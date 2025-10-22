export default function HeartHandsIcon({ size = 48, color = "currentColor", strokeWidth = 1, ...props }) {
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
      {/* Corazón (un poco más arriba) */}
      <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.566z"></path>

      {/* Manos (curvas más suaves y abiertas) */}
      {/* Mano izquierda */}
      <path d="M4 14.5s1.5-2 4-2c2.5 0 4 2 4 2"></path>
      <path d="M4 18.5s1.5-2 4-2c1.8 0 3 .8 4 2"></path>
      {/* Mano derecha */}
      <path d="M20 14.5s-1.5-2-4-2c-2.5 0-4 2-4 2"></path>
      <path d="M20 18.5s-1.5-2-4-2c-1.8 0-3 .8-4 2"></path>
    </svg>
  );
}