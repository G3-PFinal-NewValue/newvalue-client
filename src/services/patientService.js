import api from "./apiClient";

/**
 * @param {string|number} userId 
 * @returns {Promise<object|null>} 
 */
export async function getPatientProfileById(userId) {
  if (!userId) {
    console.error("getPatientProfileById: Se requiere userId");
    throw new Error("User ID is required");
  }
  try {
    console.log(`Llamando a GET /patient/${userId}...`);
    const response = await api.get(`/patient/${userId}`);
    console.log("Perfil de paciente recibido:", response.data);
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      console.warn(`Perfil de paciente no encontrado para user ID ${userId}`);
      return null;
    }
    console.error(`Error al obtener el perfil del paciente ${userId}:`, error);
    throw error; 
  }
}

/**

 * @param {FormData} formData 
 * @returns {Promise<object>}
 */
export async function createPatientProfile(formData) {
  try {
    console.log("Enviando datos del perfil (FormData) a POST /patient...");
    const response = await api.post("/patient", formData);
    console.log("Respuesta de creación de perfil paciente:", response.data);
    return response.data.patient;
  } catch (error) {
    console.error("Error al crear el perfil del paciente:", error);
    throw error;
  }
}

/**
 * Actualiza un perfil de paciente existente.
 * @param {string|number} userId 
 * @param {FormData} formData 
 * @returns {Promise<object>} 
 */
export async function updatePatientProfile(userId, formData) {
   if (!userId) {
    console.error("updatePatientProfile: Se requiere userId");
    throw new Error("User ID is required");
  }
  try {
    console.log(`Enviando datos actualizados (FormData) a PUT /patient/${userId}...`);
    const response = await api.put(`/patient/${userId}`, formData);
    console.log("Respuesta de actualización de perfil paciente:", response.data);
   
    return response.data.patient;
  } catch (error) {
    console.error(`Error al actualizar el perfil del paciente ${userId}:`, error);
    throw error;
  }
}