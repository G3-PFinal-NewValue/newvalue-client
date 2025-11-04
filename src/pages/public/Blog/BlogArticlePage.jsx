import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, deleteArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function BlogArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth(); // 👈 Obtén el token directamente
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
    // 👇 Usa el token del contexto directamente
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
      console.log('🔑 Con token:', token ? 'SÍ existe' : 'NO existe');
      
      await deleteArticle(article.id, token);
      
      alert("Artículo eliminado exitosamente");
      navigate("/blog");
    } catch (error) {
      console.error('❌ Error:', error);
      alert("Error al eliminar artículo: " + error.message);
    }
  };

  if (loading) return <p>Cargando artículo...</p>;
  if (!article) return <p>Artículo no encontrado.</p>;

  return (
    <article className="blog-article-detail">
      <h1>{article.title}</h1>
      {article.image && <img src={article.image} alt={article.title} />}
      <p className="article-meta">
        Categoría: {article.category?.name || "Sin categoría"} | 
        Autor: {article.author?.name || `${article.author?.first_name} ${article.author?.last_name}`}
      </p>
      <div className="article-content">
        <p>{article.content}</p>
      </div>

      {user?.role === "admin" && (
        <div className="admin-actions">
          <button onClick={() => navigate(`/admin/article/edit/${article.id}`)}>
            Editar
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Eliminar
          </button>
        </div>
      )}

      <p>
        <Link to="/blog">← Volver al blog</Link>
      </p>
    </article>
  );
}