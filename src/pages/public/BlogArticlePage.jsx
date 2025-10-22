import { useParams, Link } from "react-router-dom";

export default function BlogArticlePage() {
  const { slug } = useParams();
  // ⚠️ Mock: luego traeremos el artículo por slug desde la API
  return (
    <article>
      <h1>Artículo: {slug}</h1>
      <p>Contenido del artículo (placeholder).</p>
      <p><Link to="/blog">← Volver al blog</Link></p>
    </article>
  );
}
