import { useMemo, useState } from "react";
import "./demand.css";

const crops = [
  {
    rank: 1,
    name: "Paddy Common",
    emoji: "🌾",
    season: "Kharif Crops",
    tag: "CRITICAL NATIONAL DEMAND",
    tagType: "critical",
    category: "Foodgrains / Cereals",
    agency: "FCI & State Civil Supplies",
    target: 540,
    procured: 392.4,
    deficit: 147.6,
    msp: "₹2,441/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "National Food Security Act (NFSA), PMGKAY free grain distribution & 4-Month Central Strategic Buffer Reserve.",
    benefit:
      "100% guaranteed intake at all centers, express weighbridge gate clearance, 24-hr DBT payout settlement.",
  },
  {
    rank: 2,
    name: "Wheat",
    emoji: "🌾",
    season: "Rabi Crops",
    tag: "CRITICAL NATIONAL DEMAND",
    tagType: "critical",
    category: "Foodgrains (Cereal)",
    agency: "FCI & State Agencies",
    target: 320,
    procured: 266,
    deficit: 54,
    msp: "₹2,585/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Central Pool Stock Replenishment, OMSS Market Stabilization & Public Distribution System (PDS).",
    benefit:
      "Zero quantity cap per verified farmer. Inter-district transport rebate of ₹50/Qtl for >25 km transit.",
  },
  {
    rank: 3,
    name: "Medium Staple Cotton",
    emoji: "☁️",
    season: "Kharif Crops",
    tag: "HIGH INDUSTRIAL DEMAND",
    tagType: "high",
    category: "Commercial & Textile",
    agency: "Cotton Corporation of India (CCI)",
    target: 70,
    procured: 46.5,
    deficit: 23.5,
    msp: "₹7,121/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Domestic Textile Mill Buffer Security, Cotton Price Stabilization & Export Buffer Reserves.",
    benefit:
      "Electronic moisture testers installed at all intake centers. Moisture up to 8% standard, relaxed to 12% with prorated chart.",
  },
  {
    rank: 4,
    name: "Maize",
    emoji: "🌽",
    season: "Kharif Crops",
    tag: "HIGH INDUSTRIAL DEMAND",
    tagType: "high",
    category: "Biofuel & Industrial Cereal",
    agency: "NAFED, NCCF & FCI",
    target: 65,
    procured: 38,
    deficit: 27,
    msp: "₹2,225/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "National Ethanol Blending Programme (EBP - 20% by 2025-26) for Grain-Based Distilleries & Poultry Nutrition.",
    benefit:
      "Direct tie-up procurement for biofuel distilleries with guaranteed MSP and immediate weighing token clearance.",
  },
  {
    rank: 5,
    name: "Tur (Arhar)",
    emoji: "🫘",
    season: "Kharif Crops",
    tag: "URGENT BUFFER DEFICIT",
    tagType: "urgent",
    category: "Pulse Buffer",
    agency: "NAFED & NCCF",
    target: 40,
    procured: 18.2,
    deficit: 21.8,
    msp: "₹7,550/Qtl",
    purchase: "+ ₹250/Qtl Special Buffer Incentive",
    purpose:
      "Price Stabilization Fund (PSF) Pulse Buffer Drive to combat domestic price spikes & curb import dependence.",
    benefit:
      "100% Procurement Guarantee without state ceiling limit + ₹250/Qtl Direct Buffer Incentive on spot.",
  },
  {
    rank: 6,
    name: "Urad",
    emoji: "🫘",
    season: "Kharif Crops",
    tag: "URGENT BUFFER DEFICIT",
    tagType: "urgent",
    category: "High Priority Pulse",
    agency: "NAFED",
    target: 35,
    procured: 16.5,
    deficit: 18.5,
    msp: "₹7,400/Qtl",
    purchase: "+ ₹200/Qtl Special Buffer Incentive",
    purpose:
      "Central Strategic Pulse Buffer Stock & Defense Services Supply under Price Support Scheme (PSS).",
    benefit:
      "Assured purchase under PM-AASHA with instant digital moisture assaying and zero broker commissions.",
  },
  {
    rank: 7,
    name: "Rapeseed / Mustard",
    emoji: "🌼",
    season: "Rabi Crops",
    tag: "HIGH EDIBLE OIL DEMAND",
    tagType: "high",
    category: "Oilseeds Mission",
    agency: "NAFED & State Oil Federations",
    target: 32,
    procured: 21.4,
    deficit: 10.6,
    msp: "₹5,950/Qtl",
    purchase: "+ ₹150/Qtl Special Buffer Incentive",
    purpose:
      "National Mission on Edible Oils - Oilseeds (NMEO-OS) to eliminate foreign cooking oil import dependence.",
    benefit:
      "Direct cooperative milling intake with oil-content premium bonus up to ₹150/Qtl for >40% oil content.",
  },
  {
    rank: 8,
    name: "Gram",
    emoji: "🫘",
    season: "Rabi Crops",
    tag: "HIGH VOLUME DEMAND",
    tagType: "high",
    category: "Strategic Protein Reserve",
    agency: "NAFED",
    target: 30,
    procured: 22.5,
    deficit: 7.5,
    msp: "₹5,650/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Pulses Price Stabilization, Armed Forces Rationing & PM-POSHAN Mid-Day Meal Protein Allocation.",
    benefit:
      "Smooth electronic weighbridge tokening, zero market fees or statutory deductions for registered farmers.",
  },
  {
    rank: 9,
    name: "Soyabean Yellow",
    emoji: "🫘",
    season: "Kharif Crops",
    tag: "HIGH VOLUME DEMAND",
    tagType: "high",
    category: "National Protein & Oil Drive",
    agency: "NAFED & State Federations",
    target: 28,
    procured: 17.8,
    deficit: 10.2,
    msp: "₹4,892/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Domestic Soya Oil Extraction & Non-GMO High-Protein Meal for National Dairy & Poultry Infrastructure.",
    benefit:
      "Assured purchase under PM-AASHA with instant assaying report and direct bank voucher release.",
  },
  {
    rank: 10,
    name: "Groundnut",
    emoji: "🥜",
    season: "Kharif Crops",
    tag: "HIGH VOLUME DEMAND",
    tagType: "high",
    category: "Domestic Edible Oil Buffer",
    agency: "NAFED & State Oilseed Unions",
    target: 22,
    procured: 14.2,
    deficit: 7.8,
    msp: "₹6,783/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Domestic Groundnut Oil Reserves and HPS Export Grade Quality Buffer Stock Maintenance.",
    benefit:
      "Spot weighment and electronic assaying certification. No deduction for pod size variations within FAQ standards.",
  },
];

