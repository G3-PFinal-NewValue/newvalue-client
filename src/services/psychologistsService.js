// Mock temporal usando localStorage hasta que el backend esté listo

const KEY = "cm_psychologist_profiles"; // Clave para guardar en localStorage

// Crear perfil (Mock con localStorage)
export async function createPsychologistProfile(payload) {
  // Asignamos un ID simple basado en timestamp (como antes)
  const data = { id: Date.now(), ...payload };
  const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
  localStorage.setItem(KEY, JSON.stringify([...prev, data]));
  
  // Simulamos una pequeña demora como si fuera una llamada a API
  await new Promise(r => setTimeout(r, 300)); 
  console.log("Perfil guardado en localStorage (mock):", data); // Para depuración
  return data;
}

// Obtener todos los perfiles (Mock con localStorage)
export function getAllPsychologistProfiles() {
  // NOTA: Esta versión es síncrona, si la usas en algún
  // componente con useEffect, asegúrate de que no esperas una Promesa.
  console.log("Obteniendo perfiles de localStorage (mock)");
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

// Obtener un perfil por ID (Mock con localStorage)
export function getPsychologistProfileById(id) {
  // NOTA: Esta versión es síncrona. Tu componente PsychologistPublicProfile
  // ya está preparado para manejar una Promesa, así que lo envolvemos.
  console.log(`Buscando perfil ${id} en localStorage (mock)`);
  const all = getAllPsychologistProfiles();
  // Asegurarse de comparar números, no string vs número
  const numId = typeof id === "string" ? Number(id) : id; 
  const profile = all.find(p => p.id === numId) || null;
  
  // Envolvemos el resultado en una Promesa para simular asincronía
  return Promise.resolve(profile); 
}

// No necesitamos importar 'api' si todo es mock
// import api from "./apiClient";