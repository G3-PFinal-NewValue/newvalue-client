import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById, updateArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import BlogArticleForm from "../../../components/ArticleForm.jsx";
import Navbar from "../../../components/common/Navbar/Navbar.jsx"
import Footer from "../../../components/common/Footer/Footer.jsx"
import "./EditArticlePage.css"

export default function EditArticlePage() {
  const { id } = useParams();
  const { user, token, getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setInitialData({
          title: data.title || "",
          content: data.content || "",
          category_id: data.category_id || "",
          image: data.image || "",
        });
      } catch (err) {
        console.error(err);
        setError("Error al cargar artículo");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (formData) => {
    const authToken = token || getToken();

    if (!authToken) {
      alert("No estás autenticado o el token no está disponible.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateArticle(id, formData, authToken);
      alert("Artículo actualizado exitosamente ✅");
      navigate("/blog");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al actualizar artículo");
      alert("Error al actualizar artículo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <p>Cargando artículo...</p>;
  if (error && !initialData) return <p className="error-message">{error}</p>;

  return (
    <div className="article-form-page">
      <Navbar />
      <h1 className="edit-title">Editar Artículo</h1>
      {error && <p className="error-message">{error}</p>}
      {initialData && (
        <BlogArticleForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
      <button className="cancel-button" onClick={() => navigate("/blog")}>Cancelar</button>
      <Footer />
    </div>
  );
}
