import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  SproutIcon,
  CalendarIcon,
  TargetIcon,
  ClipboardIcon,
  ActivityIcon,
  CreditCardIcon,
  FileTextIcon,
  GlobeIcon,
  ChevronDownIcon,
  UserIcon,
  LogOutIcon,
  ArrowRightIcon,
} from "../components/common/Icons";
import CropDemandPage from "./CropDemandPage";
import SchedulePage from "./SchedulePage";
import FormPage from "./FormPage";
import NotificationMenu from "../components/notifications/NotificationMenu";
import "./LandingPage.css";

// Map feature number to its icon component
const FEATURE_ICONS = {
  "01": CalendarIcon,
  "02": TargetIcon,
  "03": ClipboardIcon,
  "04": ActivityIcon,
  "05": CreditCardIcon,
  "06": FileTextIcon,
};

const FEATURES = [
  {
    number: "01",
    iconClass: "gold",
    title: "PROCUREMENT SCHEDULE",
    description:
      "View crop-wise MSP calendars, procurement operational schedules, daily intake quotas, and purchase limits.",
    action: "View Schedule",
  },
  {
    number: "02",
    iconClass: "yellow",
    badge: "HIGH DEMAND",
    title: "CROP IN DEMAND",
    description:
      "View high-demand crops required in large volumes by the government, national procurement quotas, and priority intake.",
    action: "View High Demand Crops",
  },
  {
    number: "03",
    iconClass: "peach",
    title: "PROCUREMENT CENTER & SLOT BOOKING",
    description:
      "Choose your designated cooperative center, select a preferred intake date, and reserve real-time weighbridge slots.",
    action: "Book Center Slot",
  },
  {
    number: "04",
    iconClass: "blue",
    title: "PROCUREMENT TICKET STATUS",
    description:
      "Use your unique procurement ticket to track review, slot booking, scheduling, and completion status.",
    action: "Check Ticket Status",
  },
  {
    number: "05",
    iconClass: "green",
    title: "FINALIZE PROCUREMENT & PAYMENT",
    description:
      "Inspect verified gross weights, view certified moisture assay grades, and confirm direct bank DBT transfer.",
    action: "Authorize DBT Payment",
  },
  {
    number: "06",
    iconClass: "cream",
    title: "TRANSACTION & PAYMENT HISTORY",
    description:
      "Access Direct Benefit Transfer (DBT) bank logs, government payment vouchers, and transaction reference numbers.",
    action: "View Statements",
  },
];

// Features that open an overlay panel when clicked
const CLICKABLE_FEATURES = new Set(["01", "02", "03", "04"]);

function LandingPage() {
  const navigate = useNavigate();
  const { farmer, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showDemand, setShowDemand] = useState(false);

  const profileName = farmer?.fullname || "Farmer";
  const profilePhone = farmer?.mobileNumber
    ? `+91 ${farmer.mobileNumber}`
    : "Registered Farmer";

  const handleFeatureClick = (number) => {
    if (number === "01") setShowSchedule(true);
    if (number === "02") setShowDemand(true);
    if (number === "03") navigate("/slots");
    if (number === "04") navigate("/tickets");
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-brand">
          <div className="header-logo">
            <SproutIcon size={22} />
          </div>
          <div>
            <div className="ministry-name">
              MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION, INDIA
            </div>
            <div className="portal-name">Crop Procurement Portal</div>
          </div>
        </div>

        <div className="header-actions">
          <div className="procurement-status">
            <span className="status-dot" />
            Procurement Active (Kharif 2026-27)
          </div>

          <div className="language-selector">
            <GlobeIcon size={15} />
            <div>
              <small>PORTAL LANGUAGE</small>
              <strong>English</strong>
            </div>
            <ChevronDownIcon size={13} />
          </div>

          {/* Farmer profile button */}
          <div className="farmer-profile-wrap">
            <button
              type="button"
              className="farmer-profile"
              onClick={() => setShowProfile((v) => !v)}
              aria-expanded={showProfile}
              aria-label={`Open ${profileName}'s profile`}
            >
              <div className="farmer-avatar">
                <UserIcon size={16} />
              </div>
              <div>
                <strong>{profileName}</strong>
                <span>{profilePhone}</span>
              </div>
            </button>

            {showProfile && (
              <div className="profile-menu">
                <strong>{profileName}</strong>
                <span>Farmer account</span>
                <small>{profilePhone}</small>
              </div>
            )}
          </div>

          <NotificationMenu />

          <button type="button" onClick={logout} className="logout-button">
            <LogOutIcon size={14} />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="landing-main">
        {/* Welcome banner */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="official-badge">OFFICIAL FARMER DESK</span>
            <h1>Farmer Procurement Dashboard</h1>
            <p>
              Welcome to the integrated procurement & MSP payment portal.
              Select any module below to schedule slots, track weighbridge
              tokens, or manage your procurement payments.
            </p>
          </div>

          <div className="welcome-decoration">
            <SproutIcon size={40} />
          </div>
        </section>

        {/* Services heading */}
        <div className="services-heading">
          <h2>Select Procurement Service</h2>
          <span className="service-count">6 SERVICES AVAILABLE</span>
        </div>

        {/* Feature cards */}
        <section className="feature-grid">
          {FEATURES.map((feature) => {
            const IconComponent = FEATURE_ICONS[feature.number];
            const isClickable = CLICKABLE_FEATURES.has(feature.number);

            return (
              <article
                className={`service-card ${isClickable ? "clickable" : ""}`}
                key={feature.number}
                onClick={() => isClickable && handleFeatureClick(feature.number)}
              >
                {feature.badge && (
                  <span className="demand-badge">{feature.badge}</span>
                )}

                <div className={`service-icon ${feature.iconClass}`}>
                  <IconComponent size={22} />
                </div>

                <span className="service-number">{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className="card-divider" />

                <button
                  type="button"
                  className="service-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(feature.number);
                  }}
                  disabled={!isClickable}
                >
                  {feature.action}
                  {isClickable && <ArrowRightIcon size={14} />}
                </button>
              </article>
            );
          })}
        </section>
      </main>

      {/* Overlay panels */}
      {showForm && <FormPage onClose={() => setShowForm(false)} />}
      {showSchedule && <SchedulePage onClose={() => setShowSchedule(false)} />}
      {showDemand && (
        <CropDemandPage
          onClose={() => setShowDemand(false)}
          onOpenSchedule={() => {
            setShowDemand(false);
            setShowSchedule(true);
          }}
          onOpenForm={() => {
            setShowDemand(false);
            setShowForm(true);
          }}
          onBookSlot={() => {
            setShowDemand(false);
            navigate("/slots");
          }}
        />
      )}
    </div>
  );
}

export default LandingPage;
