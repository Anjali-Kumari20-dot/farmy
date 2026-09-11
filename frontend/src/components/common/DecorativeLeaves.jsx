import React from "react";
import "./DecorativeLeaves.css";

function DecorativeLeaves({ className = "" }) {
  return (
    <div className={`decorative-divider ${className}`} aria-hidden="true">
      <span className="dot" />
      <span className="diamond" />
      <span className="center-line" />
      <span className="diamond" />
      <span className="dot" />
    </div>
  );
}

export default DecorativeLeaves;
