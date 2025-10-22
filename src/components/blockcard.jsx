import React from "react";
import "./blockcard.css";

function blockcard() {
  return (
    <div className="blockcard">
      <div className="blockcard-image">
        <span className="blockcard-label">Estrés</span>
      </div>
      <div className="blockcard-content">
        <h2 className="blockcard-title">
          Respira y libera el estrés: Guía Completa
        </h2>
        <p className="blockcard-description">
          Date permiso para pausar. La calma no es ausencia de desafíos, sino la capacidad de manejarlos con serenidad.
        </p>
        <span className="blockcard-author">
          Dra. Gabriela Silva
        </span>
      </div>
    </div>
  );
}

export default blockcard;
