import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import BlogArticleForm from "../../../components/ArticleForm.jsx";
import Navbar from "../../../components/common/Navbar/Navbar.jsx"
import Footer from "../../../components/common/Footer/Footer.jsx"
import "./CreateArticlePage.css"
import Swal from 'sweetalert2';

export default function CreateArticlePage() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Sin autenticación',
        text: 'No estás autenticado o el token no está disponible.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Decodificar token y verificar expiración
    try {
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.exp * 1000 < Date.now()) {
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'El token ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Ir a login',
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          navigate("/login");
        });
        return;
      }
    } catch (decodeError) {
      console.error("Error al decodificar token:", decodeError);
    }

    setLoading(true);
    setError(null);

    try {
      // 🔹 Convertir a FormData si hay imagen, si no, enviar como JSON
      let payloadToSend;

      if (formData.image && formData.image instanceof File) {
        // 🔹 Si hay imagen (File object), usar FormData
        payloadToSend = new FormData();
        payloadToSend.append("title", formData.title);
        payloadToSend.append("content", formData.content);
        payloadToSend.append("category_id", Number(formData.category_id));
        payloadToSend.append("author", formData.author);
        payloadToSend.append("image", formData.image);
        console.log("📸 Enviando con imagen (FormData)");
      } else {
        // 🔹 Si NO hay imagen, enviar como JSON
        payloadToSend = {
          ...formData,
          category_id: Number(formData.category_id),
        };
        console.log("📄 Enviando sin imagen (JSON)");
      }

      console.log("📝 Datos enviados al backend:", payloadToSend);

      const response = await createArticle(payloadToSend, token);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Artículo creado exitosamente',
        confirmButtonText: 'Ver blog',
        confirmButtonColor: '#10b981',
        timer: 3000
      }).then(() => {
        navigate("/blog");
      });
    } catch (err) {
      console.error("Error al crear artículo:", err);
      setError(err.message || "Error al crear artículo");
      Swal.fire({
        icon: 'error',
        title: 'Error al crear artículo',
        text: err.message || 'Ha ocurrido un error inesperado',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-form-page">
      <Navbar />
      <h1 className="create-title">Crear nuevo artículo</h1>
      {error && <p className="error-message">{error}</p>}

      <BlogArticleForm onSubmit={handleSubmit} loading={loading} />

      <button className="cancel-button" onClick={() => navigate("/blog")}>Cancelar</button>
      <Footer />
    </div>
  );
}