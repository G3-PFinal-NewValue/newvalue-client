import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import BlogCard from "../../..//components/blogcard.jsx";
import {  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle, } from "../../../services/articleService.js";
import Swal from 'sweetalert2';
import "../Blog/BlogListPage.css";

const categories = [
  "Todos", "Mindfulness", "Estrés", "Terapia", "Salud Mental",
  "Bienestar", "Ansiedad", "Comunicación"
];

export default function BlogCardList() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // --- Fetch artículos desde backend ---
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar',
        text: 'No se pudieron cargar los artículos',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // --- Función para eliminar artículo ---
  const handleDeleteArticle = async (id) => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin autenticación',
        text: 'No estás autenticado',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar artículo?',
      text: '¿Seguro que quieres eliminar este artículo? Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await deleteArticle(id, token);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'Artículo eliminado exitosamente',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: err.message || 'No se pudo eliminar el artículo',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // --- Filtrado ---
  const filteredByCategory =
    selectedCategory === "Todos"
      ? articles
      : articles.filter((a) =>
          a.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const filteredArticles = filteredByCategory.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.title?.toLowerCase().includes(term) ||
      a.content?.toLowerCase().includes(term) ||
      a.author?.name?.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="loading-message">Cargando artículos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="blog-page-container">
      <header className="blog-header-full">
        <div className="header-content">
          <img className="icon-charity" src="/icons/charity.png" alt="icon" />
          <h1>Blog y recursos</h1>
          <p>Artículos, guías y recursos para tu bienestar mental</p>

          {user?.role === "admin" && (
            <button
              className="create-article-button"
              onClick={() => navigate("/admin/article/create")}
            >
              Crear Artículo
            </button>
          )}

          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blog-search"
          />
        </div>
      </header>

      <div className="blog-main">
        <div className="blog-dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedCategory} ▼
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {categories.map((cat, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                  }}
                  className={selectedCategory === cat ? "active" : ""}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="blogcard-list">
          {filteredArticles.length === 0 ? (
            <p>No se encontraron artículos</p>
          ) : (
            filteredArticles.map((a) => (
              <div key={a.id} className="blogcard-wrapper">
                <BlogCard
                  image={a.image}
                  label={a.category?.name || "Sin categoría"}
                  title={a.title}
                  description={a.content}
                  author={a.author?.name || "Anónimo"}
                  slug={a.slug || a.id}
                />
                {user?.role === "admin" && (
                  <div className="admin-article-actions">
                    <button
                      onClick={() => navigate(`/admin/article/edit/${a.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(a.id)}
                      className="delete-btn"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
