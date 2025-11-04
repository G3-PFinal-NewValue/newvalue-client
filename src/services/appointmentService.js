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
 * Crea una nueva cita.
 * @param {object} appointmentData Datos de la cita
 * @returns {Promise<object>} La cita creada
 */
export async function createAppointment(appointmentData) {
  try {
    const response = await api.post("/appointment", appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la cita:", error);
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
      status: "cancelled",
    });
    return response.data;
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    throw error;
  }
}

/**
 * Obtiene todas las citas para un psicólogo específico (incluyendo pendientes).
 * @param {string|number} psychologistId ID del psicólogo (user_id)
 * @returns {Promise<Array<object>>} Lista de citas del psicólogo
 */
export async function getPsychologistAppointments(psychologistId) {
  if (!psychologistId) return [];
  try {
    const response = await api.get(
      `/appointment?psychologist_id=${psychologistId}`
    );
    return response.data.appointments || response.data || [];
  } catch (error) {
    console.error("Error al obtener citas del psicólogo:", error);
    // Datos de fallback para testing
    return [
      {
        id: 1,
        patient_id: 1,
        psychologist_id: psychologistId,
        date: new Date(Date.now() + 86400000).toISOString(),
        duration_minutes: 45,
        status: "pending",
        patient: {
          first_name: "Ana",
          last_name: "García",
          email: "ana@email.com",
        },
      },
    ];
  }
}

/**
 * Confirma una cita (actualiza el estado a 'confirmed').
 * @param {string|number} appointmentId ID de la cita a confirmar
 * @returns {Promise<object>} La cita actualizada
 */
export async function confirmAppointment(appointmentId) {
  try {
    const response = await api.patch(`/appointment/${appointmentId}`, {
      status: "confirmed",
    });
    return response.data;
  } catch (error) {
    console.error("Error al confirmar la cita:", error);
    throw error;
  }
}

/**
 * Rechaza una cita (actualiza el estado a 'cancelled').
 * @param {string|number} appointmentId ID de la cita a rechazar
 * @returns {Promise<object>} La cita actualizada
 */
export async function rejectAppointment(appointmentId) {
  try {
    const response = await api.patch(`/appointment/${appointmentId}`, {
      status: "cancelled",
    });
    return response.data;
  } catch (error) {
    console.error("Error al rechazar la cita:", error);
    throw error;
  }
}

/**
 * Obtiene las citas reservadas (confirmadas/pendientes) para un psicólogo específico.
 * @param {string|number} psychologistId ID del psicólogo (user_id)
 * @returns {Promise<Array<{date: string, duration_minutes: number}>>}
 */
export async function getBookedSlotsForPsychologist(psychologistId) {
  if (!psychologistId) return [];
  try {
    const response = await api.get(`/psychologist/${psychologistId}/booked`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener citas reservadas:", error);
    throw error;
  }
}
