import { useState, useEffect, useRef } from "react";
import "../components/ArticleForm.css";

export default function BlogArticleForm({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    category_id: "",
    image: null, // 👈 ahora guardamos el archivo, no una URL
  });

  const [errors, setErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [preview, setPreview] = useState("");
  const dropdownRef = useRef(null);

  const categories = [
    { id: 1, name: "Mindfulness" },
    { id: 2, name: "Estrés" },
    { id: 3, name: "Terapia" },
    { id: 4, name: "Salud Mental" },
    { id: 5, name: "Bienestar" },
    { id: 6, name: "Ansiedad" },
    { id: 7, name: "Comunicación" },
  ];

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if (initialData.image) setPreview(initialData.image);
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio.";
    if (!formData.author.trim()) newErrors.author = "El autor es obligatorio.";
    if (formData.content.trim().length < 20)
      newErrors.content = "El contenido debe tener al menos 20 caracteres.";
    if (!formData.category_id) newErrors.category_id = "Debe seleccionar una categoría.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category_id: categoryId }));
    setShowDropdown(false);
  };

  const getSelectedCategoryName = () => {
    const category = categories.find((cat) => cat.id === formData.category_id);
    return category ? category.name : "";
  };

  // 🔹 Manejador de imagen: solo vista previa y almacenamiento temporal
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (onSubmit) await onSubmit(formData); // 👈 se envía todo al backend
  };

  return (
    <div className="form-container">
      <form className="blog-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
        {errors.title && <p className="error">{errors.title}</p>}

        <label>Autor</label>
        <input type="text" name="author" value={formData.author} onChange={handleChange} />
        {errors.author && <p className="error">{errors.author}</p>}

        <label>Contenido</label>
        <textarea name="content" value={formData.content} onChange={handleChange} rows="6" />
        {errors.content && <p className="error">{errors.content}</p>}

        <label>Categoría</label>
        <div className="dropdown-container" ref={dropdownRef}>
          <input
            type="text"
            name="category_id"
            value={getSelectedCategoryName()}
            placeholder="Selecciona una categoría"
            onClick={() => setShowDropdown(!showDropdown)}
            readOnly
          />
          {showDropdown && (
            <ul className="dropdown-list">
              {categories.map((cat) => (
                <li key={cat.id} onClick={() => handleCategorySelect(cat.id)}>
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.category_id && <p className="error">{errors.category_id}</p>}

        {/* 🔹 Imagen (solo preview y drag & drop) */}
        <label>Imagen</label>
        <div
          className="image-upload-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("imageInput").click()}
        >
          {preview ? (
            <img src={preview} alt="preview" className="image-preview" />
          ) : (
            <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
          )}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar artículo"}
        </button>
      </form>
    </div>
  );
}