function CropDemand({ onClose, onOpenSchedule, onOpenForm, onBookSlot }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rank");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCrops = useMemo(() => {
    let result = crops.filter((crop) => {
      const matchesCategory =
        activeCategory === "all" ||
        (activeCategory === "foodgrains" && crop.category.includes("Foodgrain")) ||
        (activeCategory === "pulses" && (crop.category.includes("Pulse") || crop.category.includes("Protein"))) ||
        (activeCategory === "oilseeds" && (crop.category.includes("Oil") || crop.category.includes("Edible"))) ||
        (activeCategory === "commercial" && (crop.category.includes("Commercial") || crop.category.includes("Biofuel")));
      const text = `
        ${crop.name}
        ${crop.category}
        ${crop.agency}
        ${crop.season}
      `.toLowerCase();

      return matchesCategory && text.includes(search.toLowerCase());
    });

    if (sort === "rank") {
      result = [...result].sort((a, b) => a.rank - b.rank);
    }

    if (sort === "target") {
      result = [...result].sort((a, b) => b.target - a.target);
    }

    if (sort === "deficit") {
      result = [...result].sort((a, b) => b.deficit - a.deficit);
    }

    if (sort === "msp") {
      result = [...result].sort(
        (a, b) =>
          parseInt(b.msp.replace(/[^\d]/g, "")) -
          parseInt(a.msp.replace(/[^\d]/g, ""))
      );
    }

    if (sort === "az") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [activeCategory, search, sort]);

  const handleMatrix = () => {
    if (onOpenSchedule) {
      onOpenSchedule();
    }
  };

  const handleForm = () => {
    if (onOpenForm) {
      onOpenForm();
    }
  };

  const handleBook = (crop) => {
    if (onBookSlot) {
      onBookSlot(crop);
    } else if (onProceed) {
      onProceed("booking", crop);
    }
  };

  return (
    <main className="crop-demand-page">
      <div className="crop-demand-header">
        <div>
          <div className="crop-demand-eyebrow">
            CROP IN DEMAND • NATIONAL HIGH QUANTITY PROCUREMENT TARGETS
          </div>

          <h1>CROP IN DEMAND</h1>
        </div>

        <button
          className="crop-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* HERO */}
      <section className="demand-hero">
        <div className="demand-hero-icon">🏛️</div>

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

      {/* TOP STAT CARDS */}
      <section className="demand-stat-grid">
        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label red">
              🏆 #1 VOLUME FOODGRAIN
            </span>
            <span>🌾</span>
          </div>

          <strong>540.0 LMT</strong>
          <small>Paddy Common / Rice Target</small>
          <em>147.6 LMT Open for Farmer Intake</em>
        </div>

        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label yellow">
              🌾 STRATEGIC BREADBASKET
            </span>
            <span>🌾</span>
          </div>

          <strong>320.0 LMT</strong>
          <small>Wheat Central Reserve Target</small>
          <em>54.0 LMT Open for Farmer Intake</em>
        </div>

        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label yellow">
              ⚡ CRITICAL DEFICIT PULSE
            </span>
            <span>🫘</span>
          </div>

          <strong>40.0 L Qtl</strong>
          <small>Tur (Arhar) Buffer Drive</small>
          <em className="danger-text">
            21.8 L Qtl Deficit • 100% Assured Purchase
          </em>
        </div>

        <div className="demand-stat-card">
          <div className="stat-top">
            <span className="stat-label green">
              🌽 BIOFUEL 20% MISSION
            </span>
            <span>🌽</span>
          </div>

          <strong>65.0 L Qtl</strong>
          <small>Maize Ethanol Intake Quota</small>
          <em>27.0 L Qtl Actively Open Quota</em>
        </div>
      </section>

      {/* SEARCH / SORT */}
      <section className="demand-controls">
        <div className="demand-tabs">
          <button
            className={activeCategory === "all" ? "active" : ""}
            onClick={() => setActiveCategory("all")}
          >
            All High Demand
          </button>

          <button
            className={activeCategory === "foodgrains" ? "active" : ""}
            onClick={() => setActiveCategory("foodgrains")}
          >
            Foodgrains / Cereals
          </button>

          <button
            className={activeCategory === "pulses" ? "active" : ""}
            onClick={() => setActiveCategory("pulses")}
          >
            Urgent Pulses / Buffer Deficit
          </button>

          <button
            className={activeCategory === "oilseeds" ? "active" : ""}
            onClick={() => setActiveCategory("oilseeds")}
          >
            Oilseeds Mission
          </button>

          <button
            className={activeCategory === "commercial" ? "active" : ""}
            onClick={() => setActiveCategory("commercial")}
          >
            Commercial / Industrial
          </button>
        </div>

        <div className="demand-search-row">
          <span className="sort-title">SORT:</span>

          <button
            className={sort === "target" ? "sort-btn selected" : "sort-btn"}
            onClick={() => setSort("target")}
          >
            📊 Volume
          </button>

          <button
            className={sort === "deficit" ? "sort-btn selected" : "sort-btn"}
            onClick={() => setSort("deficit")}
          >
            ⚡ Deficit
          </button>

          <button
            className={sort === "msp" ? "sort-btn selected" : "sort-btn"}
            onClick={() => setSort("msp")}
          >
            💰 Highest MSP
          </button>

          <button
            className={sort === "az" ? "sort-btn selected" : "sort-btn"}
            onClick={() => setSort("az")}
          >
            🔤 A-Z
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="target-select"
          >
            <option value="rank">Target Quota: High to Low</option>
            <option value="target">Target Quota: High to Low</option>
            <option value="deficit">Deficit: High to Low</option>
            <option value="msp">MSP: High to Low</option>
            <option value="az">Name: A-Z</option>
          </select>

          <div className="crop-search">
            🔍
            <input
              type="text"
              placeholder="Search crop or agency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className="verified-pill">
            ✓ Target Quota (Highest First)
          </span>
        </div>
      </section>

      {/* CROP CARDS */}
      <section className="crop-grid">
        {filteredCrops.map((crop) => {
          const progress = Math.round(
            (crop.procured / crop.target) * 100
          );

          return (
            <article
              className={`crop-card ${
                crop.rank === 4 || crop.rank === 6
                  ? "gold-border"
                  : ""
              }`}
              key={crop.rank}
            >
              <div className="crop-card-top">
                <div>
                  <span className="rank-badge">
                    Rank #{crop.rank}
                  </span>

                  <span className={`demand-tag ${crop.tagType}`}>
                    {crop.tag}
                  </span>
                </div>

                <span className="crop-season">
                  {crop.season}
                </span>
              </div>

              <div className="crop-title">
                <div className="crop-icon">{crop.emoji}</div>

                <div>
                  <h3>{crop.name}</h3>

                  <p>
                    {crop.category} •{" "}
                    <strong>{crop.agency}</strong>
                  </p>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="progress-box">
                <div className="progress-info">
                  <strong>
                    Progress: {progress}% Procured
                  </strong>

                  <strong>
                    Remaining Deficit: {crop.deficit} Lakh
                  </strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-green"
                    style={{ width: `${progress}%` }}
                  />

                  <div className="progress-orange" />
                </div>
              </div>

              {/* NUMBERS */}
              <div className="crop-numbers">
                <div>
                  <strong>{crop.target}</strong>
                  <span>GOVT TARGET (LAKH)</span>
                </div>

                <div>
                  <strong>{crop.procured}</strong>
                  <span>PROCURED SO FAR</span>
                </div>

                <div>
                  <strong>{crop.deficit}</strong>
                  <span>OPEN INTAKE QUOTA</span>
                </div>
              </div>

              {/* MSP */}
              <div className="msp-row">
                <strong>Govt MSP: {crop.msp}</strong>

                <span>{crop.purchase}</span>
              </div>

              {/* PURPOSE */}
              <div className="crop-purpose">
                <strong>Govt Purpose:</strong> {crop.purpose}
              </div>

              {/* BENEFIT */}
              <div className="crop-benefit">
                ✨ {crop.benefit}
              </div>

              {/* BUTTONS */}
              <div className="crop-actions">
                <button
                  className="sell-btn"
                  onClick={() => handleBook(crop)}
                >
                  Sell This Crop (Book Slot)
                </button>

                <button
                  className="outline-btn matrix-btn"
                  onClick={handleMatrix}
                >
                  📊 Matrix
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {filteredCrops.length === 0 && (
        <div className="no-results">
          No crops found for "<strong>{search}</strong>"
        </div>
      )}

      {/* WHY PRIORITIZE */}
      <section className="why-section">
        <h3>🌾 Why Farmers Should Prioritize Selling High-Demand Crops:</h3>

        <div className="why-grid">
          <div>
            <strong>1. Guaranteed Purchase Price</strong>
            <p>
              Government guarantees procurement at or above official
              MSP benchmarks with zero distress selling risk.
            </p>
          </div>

          <div>
            <strong>2. Zero Middleman Commissions</strong>
            <p>
              Direct weighbridge intake at cooperative centers with
              zero commission fees, arbitrary cuts, or hidden deductions.
            </p>
          </div>

          <div>
            <strong>3. Direct Benefit Transfer (DBT)</strong>
            <p>
              100% verified digital payment transferred directly to
              your Aadhaar-seeded bank account within 24 to 48 hours.
            </p>
          </div>

          <div>
            <strong>4. Priority Intake Slots</strong>
            <p>
              High-demand quotas receive expedited convoy tokens,
              dedicated unloading bays, and faster gate clearance.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM NAVIGATION */}
      <section className="demand-footer">
        <strong>
          Ready to schedule produce delivery for high-demand quotas?
        </strong>

        <div className="footer-actions">
          <button
            className="footer-proceed"
            onClick={handleForm}
          >
            Proceed to Form Filling →
          </button>
        </div>
      </section>
    </main>
  );
}

export default CropDemand;