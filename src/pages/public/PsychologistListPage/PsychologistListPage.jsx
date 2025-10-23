// src/pages/public/PsychologistListPage/PsychologistListPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { getAllPsychologistProfiles } from '../../../services/psychologistsService';
import PsychologistCard from '../../../components/common/PsychologistCard/PsychologistCard';
import styles from './PsychologistListPage.module.css';

// Lista de especialidades (podría venir de una API en el futuro)
const SPECIALTIES = [
  "Terapia Cognitivo-Conductual",
  "Ansiedad y Estrés",
  "Depresión",
  "Terapia de Pareja",
  "Mindfulness",
  "Duelo",
  "Trastornos del Sueño",
  "Otro",
];

// Definir cuántos items por página
const ITEMS_PER_PAGE = 6;

export default function PsychologistListPage() {
  const [allPsychologists, setAllPsychologists] = useState([]); // Lista original
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(''); // Estado para el filtro
  const [currentPage, setCurrentPage] = useState(1); // Estado para página actual

  useEffect(() => {
    // Carga inicial de *todos* los psicólogos
    setLoading(true);
    setError(null);
    try {
      const profiles = getAllPsychologistProfiles();
      // Simulamos un pequeño retraso
      setTimeout(() => {
        setAllPsychologists(profiles); // Guardamos la lista completa
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error cargando psicólogos (mock):", err);
      setError("No se pudieron cargar los perfiles.");
      setAllPsychologists([]);
      setLoading(false);
    }
  }, []);

  // Lista filtrada
  const filteredPsychologists = useMemo(() => {
    // Reiniciar a página 1 cuando cambia el filtro
    setCurrentPage(1);
    if (!selectedSpecialty) {
      return allPsychologists; // Si no hay filtro, mostrar todos
    }
    return allPsychologists.filter(
      (psy) => psy.specialty === selectedSpecialty
    );
  }, [allPsychologists, selectedSpecialty]); // Se recalcula si cambia la lista o el filtro

  // Calcular datos para paginación
  const paginationData = useMemo(() => {
    const totalItems = filteredPsychologists.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    // Asegurarse de que currentPage no sea mayor que totalPages después de filtrar
    const validCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPsychologists = filteredPsychologists.slice(startIndex, endIndex);

    // Actualizar currentPage si se quedó fuera de rango
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && totalPages > 0) {
       setCurrentPage(1);
    }


    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      currentPage: validCurrentPage, // Devolver la página actual válida
      currentPsychologists, // Psicólogos a mostrar en la página actual
    };
  }, [filteredPsychologists, currentPage]); // Recalcular si cambia la lista filtrada o la página

  // Manejador para el cambio en el select del filtro
  const handleFilterChange = (event) => {
    setSelectedSpecialty(event.target.value);
    // El useMemo de filteredPsychologists se encargará de resetear la página a 1
  };

  // Funciones para cambiar de página
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, paginationData.totalPages));
  };
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, paginationData.totalPages)));
  };


  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Encuentra a tu psicólogo</h1>

      {/* --- Filtro --- */}
      {!loading && !error && allPsychologists.length > 0 && (
        <div className={styles.filtersContainer}>
          <label htmlFor="specialtyFilter" className={styles.filterLabel}>Filtrar por especialidad:</label>
          <select
            id="specialtyFilter"
            value={selectedSpecialty}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">-- Todas las especialidades --</option>
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* --- Fin Filtro --- */}

      {loading && <p className={styles.loadingMessage}>Cargando psicólogos...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && (
        <> {/* Fragment para agrupar lista y paginación */}
          <div className={styles.listGrid}>
            {/* Usar currentPsychologists de paginationData */}
            {paginationData.currentPsychologists.length > 0 ? (
              paginationData.currentPsychologists.map((psy) => (
                <PsychologistCard key={psy.id} psychologist={psy} />
              ))
            ) : (
              <p className={styles.noResultsMessage}>
                {selectedSpecialty
                  ? `No se encontraron psicólogos con la especialidad "${selectedSpecialty}".`
                  : 'No hay psicólogos disponibles en este momento.'}
              </p>
            )}
          </div>

          {/* --- Paginación --- */}
          {/* Solo mostrar si hay más de una página */}
          {paginationData.totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <button
                onClick={goToPreviousPage}
                disabled={paginationData.currentPage === 1}
                className={styles.paginationButton}
              >
                &lt; Anterior
              </button>
              {/* Podríamos añadir números de página aquí si quisiéramos */}
              <span className={styles.paginationInfo}>
                Página {paginationData.currentPage} de {paginationData.totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={paginationData.currentPage === paginationData.totalPages}
                className={styles.paginationButton}
              >
                Siguiente &gt;
              </button>
            </div>
          )}
          {/* --- Fin Paginación --- */}
        </>
      )}
    </div>
  );
}