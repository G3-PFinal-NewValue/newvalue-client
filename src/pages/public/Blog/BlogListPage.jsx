import BlogCard from "../../../components/blogcard";
import "./blog.css";

const articles = [
  {
    image: "../images/mujer-reflexionando.png",
    label: "Estrés",
    title: "Aprende a respirar y liberar el estrés",
    description: "Date permiso para pausar. La calma no es ausencia de desafíos...",
    author: "Dra. Andrea Molina",
    slug: "aprender-respirar-y-liberar-el-estres",
  },
  {
    image: "../images/mujer-meditando.png",
    label: "Ansiedad",
    title: "Pasos para superar la ansiedad",
    description: "Conoce técnicas para reducir y manejar la ansiedad...",
    author: "Dra. Clara Martín",
    slug: "pasos-superar-ansiedad",
  },
  {
    image: "../images/comunicacion-efectiva.png",
    label: "Comunicación",
    title: "Aprende a hablar desde la escucha",
    description: "La comunicación empática fortalece tus vínculos personales y laborales.",
    author: "Dr. Oswaldo López",
    slug: "aprender-hablar-desde-la-escucha",
  },
  // Más artículos...
];

export default function BlogCardList() {
  return (
    <div className="blogcard-list">
      {articles.map((a, i) => (
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
  );
}
