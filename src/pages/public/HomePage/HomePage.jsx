export default function HomePage() {
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-bold">Bienvenido a Coramind</h1>
      <p className="text-gray-700">
        Esta es la página pública de inicio. Si no has iniciado sesión, verás el botón
        “Iniciar sesión” en el Navbar. Si ya estás logueado, verás “Cerrar sesión”.
      </p>
    </section>
  );
}
