import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../../../components/button';
import Swal from 'sweetalert2'; 
import {
  adminGetAllUsers,
  adminGetAllPatients,
  adminGetAllPsychologists,
  adminValidatePsychologist,
  adminRejectPsychologist,
  adminDeactivateUser,
  adminActivateUser
} from '../../../services/adminService';
import styles from './AdminDashboard.module.css';
import AdminExportExcel from '../../../components/AdminExportExcel';
import UserSearchFilter from './UserSearchFilter';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, pending: 0, activePsy: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, patientsData, psychologistsData] = await Promise.all([
        adminGetAllUsers(),
        adminGetAllPatients(),
        adminGetAllPsychologists(),
      ]);

      setUsers(usersData);
      setPatients(patientsData);
      setPsychologists(psychologistsData);

      const pending = psychologistsData.filter(p => !p.validated);
      setPendingPsychologists(pending);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleValidate = async (psychologistId) => {
    try {
      await adminValidatePsychologist(psychologistId);

      // Actualizar el estado local inmediatamente para mejor UX
      setPendingPsychologists(prev => prev.filter(p => p.user_id !== psychologistId));

      const newPsychologists = psychologists.map(p =>
        p.user_id === psychologistId ? { ...p, validated: true } : p
      );
      setPsychologists(newPsychologists);

      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        activePsy: newPsychologists.filter(p => p.validated && p.status === 'active').length
      }));

      // Refrescar los datos del servidor para asegurar sincronización
      await fetchData();

      Swal.fire({
        icon: 'success',
        title: 'Validación completada',
        text: 'El psicólogo ha sido validado correctamente.',
        confirmButtonColor: '#3085d6'
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al validar',
        text: err.message,
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleReject = async (psychologistId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción también eliminará al usuario asociado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (result.isConfirmed) {
      try {
        await adminRejectPsychologist(psychologistId);

        // Actualizar el estado local inmediatamente para mejor UX
        setUsers(prev => prev.filter(u => u.id !== psychologistId));
        setPsychologists(prev => prev.filter(p => p.user_id !== psychologistId));
        setPendingPsychologists(prev => prev.filter(p => p.user_id !== psychologistId));

        const newPsychologists = psychologists.filter(p => p.user_id !== psychologistId);
        setStats(prev => ({
          totalUsers: prev.totalUsers - 1,
          pending: newPsychologists.filter(p => !p.validated).length,
          activePsy: newPsychologists.filter(p => p.validated && p.status === 'active').length
        }));

        // Refrescar los datos del servidor para asegurar sincronización
        await fetchData();

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El perfil ha sido eliminado correctamente.',
          confirmButtonColor: '#3085d6'
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error al rechazar',
          text: err.message,
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  const handleToggleUserStatus = async (userToToggle) => {
    const isActivating = userToToggle.status !== 'active';
    const actionText = isActivating ? "activar" : "desactivar";

    const result = await Swal.fire({
      title: `¿Deseas ${actionText} a este usuario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      try {
        if (isActivating) {
          await adminActivateUser(userToToggle.id);
        } else {
          await adminDeactivateUser(userToToggle.id);
        }

        // Actualizar el estado local inmediatamente para mejor UX
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === userToToggle.id
              ? { ...u, status: isActivating ? 'active' : 'inactive' }
              : u
          )
        );

        // Refrescar los datos del servidor para asegurar sincronización
        await fetchData();

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `El usuario ha sido ${isActivating ? 'activado' : 'desactivado'} correctamente.`,
          confirmButtonColor: '#3085d6'
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: `Error al ${actionText}`,
          text: err.message,
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loadingMessage}>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={`${styles.card} ${styles.errorMessage}`}>{error}</p>
      </div>
    );
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
        <h2 className={styles.sectionTitle}>
          Psicólogos Pendientes de Validación ({pendingPsychologists.length})
        </h2>
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
                <th>Enviado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingPsychologists.map(p => {
                const userInfo = users.find(u => u.id === p.user_id);
                return (
                  <tr key={p.user_id}>
                    <td>
                      {userInfo
                        ? `${userInfo.first_name} ${userInfo.last_name}`
                        : 'Usuario no encontrado'}
                    </td>
                    <td>{userInfo ? userInfo.email : 'N/A'}</td>
                    <td>
                      {p.specialities && p.specialities.length > 0
                        ? p.specialities.map(s => s.name).join(', ')
                        : 'No especificada'}
                    </td>
                    <td>{p.license_number}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className={styles.actionsCell}>
                      <Link
                        to={`/profile/${p.user_id}`}
                        target="_blank"
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
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* --- Sección Últimos Usuarios (Tabla) --- */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>
          Últimos Usuarios Registrados ({users.length})
        </h2>
        <div className={styles.usersGrid}>
        <Link to="/admin/create-user">
          <Button>Crear Nuevo Usuario</Button>
        </Link>
        {/* --- FILTRO DE BÚSQUEDA Y ROL --- */}
        <UserSearchFilter
          onFilter={async ({ search, role }) => {
            try {
              const query = new URLSearchParams();
              if (search) query.append('search', search);
              if (role) query.append('role', role);
              const filtered = await adminGetAllUsers(`?${query.toString()}`);
              setUsers(filtered);
            } catch (err) {
              console.error('Error filtrando usuarios:', err);
            }
          }}
        /></div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
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
                <td>{u.status}</td>
                <td className={styles.actionsCell}>
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