import apiClient from './apiClient';

/**
 * Obtiene la plantilla de disponibilidad (los horarios fijos) de un psicólogo.
 * Llama al endpoint de availability.controller.js
 */
export const getAvailabilityByPsychologist = async (psychologistId) => {
  try {
    const { data } = await apiClient.get(`/availability/psychologist/${psychologistId}`);
    return data;
  } catch (error) {
    console.error('Error fetching availability template:', error);
    throw error;
  }
};