import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getArticleById, updateArticle } from "../../../services/articleService.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import BlogArticleForm from "../../../components/ArticleForm.jsx";
import Navbar from "../../../components/common/Navbar/Navbar.jsx";
import Footer from "../../../components/common/Footer/Footer.jsx";
import "./EditArticlePage.css";

export default function EditArticlePage() {
  const { id } = useParams();
  const { token, getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // 🔹 Cargar artículo al montar
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setInitialData({
          title: data.title || "",
          content: data.content || "",
          category_id: data.category_id || "",
          image: data.image || "", // URL de Cloudinary o anterior imagen
        });
      } catch (err) {
        console.error(err);
        setError("Error al cargar artículo");
        Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: "No se pudo cargar el artículo.",
          confirmButtonColor: "#d33",
        });
      } finally {
        setFetchLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // 🔹 Enviar actualización
  const handleSubmit = async (formData) => {
    const authToken = token || getToken();

    if (!authToken) {
      Swal.fire({
        icon: "warning",
        title: "No autenticado",
        text: "No estás autenticado o el token no está disponible.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let payloadToSend;

      if (formData.image && formData.image instanceof File) {
        payloadToSend = new FormData();
        payloadToSend.append("title", formData.title);
        payloadToSend.append("content", formData.content);
        payloadToSend.append("category_id", formData.category_id);
        payloadToSend.append("image", formData.image);
        console.log("📸 Actualizando con imagen nueva (FormData)");
      } else {
        payloadToSend = {
          title: formData.title,
          content: formData.content,
          category_id: formData.category_id,
        };
        console.log("📄 Actualizando sin imagen nueva (JSON)");
      }

      console.log("📝 Datos enviados al backend:", payloadToSend);

      await updateArticle(id, payloadToSend, authToken);

      await Swal.fire({
        icon: "success",
        title: "Artículo actualizado",
        text: "El artículo se ha actualizado correctamente.",
        confirmButtonColor: "#3085d6",
      });

      navigate("/blog");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al actualizar artículo");
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err.message || "No se pudo actualizar el artículo.",
        confirmButtonColor: "#d33",
      });
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

      {/* 🔹 Confirmación al cancelar */}
      <button
        className="cancel-button"
        onClick={async () => {
          const result = await Swal.fire({
            title: "¿Cancelar edición?",
            text: "Perderás los cambios no guardados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Seguir editando",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
          });

          if (result.isConfirmed) {
            navigate("/blog");
          }
        }}
      >
        Cancelar
      </button>

      <Footer />
    </div>
  );
}
