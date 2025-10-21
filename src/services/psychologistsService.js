// Mock temporal hasta que el backend exponga endpoints reales
// Estructura de tablas (backend): psychologists, availabilities, etc.

export async function createPsychologistProfile(payload) {
  // Guarda en localStorage como simulación de POST
  const data = { id: Date.now(), ...payload };
  const key = "cm_psychologist_profiles";
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([...prev, data]));
  // Simula latencia
  await new Promise(r => setTimeout(r, 600));
  return data;
}
