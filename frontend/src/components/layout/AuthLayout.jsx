import React from "react";
import BrandLogo from "../common/BrandLogo";
import "./AuthLayout.css";

function AuthLayout({
  eyebrow = "GROW • HARVEST • PROSPER",
  title = "FARMER\nREGISTRATION",
  imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85",
  imageAlt = "Farmer in agricultural field",
  featureCards,
  children,
}) {
  return (
    <div className="auth-layout-page">
      {/* LEFT PANEL */}
      <section className="auth-left-panel">
        <BrandLogo />

        <div className="auth-left-content">
          <p className="auth-eyebrow">{eyebrow}</p>

          <h1 className="auth-headline">
            {title.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < title.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <div className="auth-gold-divider" />

          <div className="auth-image-frame">
            <img src={imageUrl} alt={imageAlt} />
          </div>

          {featureCards && (
            <div className="auth-info-stack">
              {featureCards.map((card, index) => (
                <div
                  key={index}
                  className={`auth-feature-card ${card.accent ? "accent-card" : ""}`}
                >
                  <span className="info-badge">{card.badge}</span>
                  <h4>{card.heading}</h4>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="auth-ministry-tag">
          MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION, INDIA
        </p>
      </section>

      {/* RIGHT PANEL */}
      <section className="auth-right-panel">
        <div className="auth-form-shell">{children}</div>
      </section>
    </div>
  );
}

export default AuthLayout;
