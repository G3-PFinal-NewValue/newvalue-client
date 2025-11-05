// Utility functions for data transformation and common operations

/**
 * Formats backend user data to frontend format
 */
export const formatUserData = (userData) => {
  if (!userData) return null;

  return {
    id: userData.id || userData.user_id,
    first_name: userData.first_name || userData.user?.first_name || "",
    last_name: userData.last_name || userData.user?.last_name || "",
    email: userData.email || userData.user?.email || "",
    role: userData.role || userData.user?.role || "patient",
    registration_date:
      userData.registration_date ||
      userData.created_at ||
      userData.user?.created_at,
    // Add other fields as needed
  };
};

/**
 * Formats appointment data from backend to frontend format
 */
export const formatAppointmentData = (appointment) => {
  if (!appointment) return null;

  return {
    id: appointment.id,
    patientId: appointment.patient_id,
    psychologistId: appointment.psychologist_id,
    dateTime: new Date(appointment.date),
    status: formatAppointmentStatus(appointment.status),
    notes: appointment.notes,
    sessionLink: appointment.session_link,
    patientName: appointment.patient
      ? `${appointment.patient.first_name || ""} ${
          appointment.patient.last_name || ""
        }`.trim()
      : "Paciente",
    psychologistName: appointment.psychologist
      ? `${appointment.psychologist.first_name || "Dr."} ${
          appointment.psychologist.last_name || ""
        }`.trim()
      : "Psicólogo",
  };
};

/**
 * Formats appointment status to Spanish
 */
export const formatAppointmentStatus = (status) => {
  const statusMap = {
    pending: "pendiente",
    confirmed: "confirmada",
    completed: "completada",
    cancelled: "cancelada",
  };

  return statusMap[status] || status;
};

/**
 * Formats psychologist data from backend
 */
export const formatPsychologistData = (psychologist) => {
  if (!psychologist) return null;

  return {
    id: psychologist.user_id || psychologist.id,
    user_id: psychologist.user_id,
    first_name: psychologist.user?.first_name || psychologist.first_name || "",
    last_name: psychologist.user?.last_name || psychologist.last_name || "",
    email: psychologist.user?.email || psychologist.email || "",
    license_number: psychologist.license_number,
    specialties: psychologist.specialities?.map((s) => s.name) || [
      "No especificada",
    ],
    specialty: psychologist.specialities?.[0]?.name || "No especificada",
    professional_description: psychologist.professional_description,
    photo: psychologist.photo,
    validated: psychologist.validated,
    status: psychologist.status,
    submitted_at: psychologist.created_at,
  };
};

/**
 * Separates appointments into upcoming and past
 */
export const separateAppointmentsByDate = (appointments) => {
  const now = new Date();

  const upcoming = appointments
    .filter((apt) => apt.dateTime >= now)
    .sort((a, b) => a.dateTime - b.dateTime);

  const past = appointments
    .filter((apt) => apt.dateTime < now)
    .sort((a, b) => b.dateTime - a.dateTime);

  return { upcoming, past };
};

/**
 * Handles API errors gracefully
 */
export const handleApiError = (error, context = "") => {
  console.error(`Error in ${context}:`, error);

  // Check if it's a network error
  if (!error.status) {
    return "Error de conexión. Verifica tu conexión a internet.";
  }

  // Handle specific status codes
  switch (error.status) {
    case 401:
      return "No tienes autorización. Por favor, inicia sesión nuevamente.";
    case 403:
      return "No tienes permisos para realizar esta acción.";
    case 404:
      return "Los datos solicitados no fueron encontrados.";
    case 500:
      return "Error interno del servidor. Inténtalo más tarde.";
    default:
      return error.message || "Ha ocurrido un error inesperado.";
  }
};

/**
 * Debounce function to limit API calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
