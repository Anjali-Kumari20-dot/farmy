import { ChartIcon } from "../common/Icons";
import "./CropCard.css";

// Renders a single crop demand card with progress, stats, and actions
function CropCard({ crop, onBookSlot, onOpenSchedule }) {
  const progress = Math.round((crop.procured / crop.target) * 100);

  return (
    <article
      className={`crop-card ${
        crop.rank === 4 || crop.rank === 6 ? "gold-border" : ""
      }`}
    >
      {/* Header: rank badge + demand tag + season */}
      <div className="crop-card-top">
        <div>
          <span className="rank-badge">Rank #{crop.rank}</span>
          <span className={`demand-tag ${crop.tagType}`}>{crop.tag}</span>
        </div>
        <span className="crop-season">{crop.season}</span>
      </div>

      {/* Crop name and category */}
      <div className="crop-title">
        <div className="crop-icon-box">
          <span className="crop-initial">{crop.name.charAt(0)}</span>
        </div>
        <div>
          <h3>{crop.name}</h3>
          <p>
            {crop.category} -- <strong>{crop.agency}</strong>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-box">
        <div className="progress-info">
          <strong>Progress: {progress}% Procured</strong>
          <strong>Remaining Deficit: {crop.deficit} Lakh</strong>
        </div>
        <div className="progress-track">
          <div className="progress-green" style={{ width: `${progress}%` }} />
          <div className="progress-orange" />
        </div>
      </div>

      {/* Numeric stats */}
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

      {/* MSP row */}
      <div className="msp-row">
        <strong>Govt MSP: {crop.msp}</strong>
        <span>{crop.purchase}</span>
      </div>

      {/* Government purpose */}
      <div className="crop-purpose">
        <strong>Govt Purpose:</strong> {crop.purpose}
      </div>

      {/* Farmer benefit */}
      <div className="crop-benefit">{crop.benefit}</div>

      {/* Action buttons */}
      <div className="crop-actions">
        <button className="sell-btn" onClick={() => onBookSlot(crop)}>
          Sell This Crop (Book Slot)
        </button>
        <button className="outline-btn matrix-btn" onClick={onOpenSchedule}>
          <ChartIcon size={12} /> Matrix
        </button>
      </div>
    </article>
  );
}

export default CropCard;
