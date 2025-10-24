import { useState, useEffect, useMemo } from 'react';
import { getAllPsychologistProfiles } from '../../../services/psychologistsService';
import PsychologistCard from '../../../components/common/PsychologistCard/PsychologistCard';
import styles from './PsychologistListPage.module.css';

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
      setTimeout(() => {
        setAllPsychologists(profiles); 
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
    
    setCurrentPage(1);
    if (!selectedSpecialty) {
      return allPsychologists; // Si no hay filtro, mostrar todos
    }
    return allPsychologists.filter(
      (psy) => psy.specialty === selectedSpecialty
    );
  }, [allPsychologists, selectedSpecialty]); 


  const paginationData = useMemo(() => {
    const totalItems = filteredPsychologists.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const validCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPsychologists = filteredPsychologists.slice(startIndex, endIndex);

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
      currentPage: validCurrentPage, 
      currentPsychologists, 
    };
  }, [filteredPsychologists, currentPage]); 

  const handleFilterChange = (event) => {
    setSelectedSpecialty(event.target.value);
    
  };


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


      {loading && <p className={styles.loadingMessage}>Cargando psicólogos...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && (
        <> 
          <div className={styles.listGrid}>
           
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


          {paginationData.totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <button
                onClick={goToPreviousPage}
                disabled={paginationData.currentPage === 1}
                className={styles.paginationButton}
              >
                &lt; Anterior
              </button>
           
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
      
        </>
      )}
    </div>
  );
}