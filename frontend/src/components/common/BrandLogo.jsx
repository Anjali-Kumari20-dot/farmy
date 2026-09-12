import React from "react";
import { SproutIcon } from "./Icons";
import "./BrandLogo.css";

function BrandLogo({ title = "AGRICULTURE", icon }) {
  return (
    <div className="brand-header">
      <div className="brand-logo-icon">
        {icon || <SproutIcon size={22} className="brand-svg" />}
      </div>
      <span className="brand-logo-title">{title}</span>
    </div>
  );
}

export default BrandLogo;
