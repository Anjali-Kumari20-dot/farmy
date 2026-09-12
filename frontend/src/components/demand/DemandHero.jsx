import { BuildingIcon } from "../common/Icons";
import "./DemandHero.css";

// Hero banner and top stat cards for the CropDemand page
function DemandHero() {
  return (
    <>
      {/* Hero banner */}
      <section className="demand-hero">
        <div className="demand-hero-icon">
          <BuildingIcon size={28} />
        </div>

        <div className="demand-hero-content">
          <span>NATIONAL PROCUREMENT TARGETS & BUFFER QUOTAS</span>
          <h2>High-Demand Government Procurement Produce</h2>
          <p>
            Official commodities required in high volume for National Food
            Security, central strategic buffer stocks, ethanol blending,
            and domestic edible oil self-reliance.
          </p>
        </div>

        <div className="demand-quota">
          <strong>920+ LMT / Qtl</strong>
          <span>NATIONAL STRATEGIC QUOTA</span>
        </div>
      </section>

      {/* Top stat cards */}
      <section className="demand-stat-grid">
        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label red">#1 VOLUME FOODGRAIN</span>
          </div>
          <strong>540.0 LMT</strong>
          <small>Paddy Common / Rice Target</small>
          <em>147.6 LMT Open for Farmer Intake</em>
        </div>

        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label yellow">STRATEGIC BREADBASKET</span>
          </div>
          <strong>320.0 LMT</strong>
          <small>Wheat Central Reserve Target</small>
          <em>54.0 LMT Open for Farmer Intake</em>
        </div>

        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label yellow">CRITICAL DEFICIT PULSE</span>
          </div>
          <strong>40.0 L Qtl</strong>
          <small>Tur (Arhar) Buffer Drive</small>
          <em className="danger-text">
            21.8 L Qtl Deficit -- 100% Assured Purchase
          </em>
        </div>

        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label green">BIOFUEL 20% MISSION</span>
          </div>
          <strong>65.0 L Qtl</strong>
          <small>Maize Ethanol Intake Quota</small>
          <em>27.0 L Qtl Actively Open Quota</em>
        </div>
      </section>
    </>
  );
}

export default DemandHero;
