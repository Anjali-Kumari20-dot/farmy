import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ArrowRightIcon } from "../components/common/Icons";
import DemandHero from "../components/demand/DemandHero";
import DemandControls from "../components/demand/DemandControls";
import CropCard from "../components/demand/CropCard";
import { DEMAND_CROPS, matchesDemandCategory } from "../data/crops";
import "./CropDemandPage.css";

// Full-screen crop demand page showing government procurement targets
function CropDemandPage({ onClose, onOpenSchedule, onOpenForm, onBookSlot }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rank");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter and sort crops based on current controls state
  const filteredCrops = useMemo(() => {
    let result = DEMAND_CROPS.filter((crop) => {
      const matchesCategory = matchesDemandCategory(crop, activeCategory);
      const searchText = `${crop.name} ${crop.category} ${crop.agency} ${crop.season}`.toLowerCase();
      return matchesCategory && searchText.includes(search.toLowerCase());
    });

    switch (sort) {
      case "target":  return [...result].sort((a, b) => b.target - a.target);
      case "deficit": return [...result].sort((a, b) => b.deficit - a.deficit);
      case "msp":     return [...result].sort(
        (a, b) => parseInt(b.msp.replace(/[^\d]/g, "")) - parseInt(a.msp.replace(/[^\d]/g, ""))
      );
      case "az":      return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default:        return [...result].sort((a, b) => a.rank - b.rank);
    }
  }, [activeCategory, search, sort]);

  const handleBookSlot = (crop) => {
    onBookSlot?.(crop);
  };

  return (
    <main className="crop-demand-page">
      {/* Page header */}
      <div className="crop-demand-header">
        <div>
          <div className="crop-demand-eyebrow">
            CROP IN DEMAND -- NATIONAL HIGH QUANTITY PROCUREMENT TARGETS
          </div>
          <h1>CROP IN DEMAND</h1>
        </div>

        <button className="crop-close-btn" onClick={() => (onClose ? onClose() : navigate("/dashboard"))} aria-label="Close">
          <CloseIcon size={24} />
        </button>
      </div>

      {/* Hero + stat cards */}
      <DemandHero />

      {/* Filter controls */}
      <DemandControls
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Crop cards grid */}
      <section className="crop-grid">
        {filteredCrops.map((crop) => (
          <CropCard
            key={crop.rank}
            crop={crop}
            onBookSlot={handleBookSlot}
            onOpenSchedule={() => onOpenSchedule?.()}
          />
        ))}
      </section>

      {filteredCrops.length === 0 && (
        <div className="no-results">
          No crops found for &quot;<strong>{search}</strong>&quot;
        </div>
      )}

      {/* Why section */}
      <section className="why-section">
        <h3>Why Farmers Should Prioritize Selling High-Demand Crops:</h3>

        <div className="why-grid">
          <div>
            <strong>1. Guaranteed Purchase Price</strong>
            <p>
              Government guarantees procurement at or above official MSP
              benchmarks with zero distress selling risk.
            </p>
          </div>
          <div>
            <strong>2. Zero Middleman Commissions</strong>
            <p>
              Direct weighbridge intake at cooperative centers with zero
              commission fees, arbitrary cuts, or hidden deductions.
            </p>
          </div>
          <div>
            <strong>3. Direct Benefit Transfer (DBT)</strong>
            <p>
              100% verified digital payment transferred directly to your
              Aadhaar-seeded bank account within 24 to 48 hours.
            </p>
          </div>
          <div>
            <strong>4. Priority Intake Slots</strong>
            <p>
              High-demand quotas receive expedited convoy tokens, dedicated
              unloading bays, and faster gate clearance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="demand-footer">
        <strong>Ready to schedule produce delivery for high-demand quotas?</strong>

        <div className="footer-actions">
          <button className="footer-proceed" onClick={() => onOpenForm?.()}>
            Proceed to Form Filling
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default CropDemandPage;
