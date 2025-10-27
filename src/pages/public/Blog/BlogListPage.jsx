import { useState } from "react";
import BlogCard from "../../../components/BlogCard";
import "./blog.css";

const articles = [
  {
    image: "../images/mujer-reflexionando.png",
    label: "Estrés",
    title: "Aprende a respirar y liberar el estrés",
    description: "Date permiso para pausar. La calma no es ausencia de desafíos...",
    author: "Dra. Andrea Molina",
    slug: "guia-respira-y-libera-el-estres",
  },
  {
    image: "../images/mujer-meditando.png",
    label: "Ansiedad",
    title: "Pasos para superar la ansiedad",
    description: "Conoce técnicas para reducir y manejar la ansiedad...",
    author: "Dra. Clara Martín",
    slug: "primeros-pasos-superar-ansiedad",
  },
  {
    image: "../images/comunicacion-efectiva.png",
    label: "Comunicación",
    title: "Aprende a hablar desde la escucha",
    description: "La comunicación empática fortalece tus vínculos personales y laborales.",
    author: "Dr. Oswaldo López",
    slug: "aprender-hablar-desde-la-escucha",
  },
];

const categories = ["Todos", "Mindfulness", "Estrés", "Terapia", "Salud Mental", "Bienestar", "Ansiedad", "Comunicación"];

export default function BlogCardList() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado por categoría
  const filteredByCategory =
    selectedCategory === "Todos"
      ? articles
      : articles.filter((a) => a.label.toLowerCase() === selectedCategory.toLowerCase());

  // Filtrado por búsqueda
  const filteredArticles = filteredByCategory.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      a.author.toLowerCase().includes(term)
    );
  });

  return (
    <div className="blog-page-container">
      <header className="blog-header-full">
        <div className="header-content">
          <img className="icon-charity" src="/icons/charity.png" alt="icon"/>
          <h1>Blog y recursos</h1>
          <p>Artículos, guías y recursos para tu bienestar mental</p>
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
        <aside className="blog-sidebar">
          <h3>Categorías</h3>
          <ul>
            {categories.map((cat, i) => (
              <li
                key={i}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <div className="blogcard-list">
          {filteredArticles.map((a, i) => (
            <BlogCard
              key={i}
              image={a.image}
              label={a.label}
              title={a.title}
              description={a.description}
              author={a.author}
              slug={a.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
