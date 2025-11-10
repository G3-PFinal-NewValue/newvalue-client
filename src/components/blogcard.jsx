import React from "react";
import "./blogcard.css";
import { Link } from "react-router-dom";


function BlogCard({ image, label, title, description, author, slug }) {
  return (
    <div className="blogcard">
      <div className="blogcard-image">
        <img src={image} alt={label} />
        <span className="blogcard-label">{label}</span>
      </div>
      <div className="blogcard-content">
        <h2 className="blogcard-title">{title}</h2>
        <p className="blogcard-description">{description}</p>
        <div className="author-and-link">
          <span className="blogcard-author">{author}</span>
          <Link to={`/blog/${slug}`} className="see-more-link">
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
