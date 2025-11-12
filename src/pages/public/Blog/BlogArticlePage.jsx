import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, deleteArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import Swal from "sweetalert2";
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el artículo.",
          confirmButtonColor: "#3085d6",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "No autenticado",
        text: "Por favor, inicia sesión para eliminar artículos.",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/login"));
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar artículo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteArticle(article.id, token);
      await Swal.fire({
        icon: "success",
        title: "Artículo eliminado",
        text: "El artículo fue eliminado correctamente.",
        confirmButtonColor: "#3085d6",
      });
      navigate("/blog");
    } catch (error) {
      console.error("❌ Error al eliminar artículo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo eliminar el artículo.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  if (loading)
    return (
      <div className="article-loading">
        <div className="spinner"></div>
        <p>Cargando artículo...</p>
      </div>
    );

  if (!article)
    return (
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
        <Link to="/blog" className="back-link">
          ← Volver al blog
        </Link>

        {article.image && (
          <div className="article-image-container">
            <img src={article.image} alt={article.title} className="article-image" />
          </div>
        )}

        <h1 className="article-title">{article.title}</h1>

        <div className="article-meta">
          <span className="meta-item">
            <strong>Categoría:</strong> {article.category?.name || "Sin categoría"}
          </span>
          <span className="meta-separator">•</span>
          <span className="meta-item">
            <strong>Autor:</strong> {article.author?.first_name} {article.author?.last_name}
          </span>
        </div>

        <div className="article-content">
          <p>{article.content}</p>
        </div>

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
