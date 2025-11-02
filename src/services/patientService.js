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

/**
 * Obtiene todos los pacientes.
 * @returns {Promise<Array<object>>} Lista de pacientes
 */
export async function getAllPatients() {
  try {
    const response = await api.get("/patient");
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    // Datos de fallback
    return [
      { id: 1, first_name: "Ana", last_name: "García", email: "ana@email.com", role: "patient" },
      { id: 2, first_name: "Pedro", last_name: "Martín", email: "pedro@email.com", role: "patient" }
    ];
  }
}

/**
 * Obtiene los pacientes asociados con un psicólogo específico.
 * @param {string|number} psychologistId ID del psicólogo
 * @returns {Promise<Array<object>>} Lista de pacientes del psicólogo
 */
export async function getPatientsByPsychologist(psychologistId) {
  if (!psychologistId) return [];
  
  try {
    // Intentar obtener pacientes específicos del psicólogo
    const response = await api.get(`/psychologist/${psychologistId}/patients`);
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener pacientes del psicólogo:", error);
    
    // Fallback: obtener todos los pacientes como respuesta por defecto
    try {
      const allPatients = await getAllPatients();
      return allPatients.slice(0, 3); // Limitar a 3 para simular relación
    } catch {
      return [
        { id: 1, first_name: "Ana", last_name: "García", email: "ana@email.com", role: "patient" },
        { id: 2, first_name: "Pedro", last_name: "Martín", email: "pedro@email.com", role: "patient" }
      ];
    }
  }
}