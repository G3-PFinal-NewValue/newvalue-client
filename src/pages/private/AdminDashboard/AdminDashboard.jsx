import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
// Importaremos servicios del admin aquí
import styles from './AdminDashboard.module.css';
import AdminExportExcel from '../../../components/AdminExportExcel';

export default function AdminDashboard() {
   const { user } = useAuth();

   const [users, setUsers] = useState([]);
   const [pendingPsychologists, setPendingPsychologists] = useState([]);
   const [stats, setStats] = useState({ totalUsers: 0, pending: 0, activePsy: 0 }); // Estado para estadísticas
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const mockSessions = [
  { estado: "Cancelada", usuario: "Ana", fecha: "2025-10-25" },
  { estado: "Completada", usuario: "Luis", fecha: "2025-10-24" },
  { estado: "Cancelada", usuario: "Carla", fecha: "2025-10-23" }
];
   const [usuarios, setUsuarios] = useState([]);   // Para Excel
const [sesiones, setSesiones] = useState([]);   // Para Excel

 // --- Datos simulados de pacientes ---
  const mockPatients = [
    {
      user_id: 101,
      birth_date: '1990-06-15',
      gender: 'Femenino',
      therapy_goals: 'Reducir ansiedad y mejorar el sueño.',
      medical_history: 'Sin antecedentes graves.',
      photo: 'https://via.placeholder.com/100',
      status: 'active',
    },
  ];

  // --- Datos simulados de psicólogos ---
  const mockPsychologists = [
    {
      user_id: 102,
      license_number: 'COL-98765',
      professional_description: 'Especialista en TCC con enfoque en depresión y ansiedad.',
      photo: 'https://via.placeholder.com/100',
      validated: true,
      status: 'active',
    },
    {
      user_id: 103,
      license_number: 'COL-12345',
      professional_description: 'Psicóloga enfocada en terapia familiar.',
      photo: 'https://via.placeholder.com/100',
      validated: false,
      status: 'inactive',
    },
  ];

   // --- Simulación de carga de datos ---
   useEffect(() => {
      setLoading(true);
      setError(null);
      // Simulación con datos de ejemplo
      setTimeout(() => {
         const mockUsers = [
            { id: 101, first_name: 'Ana', last_name: 'García', email: 'ana@mail.com', role: 'patient', registration_date: '2025-10-21T10:30:00Z' },
            { id: 102, first_name: 'Luis', last_name: 'Martínez', email: 'luis@mail.com', role: 'psychologist', registration_date: '2025-10-20T15:00:00Z' },
            { id: 103, first_name: 'Carla', last_name: 'Sosa', email: 'carla@mail.com', role: 'psychologist', registration_date: '2025-10-22T09:00:00Z' }
         ];
         const mockPending = [
            { id: 102, user_id: 102, first_name: 'Luis', last_name: 'Martínez', license_number: 'PEND-123', specialty: 'Terapia Cognitivo-Conductual', submitted_at: '2025-10-21T16:00:00Z' },
            { id: 103, user_id: 103, first_name: 'Carla', last_name: 'Sosa', license_number: 'PEND-456', specialty: 'Ansiedad y Estrés', submitted_at: '2025-10-22T10:00:00Z' }
         ];

         setUsers(mockUsers);
         setPendingPsychologists(mockPending);
         setUsuarios(mockUsers); // Para Excel
         setSesiones(mockSessions); // Para Excel
         setStats({ // Calcular estadísticas simples
            totalUsers: mockUsers.length,
            pending: mockPending.length,
            activePsy: mockUsers.filter(u => u.role === 'psychologist').length - mockPending.length // Asumiendo que todos los no pendientes están activos
         });

         setLoading(false);
      }, 800);

   }, []);

   // --- Handlers Simulados para Acciones ---
   const handleValidate = (psychologistId) => {
      alert(`Simulación: Validar psicólogo con ID ${psychologistId}`);
      // Lógica futura: Llamar a API PUT /psychologists/:id/validate
      // Actualizar estado local (quitar de pendientes, etc.)
      setPendingPsychologists(prev => prev.filter(p => p.id !== psychologistId));
      setStats(prev => ({ ...prev, pending: prev.pending - 1, activePsy: prev.activePsy + 1 }));
   };

   const handleReject = (psychologistId) => {
      alert(`Simulación: Rechazar psicólogo con ID ${psychologistId}`);
      // Lógica futura: Llamar a API DELETE /psychologists/:id o PUT /psychologists/:id/reject
      setPendingPsychologists(prev => prev.filter(p => p.id !== psychologistId));
      setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
   };


   // --- Renderizado ---
   if (loading) {
      return <div className={styles.page}><p className={styles.loadingMessage}>Cargando dashboard...</p></div>;
   }
   if (error) {
      return <div className={styles.page}><p className={`${styles.card} ${styles.errorMessage}`}>{error}</p></div>;
   }

   return (
      <div className={styles.page}>
         <h1 className={styles.mainTitle}>Panel de Administración</h1>

         {/* --- Sección Estadísticas --- */}
         <section className={styles.statsGrid}>
            <div className={styles.statCard}>
               <span className={styles.statValue}>{stats.totalUsers}</span>
               <span className={styles.statLabel}>Usuarios Totales</span>
            </div>
            <div className={styles.statCard}>
               <span className={styles.statValue}>{stats.pending}</span>
               <span className={styles.statLabel}>Psicólogos Pendientes</span>
            </div>
            <div className={styles.statCard}>
               <span className={styles.statValue}>{stats.activePsy}</span>
               <span className={styles.statLabel}>Psicólogos Activos</span>
            </div>
            {/* Añadir más stats si es necesario */}
         </section>

         {/* --- Sección Psicólogos Pendientes (Tabla) --- */}
         <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Psicólogos Pendientes de Validación ({pendingPsychologists.length})</h2>
            {pendingPsychologists.length === 0 ? (
               <p className={styles.emptyMessage}>No hay psicólogos pendientes.</p>
            ) : (
               <table className={styles.dataTable}>
                  <thead>
                     <tr>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Licencia</th>
                        <th>Enviado</th>
                        <th>Acciones</th>
                     </tr>
                  </thead>
                  <tbody>
                     {pendingPsychologists.map(p => (
                        <tr key={p.id}>
                           <td>{p.first_name} {p.last_name}</td>
                           <td>{p.specialty}</td>
                           <td>{p.license_number}</td>
                           <td>{new Date(p.submitted_at).toLocaleDateString()}</td>
                           <td className={styles.actionsCell}>
                              <button
                                 className={`${styles.actionButton} ${styles.validateButton}`}
                                 onClick={() => handleValidate(p.id)}
                              >
                                 Validar
                              </button>
                              <button
                                 className={`${styles.actionButton} ${styles.rejectButton}`}
                                 onClick={() => handleReject(p.id)}
                              >
                                 Rechazar
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </section>

         {/* --- Sección Últimos Usuarios (Tabla) --- */}
         <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Últimos Usuarios Registrados ({users.length})</h2>
            <table className={styles.dataTable}>
               <thead>
                  <tr>
                     <th>Nombre</th>
                     <th>Email</th>
                     <th>Rol</th>
                     <th>Fecha Registro</th>
                     {/* <th>Acciones</th> */}
                  </tr>
               </thead>
               <tbody>
                  {users.map(u => (
                     <tr key={u.id}>
                        <td>{u.first_name} {u.last_name}</td>
                        <td>{u.email}</td>
                        <td><span className={`${styles.roleBadge} ${styles[u.role]}`}>{u.role}</span></td>
                        <td>{new Date(u.registration_date).toLocaleDateString()}</td>
                        {/* <td className={styles.actionsCell}> <button className={styles.actionButton}>Ver</button> </td> */}
                     </tr>
                  ))}
               </tbody>
            </table>
         </section>
         <AdminExportExcel
  users={users}
  patients={mockPatients}
  psychologists={mockPsychologists}
/>

      </div>
   );
}