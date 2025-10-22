import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
// Importaremos servicios del admin aquí (ej: getUsers, getPsychologists, etc.)
import styles from './AdminDashboard.module.css'; // Crearemos este CSS

export default function AdminDashboard() {
  const { user } = useAuth(); // Podríamos usarlo para mostrar "Bienvenido Admin X"

  // Estados para guardar datos (ej: lista de usuarios, psicólogos pendientes)
  const [users, setUsers] = useState([]);
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Simulación de carga de datos del Dashboard ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulación: Cuando existan los servicios, los llamaríamos aquí
    /*
    Promise.all([
      adminService.getAllUsers(),
      adminService.getPendingPsychologists() 
    ])
    .then(([userData, psychData]) => {
      setUsers(userData);
      setPendingPsychologists(psychData);
    })
    .catch(err => setError("Error al cargar datos del dashboard."))
    .finally(() => setLoading(false));
    */

    // Simulación simple con datos de ejemplo
    setTimeout(() => {
      setUsers([
        { id: 101, first_name: 'Ana', last_name: 'García', email: 'ana@mail.com', role: 'patient', registration_date: '2025-10-21' },
        { id: 102, first_name: 'Luis', last_name: 'Martínez', email: 'luis@mail.com', role: 'psychologist', registration_date: '2025-10-20' },
      ]);
      setPendingPsychologists([
         { id: 102, user_id: 102, first_name: 'Luis', last_name: 'Martínez', license_number: 'PEND-123', specialty: 'Terapia Cognitivo-Conductual', submitted_at: '2025-10-21' },
         { id: 103, user_id: 103, first_name: 'Carla', last_name: 'Sosa', license_number: 'PEND-456', specialty: 'Ansiedad y Estrés', submitted_at: '2025-10-22' }
      ]);
      setLoading(false);
    }, 800); // Simular 0.8s de carga

  }, []);

  // --- Renderizado ---
  if (loading) {
    return <div className={styles.page}><p>Cargando dashboard...</p></div>;
  }
  if (error) {
     return <div className={styles.page}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Panel de Administración</h1>

      {/* Sección Psicólogos Pendientes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Psicólogos Pendientes de Validación ({pendingPsychologists.length})</h2>
        {pendingPsychologists.length === 0 ? (
          <p>No hay psicólogos pendientes.</p>
        ) : (
          <ul className={styles.list}>
            {pendingPsychologists.map(p => (
              <li key={p.id} className={styles.listItem}>
                <span>{p.first_name} {p.last_name} ({p.specialty}) - Lic: {p.license_number}</span>
                {/* TODO: Añadir botones Validar/Rechazar */}
                <button className={styles.actionButton}>Validar</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sección Últimos Usuarios Registrados */}
       <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Últimos Usuarios Registrados ({users.length})</h2>
         <ul className={styles.list}>
           {users.map(u => (
             <li key={u.id} className={styles.listItem}>
               <span>{u.first_name} {u.last_name} ({u.email}) - Rol: {u.role}</span>
               {/* TODO: Botón Ver Detalles */}
             </li>
           ))}
         </ul>
      </section>

      {/* Más secciones: Estadísticas, Reportes, etc. */}

    </div>
  );
}