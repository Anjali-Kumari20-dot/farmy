import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "./form";
import "./Landing.css";

function Landing() {
  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [profile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("farmy-profile")) || {};
    } catch {
      return {};
    }
  });

  const profileName = profile.name || "Farmer";
  const profilePhone = profile.phone || "No mobile number saved";

  const features = [
    {
      number: "01",
      icon: "▣",
      iconClass: "gold",
      title: "PROCUREMENT SCHEDULE",
      description:
        "View crop-wise MSP calendars, procurement operational schedules, daily intake quotas, and purchase limits.",
      action: "View Schedule",
    },
    {
      number: "02",
      icon: "◉",
      iconClass: "yellow",
      badge: "HIGH DEMAND",
      title: "CROP IN DEMAND",
      description:
        "View high-demand crops required in large volumes by the government, national procurement quotas, and priority intake.",
      action: "View High Demand Crops",
    },
    {
      number: "03",
      icon: "⌖",
      iconClass: "peach",
      title: "PROCUREMENT CENTER & SLOT BOOKING",
      description:
        "Choose your designated cooperative center, select a preferred intake date, and reserve real-time weighbridge slots.",
      action: "Book Center Slot",
    },
    {
      number: "04",
      icon: "▱",
      iconClass: "blue",
      title: "LIVE TOKEN QUEUE STATUS",
      description:
        "Monitor live weighbridge gate countdowns, track truck convoy queue positions, and view active token numbers.",
      action: "Track Live Queue",
    },
    {
      number: "05",
      icon: "✓",
      iconClass: "green",
      title: "FINALIZE PROCUREMENT & PAYMENT",
      description:
        "Inspect verified gross weights, view certified moisture assay grades, and confirm direct bank DBT transfer.",
      action: "Authorize DBT Payment",
    },
    {
      number: "06",
      icon: "▭",
      iconClass: "cream",
      title: "TRANSACTION & PAYMENT HISTORY",
      description:
        "Access Direct Benefit Transfer (DBT) bank logs, government payment vouchers, and transaction reference numbers.",
      action: "View Statements",
    },
  ];

  return (
    <div className="landing-page">

      {/* ================= HEADER ================= */}

      <header className="landing-header">

        <div className="header-brand">
          <div className="header-logo">🌱</div>

          <div>
            <div className="ministry-name">
              MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION, INDIA
            </div>

            <div className="portal-name">
              Crop Procurement Portal
            </div>
          </div>
        </div>


        <div className="header-actions">

          <div className="procurement-status">
            <span className="status-dot"></span>
            Procurement Active (Kharif 2026–27)
          </div>

          <div className="language-selector">
            <span className="globe">◎</span>

            <div>
              <small>PORTAL LANGUAGE</small>
              <strong>English</strong>
            </div>

            <span className="down-arrow">⌄</span>
          </div>

          <button
            type="button"
            className="farmer-profile"
            onClick={() => setShowProfile((visible) => !visible)}
            aria-expanded={showProfile}
            aria-label={`Open ${profileName}'s profile`}
          >
            <div className="farmer-avatar">
              🌾
            </div>

            <div>
              <strong>{profileName}</strong>
              <span>{profilePhone}</span>
            </div>
          </button>

          {showProfile ? (
            <div className="profile-menu">
              <strong>{profileName}</strong>
              <span>Farmer account</span>
              <small>{profilePhone}</small>
            </div>
          ) : null}

          <button className="notification-button">
            ♧
            <span>0</span>
          </button>

          <Link to="/login" className="logout-button">
            ⇥
            LOGOUT
          </Link>

        </div>

      </header>


      {/* ================= MSP TICKER ================= */}

      {/*
      <div className="msp-bar">

        <div className="msp-label">
          <span className="live-dot"></span>

          <div>
            <strong>LIVE MSP 2026–27</strong>
            <small>GOVT. BENCHMARKS</small>
          </div>
        </div>

        <div className="ticker-items">

          <div className="ticker-item">
            <span className="crop-symbol">🌾</span>
            <strong>Rice</strong>
            <small>KHARIF</small>
            <b>₹2,369/Qtl</b>
            <em>▲ +₹69</em>
          </div>

          <div className="ticker-item">
            <span className="crop-symbol">🌻</span>
            <strong>Sunflower Seed</strong>
            <small>KHARIF</small>
            <b>₹8,343/Qtl</b>
            <em>▲ +₹622</em>
          </div>

          <div className="ticker-item">
            <span className="crop-symbol">🌱</span>
            <strong>Soyabean</strong>
            <small>KHARIF</small>
            <b>₹5,328/Qtl</b>
            <em>▲ +₹150</em>
          </div>

          <div className="ticker-item">
            <span className="crop-symbol">🌾</span>
            <strong>Wheat</strong>
            <small>RABI</small>
            <b>₹2,585/Qtl</b>
            <em>▲ +₹150</em>
          </div>

        </div>

        <div className="ticker-controls">
          <button className="active">All</button>
          <button>Kharif</button>
          <button>Rabi</button>
          <button>Ⅱ Pause</button>
          <button className="matrix">Full Matrix ↗</button>
        </div>

      </div>
      */}


      {/* ================= MAIN ================= */}

      <main className="landing-main">

        {/* Welcome banner */}

        <section className="welcome-banner">

          <div className="welcome-content">

            <span className="official-badge">
              OFFICIAL FARMER DESK
            </span>

            <h1>
              Farmer Procurement Dashboard
            </h1>

            <p>
              Welcome to the integrated procurement & MSP payment portal.
              Select any module below to schedule slots, track weighbridge
              tokens, or manage your procurement payments.
            </p>

          </div>

          <div className="welcome-decoration">
            <span>🌾</span>
            <span>◌</span>
            <span>🌱</span>
          </div>

        </section>


        {/* Section heading */}

        <div className="services-heading">

          <div>
            <h2>Select Procurement Service</h2>
          </div>

          <span className="service-count">
            6 SERVICES AVAILABLE
          </span>

        </div>


        {/* Feature cards */}

        <section className="feature-grid">

          {features.map((feature) => (

            <article
              className="service-card"
              key={feature.number}
              onClick={() => {
                if (feature.number === "03") {
                  setShowForm(true);
                }
              }}
              style={{ cursor: feature.number === "03" ? "pointer" : "default" }}
            >

              {feature.badge && (
                <span className="demand-badge">
                  🔥 {feature.badge}
                </span>
              )}

              <div
                className={`service-icon ${feature.iconClass}`}
              >
                {feature.icon}
              </div>

              <span className="service-number">
                {feature.number}
              </span>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

              <div className="card-divider"></div>

              <button
                type="button"
                className="service-action"
                onClick={(event) => {
                  event.stopPropagation();
                  if (feature.number === "03") {
                    setShowForm(true);
                  }
                }}
              >
                {feature.action}
                <span>→</span>
              </button>

            </article>

          ))}

        </section>

      </main>

      {showForm ? <Form onClose={() => setShowForm(false)} /> : null}


      {/* ================= QUICK SWITCH ================= */}

      {/*
      <div className="quick-switch">

        <span>QUICK SWITCH:</span>

        <button className="farmer-switch">
          🌾 Farmer Portal
        </button>

        <button>
          ▥ Officer Desk & Demo
        </button>

      </div>
      */}

    </div>
  );
}

export default Landing;