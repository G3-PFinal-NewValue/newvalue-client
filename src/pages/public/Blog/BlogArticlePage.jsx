import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./blog.css";

export default function BlogArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // ⚠️ Ejemplo simulado
    const fakeArticle = {
      title: "Cómo gestionar la ansiedad en la vida cotidiana",
      author: "Dra. Clara Martín",
      date: "23 octubre 2025",
      content: `
        La ansiedad es una respuesta natural ante situaciones de estrés, 
        pero cuando se vuelve constante puede afectar nuestro bienestar. 
        En este artículo exploramos estrategias psicológicas prácticas 
        para reconocer, aceptar y disminuir la ansiedad diaria.
      `,
    };
    setArticle(fakeArticle);
  }, [slug]);

  if (!article) return <p>Cargando artículo...</p>;

  return (
    <article className="blog-article">
      <header>
        <h1>{article.title}</h1>
        <p>Por {article.author} — {article.date}</p>
      </header>

      <section>
        <p>{article.content}</p>
      </section>

      <footer>
        <hr />
        <p>
          <Link to="/blog">← Volver al blog</Link>
        </p>
      </footer>
    </article>
  );
}
