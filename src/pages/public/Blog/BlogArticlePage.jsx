import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, deleteArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./BlogArticlePage.css";

export default function BlogArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Error al cargar artículo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      navigate("/login");
      return;
    }
    
    if (!window.confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      return;
    }

    try {
      console.log('🗑️ Eliminando artículo:', article.id);
      await deleteArticle(article.id, token);
      alert("Artículo eliminado exitosamente");
      navigate("/blog");
    } catch (error) {
      console.error('❌ Error:', error);
      alert("Error al eliminar artículo: " + error.message);
    }
  };

  if (loading) return (
    <div className="article-loading">
      <div className="spinner"></div>
      <p>Cargando artículo...</p>
    </div>
  );
  
  if (!article) return (
    <div className="article-error">
      <p>Artículo no encontrado.</p>
      <Link to="/blog" className="back-link">
        ← Volver al blog
      </Link>
    </div>
  );

  return (
    <main className="article-container">
      <article className="article-card">
        {/* Header con navegación */}
        <Link to="/blog" className="back-link">
          ← Volver al blog
        </Link>

        {/* Imagen del artículo */}
        {article.image && (
          <div className="article-image-container">
            <img src={article.image} alt={article.title} className="article-image" />
          </div>
        )}

        {/* Título */}
        <h1 className="article-title">{article.title}</h1>

        {/* Metadatos */}
        <div className="article-meta">
          <span className="meta-item">
            <strong>Categoría:</strong> {article.category?.name || "Sin categoría"}
          </span>
          <span className="meta-separator">•</span>
          <span className="meta-item">
            <strong>Autor:</strong> {article.author?.first_name} {article.author?.last_name}
          </span>
        </div>

        {/* Contenido */}
        <div className="article-content">
          <p>{article.content}</p>
        </div>

        {/* Acciones de admin */}
        {user?.role === "admin" && (
          <div className="admin-actions">
            <button 
              onClick={() => navigate(`/admin/article/edit/${article.id}`)}
              className="btn btn-edit"
              title="Editar artículo"
            >
              ✏️ Editar
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-delete"
              title="Eliminar artículo"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </article>
    </main>
  );
}