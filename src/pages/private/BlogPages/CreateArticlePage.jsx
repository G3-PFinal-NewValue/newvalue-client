import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import BlogArticleForm from "../../../components/ArticleForm.jsx";
import Navbar from "../../../components/common/Navbar/Navbar.jsx"
import Footer from "../../../components/common/Footer/Footer.jsx"

export default function CreateArticlePage() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    const token = getToken();

    if (!token) {
      alert("No estás autenticado o el token no está disponible.");
      return;
    }

    // Decodificar token y verificar expiración
    try {
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.exp * 1000 < Date.now()) {
        alert("⚠️ El token ha expirado. Por favor, inicia sesión nuevamente.");
        navigate("/login");
        return;
      }
    } catch (decodeError) {
      console.error("Error al decodificar token:", decodeError);
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Enviar category_id como número
      const payloadToSend = {
        ...formData,
        category_id: Number(formData.category_id),
        author_id: user.id, // agregar el autor
      };

      console.log("📝 Datos enviados al backend:", payloadToSend);

      const response = await createArticle(payloadToSend, token);
      alert("Artículo creado exitosamente ✅");
      navigate("/blog");
    } catch (err) {
      console.error("Error al crear artículo:", err);
      setError(err.message || "Error al crear artículo");
      alert("Error: " + err.message);
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

      <button  className="cancel-button" onClick={() => navigate("/blog")}>Cancelar</button>
      <Footer />
    </div>
  );
}
