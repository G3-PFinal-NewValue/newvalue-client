// Mock temporal hasta que el backend exponga endpoints reales
// Estructura de tablas (backend): psychologists, availabilities, etc.

export async function createPsychologistProfile(payload) {
  // payload puede incluir photo_url (Data URL) y todo lo demás
  const data = { id: Date.now(), ...payload };
  const key = "cm_psychologist_profiles";
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([...prev, data]));
  await new Promise(r => setTimeout(r, 500));
  return data;
}