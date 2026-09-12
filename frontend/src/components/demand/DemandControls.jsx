import { SearchIcon } from "../common/Icons";
import { DEMAND_CATEGORIES } from "../../data/crops";
import "./DemandControls.css";

// Category tabs, sort controls, and search for filtering demand crops
function DemandControls({
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
}) {
  return (
    <section className="demand-controls">
      {/* Category filter tabs */}
      <div className="demand-tabs">
        {DEMAND_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={activeCategory === cat.key ? "active" : ""}
            onClick={() => onCategoryChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort + search row */}
      <div className="demand-search-row">
        <span className="sort-title">SORT:</span>

        <button
          className={sort === "target" ? "sort-btn selected" : "sort-btn"}
          onClick={() => onSortChange("target")}
        >
          Volume
        </button>

        <button
          className={sort === "deficit" ? "sort-btn selected" : "sort-btn"}
          onClick={() => onSortChange("deficit")}
        >
          Deficit
        </button>

        <button
          className={sort === "msp" ? "sort-btn selected" : "sort-btn"}
          onClick={() => onSortChange("msp")}
        >
          Highest MSP
        </button>

        <button
          className={sort === "az" ? "sort-btn selected" : "sort-btn"}
          onClick={() => onSortChange("az")}
        >
          A-Z
        </button>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="target-select"
        >
          <option value="rank">Target Quota: High to Low</option>
          <option value="target">Target Quota: High to Low</option>
          <option value="deficit">Deficit: High to Low</option>
          <option value="msp">MSP: High to Low</option>
          <option value="az">Name: A-Z</option>
        </select>

        <div className="crop-search">
          <SearchIcon size={14} />
          <input
            type="text"
            placeholder="Search crop or agency..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <span className="verified-pill">
          Target Quota (Highest First)
        </span>
      </div>
    </section>
  );
}

export default DemandControls;
