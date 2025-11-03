import api from "./apiClient";

/**
 * Obtiene la lista de todas las especialidades.
 * Requiere autenticación.
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export async function getAllSpecialities() {
  try {
    const response = await api.get("/speciality");
    return response.data;
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    throw error;
  }
}