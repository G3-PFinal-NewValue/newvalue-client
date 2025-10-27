import { useState, useEffect, useMemo } from 'react';
import { getAllPsychologistProfiles } from '../../../services/psychologistsService';
import PsychologistCard from '../../../components/common/PsychologistCard/PsychologistCard';
import styles from './PsychologistListPage.module.css';

// Lista de especialidades (mantenida por si la necesitas más adelante)
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
    setLoading(true);
    setError(null);
    getAllPsychologistProfiles() // Llama a la función del servicio
      .then(profiles => {
        console.log("API Response (raw):", profiles); // DEBUG 1
        // Asegurémonos de que SIEMPRE sea un array
        const profilesArray = Array.isArray(profiles) ? profiles : [];
        console.log("Setting allPsychologists to:", profilesArray); // DEBUG 2
        setAllPsychologists(profilesArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando psicólogos (API):", err);
        setError("No se pudieron cargar los perfiles.");
        setAllPsychologists([]); // Asegura array vacío en error
        setLoading(false);
      });
  }, []);

  // Lista filtrada (Temporalmente devuelve todos)
  const filteredPsychologists = useMemo(() => {
    console.log("Calculating filteredPsychologists. allPsychologists:", allPsychologists, "selectedSpecialty:", selectedSpecialty); // DEBUG 3
    setCurrentPage(1); // Reset page on filter change

    // 👇 TEMPORALMENTE IGNORAMOS EL FILTRO 👇
    return allPsychologists; // Siempre devuelve todos por ahora

    /* Lógica original comentada:
    if (!selectedSpecialty) {
      return allPsychologists;
    }
    if (!Array.isArray(allPsychologists)) {
        console.warn("allPsychologists is not an array in filteredPsychologists memo!");
        return [];
    }
    // ESTA LÓGICA NECESITA AJUSTE PORQUE 'psy.specialty' NO EXISTE DIRECTAMENTE
    return allPsychologists.filter(
      (psy) => psy.specialty === selectedSpecialty // Esto necesitará cambiar
    );
    */
  }, [allPsychologists /* , selectedSpecialty */]); // Quitamos selectedSpecialty de las dependencias temporalmente

  // Datos para la paginación
  const paginationData = useMemo(() => {
    // DEBUG 4: Verifica el tipo JUSTO ANTES de usar .slice()
    console.log("Calculating paginationData. filteredPsychologists:", filteredPsychologists, "Type:", typeof filteredPsychologists, "Is Array:", Array.isArray(filteredPsychologists));

    // Guarda para evitar el crash si filteredPsychologists no es array
    if (!Array.isArray(filteredPsychologists)) {
        console.error("¡filteredPsychologists NO es un array justo antes de slice!");
        return {
            totalItems: 0, totalPages: 0, startIndex: 0, endIndex: 0,
            currentPage: 1, currentPsychologists: []
        };
    }

    const totalItems = filteredPsychologists.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const validCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentPsychologists = filteredPsychologists.slice(startIndex, endIndex); // <-- Línea 63 aprox.

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

  // --- Manejadores ---
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

  // --- Renderizado ---
  if (loading) {
    return <div className={styles.pageContainer}><p className={styles.loadingMessage}>Cargando psicólogos...</p></div>;
  }
  if (error) {
     return <div className={styles.pageContainer}><p className={styles.errorMessage}>{error}</p></div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Encuentra a tu psicólogo</h1>

      {/* Filtros */}
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

      {/* Grid y Mensajes */}
      <>
        <div className={styles.listGrid}>
          {paginationData.currentPsychologists.length > 0 ? (
            paginationData.currentPsychologists.map((psy) => (
              // 👇 KEY CORREGIDA 👇
              <PsychologistCard key={psy.user_id} psychologist={psy} />
            ))
          ) : (
            <p className={styles.noResultsMessage}>
              {/* Ajustar mensaje si es necesario */}
              No hay psicólogos disponibles en este momento.
            </p>
          )}
        </div>

        {/* Paginación */}
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
    </div>
  );
}