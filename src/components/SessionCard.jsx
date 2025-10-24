import React from "react";
import "./SessionCard.css";

const SessionCard = ({
  title,
  subtitle,
  firstDescription,
  secondDescription,
  buttonText = "Reserva sesión",
  onButtonClick,
  highlighted = false,
}) => {
 
  const renderTextWithBreaks = (text, className) => {
    if (!text) return null;
    if (Array.isArray(text)) {
      return (
        <div className={className}>
          {text.map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </div>
      );
    }

    if (typeof text === "string" && text.includes("\n")) {
      return (
        <div className={className}>
          {text.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </div>
      );
    }

    return <div className={className}>{text}</div>;
  };

  return (
    <div className={`session-card ${highlighted ? "highlighted" : ""}`}>{highlighted && <div className="recommended-badge">Recomendado</div>}

      <div className="session-card-title-container">
        {renderTextWithBreaks(title, "session-card-title")}
      </div>
      <h4 className="session-card-subtitle">{subtitle}</h4>
      {renderTextWithBreaks(firstDescription, "session-card-first-description")}
      {renderTextWithBreaks(secondDescription, "session-card-second-description")}
      <button className="session-card-button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default SessionCard;
