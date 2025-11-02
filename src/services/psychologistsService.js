import api from "./apiClient";

// --- OBTENER TODOS LOS PERFILES ---
export async function getAllPsychologistProfiles() {
  try {
    console.log("Llamando a la API para obtener todos los psicólogos...");
    const response = await api.get("/psychologist"); 
    console.log("Psicólogos recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los perfiles de psicólogos:", error);
    throw error;
  }
}

// --- OBTENER UN PERFIL POR ID ---
export async function getPsychologistProfileById(id) {
 
  if (!id) {
     console.error("getPsychologistProfileById: ID inválido proporcionado");
     throw new Error("ID de psicólogo no válido");
  }
  try {
    console.log(`Llamando a la API para obtener el psicólogo con ID: ${id}...`);
    const response = await api.get(`/psychologist/${id}`);
    console.log(`Perfil recibido para ID ${id}:`, response.data);
    return response.data; 
  } catch (error) {
     console.error(`Error al obtener el perfil del psicólogo ${id}:`, error);
     if (error.status === 404) {
       console.warn(`Perfil no encontrado para ID ${id}`);
       return null; 
     }
    throw error;
  }
}

// --- CREAR PERFIL  ---
export async function createPsychologistProfile(formData) {
  try {
    console.log("Enviando datos del perfil (FormData) a POST /psychologist...");
    // Importante: No establecer manualmente 'Content-Type'.
    // Axios lo hará automáticamente a 'multipart/form-data' cuando envíe FormData.
    const response = await api.post("/psychologist", formData);
    console.log("Respuesta de creación de perfil:", response.data);
    return response.data.profile; // Asume que el backend devuelve { message: '...', profile: {...} }
  } catch (error) {
    console.error("Error al crear el perfil del psicólogo:", error);
    throw error; 
  }
}

export async function updatePsychologistProfile(id, formData) {
   if (!id) {
     console.error("updatePsychologistProfile: ID inválido");
     throw new Error("ID de psicólogo no válido");
  }
  try {
    console.log(`Enviando datos actualizados (FormData) a PUT /psychologist/${id}...`);
    // Axios se encargará del 'multipart/form-data'
    const response = await api.put(`/psychologist/${id}`, formData);
    console.log("Respuesta de actualización de perfil:", response.data);
    return response.data.profile; // El backend devuelve el perfil actualizado
  } catch (error) {
    console.error(`Error al actualizar el perfil del psicólogo ${id}:`, error);
    throw error;
  }
}