import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
// 1. Importar los servicios del admin
import {
  adminGetAllUsers,
  adminGetAllPatients,
  adminGetAllPsychologists,
  adminValidatePsychologist,
  adminRejectPsychologist,
  adminDeactivateUser,
  adminActivateUser
} from '../../../services/adminService'; // Ajusta la ruta si es necesario
import styles from './AdminDashboard.module.css';
import AdminExportExcel from '../../../components/AdminExportExcel';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Estados para los datos reales
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, pending: 0, activePsy: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. Función para cargar y procesar datos ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todos los datos en paralelo
      const [usersData, patientsData, psychologistsData] = await Promise.all([
        adminGetAllUsers(),
        adminGetAllPatients(),
        adminGetAllPsychologists(),
      ]);

      // Procesar y actualizar estados
      setUsers(usersData);
      setPatients(patientsData);
      setPsychologists(psychologistsData);

      // Filtrar psicólogos pendientes
      const pending = psychologistsData.filter(p => !p.validated);
      setPendingPsychologists(pending);

      // Calcular estadísticas
      setStats({
        totalUsers: usersData.length,
        pending: pending.length,
        activePsy: psychologistsData.filter(p => p.validated && p.status === 'active').length,
      });

    } catch (err) {
      console.error("Error cargando datos del dashboard:", err);
      setError("No se pudieron cargar los datos. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. useEffect ahora llama a fetchData ---
  useEffect(() => {
    fetchData();
  }, []); // Se ejecuta solo una vez al montar

  // --- 5. Handlers de acciones reales ---
  const handleValidate = async (psychologistId) => {
    try {
      await adminValidatePsychologist(psychologistId);
      // Actualizar estado local (optimista)
      setPendingPsychologists(prev => prev.filter(p => p.user_id !== psychologistId));

      // Actualizamos la lista principal
      const newPsychologists = psychologists.map(p =>
        p.user_id === psychologistId ? { ...p, validated: true } : p
      );
      setPsychologists(newPsychologists);

      // Recalcular stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        activePsy: newPsychologists.filter(p => p.validated && p.status === 'active').length
      }));

    } catch (err) {
      alert(`Error al validar: ${err.message}`);
    }
  };

  const handleReject = async (psychologistId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este perfil? Esta acción también eliminará al usuario asociado.")) {
      try {
        await adminRejectPsychologist(psychologistId);

        setUsers(prev => prev.filter(u => u.id !== psychologistId));
        setPsychologists(prev => prev.filter(p => p.user_id !== psychologistId));
        setPendingPsychologists(prev => prev.filter(p => p.user_id !== psychologistId));

        const newPsychologists = psychologists.filter(p => p.user_id !== psychologistId);
        setStats(prev => ({
          totalUsers: prev.totalUsers - 1,
          pending: newPsychologists.filter(p => !p.validated).length,
          activePsy: newPsychologists.filter(p => p.validated && p.status === 'active').length
        }));

      } catch (err) {
        alert(`Error al rechazar: ${err.message}`);
      }
    }
  };

  const handleToggleUserStatus = async (userToToggle) => {
    const isActivating = userToToggle.status !== 'active';
    const actionText = isActivating ? "activar" : "desactivar";

    if (window.confirm(`¿Estás seguro de que deseas ${actionText} a este usuario?`)) {
      try {
        if (isActivating) {
          await adminActivateUser(userToToggle.id);
        } else {
          await adminDeactivateUser(userToToggle.id);
        }

        // Actualizar el estado local (optimista)
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === userToToggle.id
              ? { ...u, status: isActivating ? 'active' : 'inactive' }
              : u
          )
        );

      } catch (err) {
        alert(`Error al ${actionText} al usuario: ${err.message}`);
      }
    }
  };

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
                <th>Email (Usuario)</th>
                <th>Especialidades</th>
                <th>Licencia</th>
                <th>Enviado</th> {/* <-- DESCOMENTA/AÑADE ESTE ENCABEZADO */}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingPsychologists.map(p => {
                // Buscamos el usuario correspondiente para obtener nombre y email
                const userInfo = users.find(u => u.id === p.user_id);
                return (
                  <tr key={p.user_id}>
                    <td>{userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Usuario no encontrado'}</td>
                    <td>{userInfo ? userInfo.email : 'N/A'}</td>
                    <td>
                      {/* El backend entrega un array 'specialities' */}
                      {p.specialities && p.specialities.length > 0
                        ? p.specialities.map(s => s.name).join(', ')
                        : 'No especificada'}
                    </td>
                    <td>{p.license_number}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className={styles.actionsCell}>
                      <Link
                        to={`/profile/${p.user_id}`}
                        target="_blank" // Abre en una nueva pestaña
                        rel="noopener noreferrer"
                        className={`${styles.actionButton} ${styles.viewButton}`}
                      >
                        Ver Perfil
                      </Link>
                      <button
                        className={`${styles.actionButton} ${styles.validateButton}`}
                        onClick={() => handleValidate(p.user_id)}
                      >
                        Validar
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                        onClick={() => handleReject(p.user_id)}
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* --- Sección Últimos Usuarios (Tabla) --- */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Últimos Usuarios Registrados ({users.length})</h2>
        <Link to="/create-user">
      <Button>Crear Nuevo Usuario</Button>
      </Link>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              {/* <th>Fecha Registro</th> */}
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[u.role?.name || '']}`}>
                    {u.role?.name || 'N/A'}
                  </span>
                </td>
                <td>{u.status}</td> { /* <-- Nuevo Campo */}
                <td className={styles.actionsCell}>
                  {/* Solo mostrar "Ver Perfil" si es psicólogo */}
                  {u.role?.name === 'psychologist' && (
                    <Link
                      to={`/profile/${u.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.actionButton} ${styles.viewButton}`}
                    >
                      Ver Perfil
                    </Link>
                  )}
                  {/* No permitir que el admin se desactive a sí mismo */}
                  {user.id !== u.id && u.role?.name !== 'admin' && (
                    <button
                      className={`${styles.actionButton} ${u.status === 'active' ? styles.deactivateButton : styles.activateButton}`}
                      onClick={() => handleToggleUserStatus(u)}
                    >
                      {u.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>


      {/* --- Exportar Excel --- */}
      <AdminExportExcel
        users={users}
        patients={patients}
        psychologists={psychologists}
      />
    </div>
  );
}