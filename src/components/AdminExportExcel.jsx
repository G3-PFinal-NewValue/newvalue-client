import * as XLSX from "xlsx";

export default function AdminExportExcel({ users = [], patients = [], psychologists = [] }) {

  const handleExport = () => {
    // --- 1️⃣ Preparar hoja de Usuarios ---
    const userData = users.map(u => ({
      ID: u.id,
      Nombre: u.first_name || "",
      Apellido: u.last_name || "",
      Email: u.email,
      Teléfono: u.phone || "",
      Rol_ID: u.role_id,
      Estado: u.status,
      Fecha_Registro: new Date(u.registration_date).toLocaleDateString(),
    }));

    const wsUsers = XLSX.utils.json_to_sheet(userData);

    // --- 2️⃣ Preparar hoja de Pacientes ---
    const patientData = patients.map(p => ({
      ID_Usuario: p.user_id,
      Fecha_Nacimiento: p.birth_date,
      Género: p.gender,
      Objetivos_Terapia: p.therapy_goals || "",
      Historial_Médico: p.medical_history || "",
      Foto: p.photo || "",
      Estado: p.status,
    }));

    const wsPatients = XLSX.utils.json_to_sheet(patientData);

    // --- 3️⃣ Preparar hoja de Psicólogos ---
    const psychologistData = psychologists.map(ps => ({
      ID_Usuario: ps.user_id,
      Nº_Colegiado: ps.license_number,
      Descripción: ps.professional_description || "",
      Foto: ps.photo || "",
      Validado: ps.validated ? "Sí" : "No",
      Estado: ps.status,
    }));

    const wsPsychologists = XLSX.utils.json_to_sheet(psychologistData);

    // --- 4️⃣ Crear el libro y añadir las hojas ---
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsUsers, "Usuarios");
    XLSX.utils.book_append_sheet(wb, wsPatients, "Pacientes");
    XLSX.utils.book_append_sheet(wb, wsPsychologists, "Psicólogos");

    // --- 5️⃣ Descargar ---
    XLSX.writeFile(wb, `Datos_Admin_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        backgroundColor: "#3b82f6",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "1rem"
      }}
    >
      📊 Descargar Excel de Datos
    </button>
  );
}
