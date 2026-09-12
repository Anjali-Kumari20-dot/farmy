import { useMemo, useState } from "react";
import { SearchIcon, CloseIcon } from "../common/Icons";
import { MSP_CROPS, MSP_YEARS, groupMspCropsByCategory } from "../../data/crops";
import "./MspTable.css";

// Format a raw MSP value with rupee symbol, or return as-is for dashes
function formatMsp(value) {
  return value === "\u2014" ? "\u2014" : `\u20B9${value}`;
}

// MSP price matrix table with search and category grouping
function MspTable() {
  const [search, setSearch] = useState("");

  const filteredCrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MSP_CROPS;

    return MSP_CROPS.filter(
      (crop) =>
        crop.name.toLowerCase().includes(query) ||
        crop.category.toLowerCase().includes(query)
    );
  }, [search]);

  const groupedRows = groupMspCropsByCategory(filteredCrops);

  return (
    <div className="msp-table-wrap">
      {/* Kicker */}
      <div className="msp-kicker">
        PROCUREMENT PRICES -- CACP MINISTRY OF AGRICULTURE MSP SCHEDULE
      </div>

      <h1 className="msp-title">PROCUREMENT PRICES</h1>

      <div className="msp-section-heading">
        <strong>OFFICIAL MSP PROCUREMENT PRICES AND SCHEDULE &amp; OPERATIONAL CALENDAR</strong>
      </div>

      {/* Search */}
      <div className="msp-search-strip">
        <div className="msp-search">
          <SearchIcon size={15} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop..."
            aria-label="Search crop"
          />
          {search && (
            <button
              className="msp-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="msp-table-card">
        <div className="msp-table-heading">
          Crop &amp; Year-wise Minimum Support Price (MSP) Matrix
        </div>

        <div className="msp-table-scroll">
          <table className="msp-table">
            <thead>
              <tr>
                <th className="crop-column" rowSpan="2">Commodity</th>
                {MSP_YEARS.map((year) => (
                  <th key={year} colSpan="2">{year}</th>
                ))}
              </tr>
              <tr>
                {MSP_YEARS.flatMap((year) => [
                  <th key={`${year}-rec`} className="sub-head">Rec</th>,
                  <th key={`${year}-fixed`} className="sub-head">Fixed</th>,
                ])}
              </tr>
            </thead>

            <tbody>
              {groupedRows.length > 0 ? (
                groupedRows.flatMap(({ category, rows }) => [
                  <tr key={`${category}-heading`} className="msp-category-row">
                    <td colSpan={1 + MSP_YEARS.length * 2}>{category}</td>
                  </tr>,
                  ...rows.map((crop) => (
                    <tr key={crop.name} className="msp-crop-row">
                      <td className="msp-crop-name">
                        <span>{crop.name}</span>
                      </td>
                      {crop.values.flatMap((value, index) => [
                        <td key={`${crop.name}-${MSP_YEARS[index]}-rec`} className="msp-value">
                          {formatMsp(value)}
                        </td>,
                        <td key={`${crop.name}-${MSP_YEARS[index]}-fixed`} className="msp-value">
                          {formatMsp(value)}
                        </td>,
                      ])}
                    </tr>
                  )),
                ])
              ) : (
                <tr>
                  <td className="msp-no-results" colSpan={1 + MSP_YEARS.length * 2}>
                    No crop found for &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="msp-result-note">
          {search
            ? `${filteredCrops.length} matching crop${filteredCrops.length === 1 ? "" : "s"}`
            : `${MSP_CROPS.length} commodities shown`}
        </div>
      </div>
    </div>
  );
}

export default MspTable;
