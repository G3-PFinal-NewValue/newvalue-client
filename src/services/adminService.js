import api from "./apiClient";

/**
 * Obtiene todos los usuarios (solo admin).
 */
export async function adminGetAllUsers() {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error en adminGetAllUsers:", error);
    throw error;
  }
}

/**
 * Obtiene todos los pacientes (solo admin).
 */
export async function adminGetAllPatients() {
  try {
    const response = await api.get("/patient");
    return response.data;
  } catch (error) {
    console.error("Error en adminGetAllPatients:", error);
    throw error;
  }
}

/**
 * Obtiene todos los psicólogos, incluidos inactivos y no validados (solo admin).
 */
export async function adminGetAllPsychologists() {
  try {
    // Usamos includeInactive=true para traerlos TODOS
    const response = await api.get("/psychologist?includeInactive=true");
    return response.data;
  } catch (error) {
    console.error("Error en adminGetAllPsychologists:", error);
    throw error;
  }
}

/**
 * Valida el perfil de un psicólogo (solo admin).
 * @param {string|number} psychologistId ID del usuario psicólogo
 */
export async function adminValidatePsychologist(psychologistId) {
  try {
    const response = await api.patch(`/psychologist/${psychologistId}/validate`);
    return response.data;
  } catch (error) {
    console.error("Error en adminValidatePsychologist:", error);
    throw error;
  }
}

/**
 * Elimina el perfil de un psicólogo (solo admin).
 * @param {string|number} psychologistId ID del usuario psicólogo
 */
export async function adminRejectPsychologist(psychologistId) {
  try {
    const response = await api.delete(`/psychologist/${psychologistId}`);
    return response.data;
  } catch (error) {
    console.error("Error en adminRejectPsychologist:", error);
    throw error;
  }
}

/**
 * Desactiva un usuario (solo admin).
 * @param {string|number} userId ID del usuario
 */
export async function adminDeactivateUser(userId) {
  try {
    const response = await api.patch(`/user/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("Error en adminDeactivateUser:", error);
    throw error;
  }
}

/**
 * Activa un usuario (solo admin).
 * @param {string|number} userId ID del usuario
 */
export async function adminActivateUser(userId) {
  try {
    const response = await api.patch(`/user/${userId}/activate`);
    return response.data;
  } catch (error) {
    console.error("Error en adminActivateUser:", error);
    throw error;
  }
}

/**
 * Crea un nuevo usuario (solo admin).
 * @param {Object} userData - Objeto con los datos del usuario a crear
 */
export async function adminCreateUser(userData) {
  try {
    const response = await api.post("/user/create-user", userData);
    return response.data;
  } catch (error) {
    console.error("Error en adminCreateUser:", error);
    throw error;
  }
}