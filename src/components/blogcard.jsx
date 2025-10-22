import React from "react";
import "./blogcard.css";

function blogcard() {
  return (
    <div className="blogcard">
      <div className="blogcard-image">
        <img src="../images/mujer-reflexionando.png" alt="Mujer reflexionando" />
        <span className="blogcard-label">Estrés</span>
      </div>
      <div className="blogcard-content">
        <h2 className="blogcard-title">
          Guía: Respira y libera el estrés
        </h2>
        <p className="blogcard-description">
          Date permiso para pausar. La calma no es ausencia de desafíos, sino la capacidad de manejarlos con serenidad.
        </p>
        <span className="blogcard-author">
          Dra. Andrea Molina
        </span>
      </div>
    </div>
  );
}

export default blogcard;