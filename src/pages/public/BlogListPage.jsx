import { Link } from "react-router-dom";

// ⚠️ Mock temporal!!!.
const mockArticles = [
  { id: 1, slug: "que-es-la-terapia-cognitiva", title: "¿Qué es la terapia cognitiva?" },
  { id: 2, slug: "manejo-de-ansiedad", title: "Manejo de la ansiedad: primeros pasos" },
  { id: 3, slug: "higiene-del-sueno", title: "Higiene del sueño: hábitos saludables" },
];

export default function BlogListPage() {
  return (
    <section>
      <h1>Blog</h1>
      <p>Artículos recientes (mock):</p>
      <ul>
        {mockArticles.map(a => (
          <li key={a.id}>
            <Link to={`/blog/${a.slug}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
