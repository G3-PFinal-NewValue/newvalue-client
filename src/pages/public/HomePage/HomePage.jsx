import styles from "./HomePage.module.css"; 

export default function HomePage() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Bienvenido a Coramind</h1>
      <p className={styles.text}>
        Esta es la página pública de inicio. Si no has iniciado sesión, verás el botón
        “Iniciar sesión” en el Navbar. Si ya estás logueado, verás “Cerrar sesión”.
      </p>
    </section>
  );
}