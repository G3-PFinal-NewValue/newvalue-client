import { useState, useEffect, useMemo } from 'react';
import { getAllPsychologistProfiles } from '../../../services/psychologistsService';
import { getAllSpecialities } from '../../../services/specialityService';
import PsychologistCard from '../../../components/common/PsychologistCard/PsychologistCard';
import styles from './PsychologistListPage.module.css';

// Lista de especialidades (mantenida por si la necesitas más adelante)
const ITEMS_PER_PAGE = 6;

export default function PsychologistListPage() {
  const [displayedPsychologists, setDisplayedPsychologists] = useState([]); // Lista filtrada por la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSpecialties, setAllSpecialties] = useState([]); // Para poblar el dropdown
  const [selectedSpecialty, setSelectedSpecialty] = useState(''); // Estado para el filtro
  const [currentPage, setCurrentPage] = useState(1); // Estado para página actual


  useEffect(() => {
    getAllSpecialities()
      .then(data => {
        setAllSpecialties(data);
      })
      .catch(err => {
        console.error("Error cargando especialidades:", err);
        // Opcional: mostrar un error al usuario
      });
  }, []); // El array vacío significa que solo se ejecuta al montar

useEffect(() => {
    setLoading(true);
    setError(null);
    
    // 7. Pasa el ID seleccionado (o null/undefined) al servicio
    getAllPsychologistProfiles(selectedSpecialty)
      .then(profiles => {
        const profilesArray = Array.isArray(profiles) ? profiles : [];
        setDisplayedPsychologists(profilesArray);
        setCurrentPage(1); // Resetea a la página 1 cada vez que el filtro cambia
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando psicólogos (API):", err);
        setError("No se pudieron cargar los perfiles.");
        setDisplayedPsychologists([]); 
        setLoading(false);
      });
  }, [selectedSpecialty]);


const paginationData = useMemo(() => {
    if (!Array.isArray(displayedPsychologists)) {
        return {
            totalItems: 0, totalPages: 0, currentPage: 1, currentPsychologists: []
        };
    }

    const totalItems = displayedPsychologists.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const validCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentPsychologists = displayedPsychologists.slice(startIndex, endIndex);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && totalPages > 0) {
       setCurrentPage(1);
    }

    return {
      totalItems,
      totalPages,
      currentPage: validCurrentPage,
      currentPsychologists,
    };
  }, [displayedPsychologists, currentPage]); 

  // --- Manejadores ---
  const handleFilterChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  // --- Renderizado ---
  if (loading) {
    return <div className={styles.pageContainer}><p className={styles.loadingMessage}>Cargando psicólogos...</p></div>;
  }
  if (error) {
     return <div className={styles.pageContainer}><p className={styles.errorMessage}>{error}</p></div>;
  }

return (
    <div className={styles.pageContainer}>
      {/* Sección de introducción */}
      <div className={styles.introSection}>
        <h1 className={styles.pageTitle}>Conoce a nuestro equipo profesional</h1>
        <p className={styles.introText}>
          Nuestros psicólogos están altamente cualificados y comprometidos con tu bienestar. 
          Cada profesional cuenta con experiencia especializada para brindarte la mejor atención 
          personalizada. Explora nuestro equipo y descubre quién puede acompañarte en tu proceso 
          de crecimiento personal.
        </p>
        <p className={styles.callToAction}>
          💡 Haz clic en cualquier profesional para conocer más sobre su experiencia y especialidades
        </p>
      </div>

      <div className={styles.filtersContainer}>
        <label htmlFor="specialtyFilter" className={styles.filterLabel}>Filtrar por especialidad:</label>
        <select
          id="specialtyFilter"
          value={selectedSpecialty}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="">-- Todas las especialidades --</option>
          {/* Mapea desde el estado 'allSpecialties' */}
          {allSpecialties.map((spec) => (
            <option key={spec.id} value={spec.id}> {/* <-- El valor es el ID */}
              {spec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid y Mensajes */}
      <>
        {/* Mostramos 'loading' aquí si solo están cargando los psicólogos */}
        {loading && <p className={styles.loadingMessage}>Filtrando psicólogos...</p>}

        {!loading && (
          <div className={styles.listGrid}>
            {paginationData.currentPsychologists.length > 0 ? (
              paginationData.currentPsychologists.map((psy) => (
                <PsychologistCard key={psy.user_id} psychologist={psy} />
              ))
            ) : (
              <p className={styles.noResultsMessage}>
                {/* Mensaje dinámico */}
                {selectedSpecialty
                  ? "No hay psicólogos con la especialidad seleccionada."
                  : "No hay psicólogos disponibles en este momento."
                }
              </p>
            )}
          </div>
        )}

        {/* Paginación */}
        {!loading && paginationData.totalPages > 1 && (
          <div className={styles.paginationContainer}>
            {/* ... (botones de paginación sin cambios) ... */}
          </div>
        )}
      </>
    </div>
  );
}