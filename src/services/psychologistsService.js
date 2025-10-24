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

// --- CREAR PERFIL (Mock temporal hasta conectar el formulario) ---
const KEY = "cm_psychologist_profiles";
export async function createPsychologistProfile(payload) {
  const data = { id: Date.now(), ...payload };
  const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
  localStorage.setItem(KEY, JSON.stringify([...prev, data]));
  await new Promise(r => setTimeout(r, 300));
  console.log("Perfil guardado en localStorage (mock - crear):", data);
  return data;
}

// --- ACTUALIZAR PERFIL (Placeholder/Mock) ---
export async function updatePsychologistProfile(id, payload) {
   console.warn(`Simulación: Actualizar perfil ${id} con datos:`, payload);
   await new Promise(r => setTimeout(r, 300));
   return { id: Number(id), ...payload };
}