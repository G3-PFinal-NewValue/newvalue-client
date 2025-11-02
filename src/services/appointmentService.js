import api from "./apiClient";

/**
 * Obtiene todas las citas para el usuario autenticado (paciente o psicólogo).
 * El backend filtra automáticamente por el rol del usuario.
 * @returns {Promise<object>} Objeto con { total, page, totalPages, appointments }
 */
export async function getMyAppointments() {
  try {
    const response = await api.get("/appointment");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mis citas:", error);
    throw error;
  }
}

/**
 * Cancela una cita (actualiza el estado a 'cancelled').
 * @param {string|number} appointmentId ID de la cita a cancelar
 * @returns {Promise<object>} La cita actualizada
 */
export async function cancelAppointment(appointmentId) {
  try {
    const response = await api.put(`/appointment/${appointmentId}`, {
      status: 'cancelled'
    });
    return response.data;
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    throw error;
  }
}