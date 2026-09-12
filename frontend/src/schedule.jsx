import { useMemo, useState } from "react";
import "./schedule.css";

const YEARS = [
  "2026-27", "2025-26", "2024-25", "2023-24", "2022-23", "2021-22",
  "2020-21", "2019-20", "2018-19", "2017-18", "2016-17", "2015-16",
  "2014-15", "2013-14", "2012-13", "2011-12", "2010-11",
];

const crops = [
  {
    category: "KHARIF CROPS",
    name: "Paddy Common",
    icon: "🌾",
    values: ["2,441", "2,369", "2,300", "2,183", "2,040", "1,940", "1,868", "1,815", "1,750", "1,550", "1,470", "1,410", "1,360", "1,310", "1,250", "1,080", "1,000"],
  },
  {
    category: "KHARIF CROPS",
    name: "Paddy(F)/Grade A",
    icon: "🌾",
    values: ["2,461", "2,389", "2,320", "2,203", "2,060", "1,960", "1,888", "1,835", "1,770", "1,590", "1,510", "1,450", "1,400", "1,345", "1,280", "1,110", "1,030"],
  },
  {
    category: "KHARIF CROPS",
    name: "Jowar-Hybrid",
    icon: "🌾",
    values: ["4,023", "3,699", "3,371", "3,180", "2,970", "2,738", "2,620", "2,550", "2,430", "1,700", "1,625", "1,570", "1,530", "1,500", "1,500", "980", "880"],
  },
  {
    category: "KHARIF CROPS",
    name: "Jowar-Maldandi",
    icon: "🌾",
    values: ["4,073", "3,749", "3,421", "3,225", "2,990", "2,758", "2,640", "2,570", "2,450", "1,725", "1,650", "1,590", "1,550", "1,520", "1,520", "1,000", "900"],
  },
  {
    category: "KHARIF CROPS",
    name: "Bajra",
    icon: "🌾",
    values: ["2,900", "2,775", "2,625", "2,500", "2,350", "2,250", "2,150", "2,000", "1,950", "1,425", "1,330", "1,275", "1,250", "1,175", "1,175", "980", "880"],
  },
  {
    category: "KHARIF CROPS",
    name: "Maize",
    icon: "🌽",
    values: ["2,410", "2,400", "2,225", "2,090", "1,962", "1,870", "1,850", "1,760", "1,700", "1,425", "1,365", "1,325", "1,310", "1,310", "1,175", "980", "880"],
  },
  {
    category: "KHARIF CROPS",
    name: "Ragi",
    icon: "🌾",
    values: ["5,205", "4,886", "4,290", "3,846", "3,578", "3,377", "3,295", "3,150", "2,895", "1,900", "1,725", "1,650", "1,550", "1,500", "1,500", "1,050", "965"],
  },
  {
    category: "KHARIF CROPS",
    name: "Tur (Arhar)",
    icon: "🫘",
    values: ["8,450", "8,000", "7,550", "7,000", "6,600", "6,300", "6,000", "5,800", "5,675", "5,250", "4,625", "4,425", "4,350", "3,850", "3,850", "3,100", "2,800"],
  },
  {
    category: "KHARIF CROPS",
    name: "Moong",
    icon: "🫘",
    values: ["8,780", "8,768", "8,682", "8,558", "7,755", "7,275", "7,196", "7,050", "6,975", "5,375", "4,800", "4,650", "4,600", "4,500", "4,400", "3,400", "3,170"],
  },
  {
    category: "KHARIF CROPS",
    name: "Urad",
    icon: "🫘",
    values: ["8,200", "7,800", "7,400", "6,950", "6,600", "6,300", "6,000", "5,700", "5,600", "5,200", "4,575", "4,425", "4,350", "4,300", "4,300", "3,300", "2,900"],
  },
  {
    category: "KHARIF CROPS",
    name: "Groundnut",
    icon: "🥜",
    values: ["7,517", "7,263", "6,783", "6,377", "5,850", "5,550", "5,275", "5,090", "4,890", "4,250", "4,120", "4,030", "4,000", "4,000", "3,700", "2,700", "2,300"],
  },
  {
    category: "KHARIF CROPS",
    name: "Sunflower Seed",
    icon: "🌻",
    values: ["8,343", "7,721", "7,280", "6,760", "6,400", "6,015", "5,885", "5,650", "5,385", "4,000", "3,850", "3,800", "3,750", "3,700", "3,700", "2,800", "2,350"],
  },
  {
    category: "KHARIF CROPS",
    name: "Soyabean Yellow",
    icon: "🌱",
    values: ["5,708", "5,328", "4,892", "4,600", "4,300", "3,950", "3,880", "3,710", "3,390", "2,850", "2,675", "2,600", "2,560", "2,560", "—", "1,690", "1,440"],
  },
  {
    category: "KHARIF CROPS",
    name: "Sesamum",
    icon: "🌱",
    values: ["10,346", "9,846", "9,267", "8,635", "7,830", "7,307", "6,855", "6,485", "6,230", "5,200", "4,800", "4,700", "4,600", "4,500", "4,200", "3,400", "2,900"],
  },
  {
    category: "KHARIF CROPS",
    name: "Nigerseed",
    icon: "🌱",
    values: ["10,052", "9,537", "8,717", "7,734", "7,287", "6,930", "6,695", "5,940", "5,860", "3,950", "3,725", "3,650", "3,600", "3,500", "3,500", "2,900", "2,450"],
  },
  {
    category: "KHARIF CROPS",
    name: "Medium Staple Cotton",
    icon: "☁️",
    values: ["8,267", "7,710", "7,121", "6,620", "6,080", "5,726", "5,515", "5,255", "5,150", "4,020", "3,860", "3,800", "3,750", "3,700", "3,600", "2,800", "2,500"],
  },
  {
    category: "KHARIF CROPS",
    name: "Long Staple Cotton",
    icon: "☁️",
    values: ["8,667", "8,110", "7,521", "7,020", "6,380", "6,025", "5,825", "5,550", "5,450", "4,320", "4,160", "4,100", "4,050", "4,000", "3,900", "3,300", "3,000"],
  },
  {
    category: "RABI CROPS",
    name: "Wheat",
    icon: "🌾",
    values: ["—", "2,585", "2,425", "2,275", "2,125", "2,015", "1,975", "1,925", "1,840", "1,735", "1,625", "1,525", "1,450", "1,400", "1,285", "1,285", "1,120"],
  },
  {
    category: "RABI CROPS",
    name: "Barley",
    icon: "🌾",
    values: ["—", "2,150", "1,980", "1,850", "1,735", "1,635", "1,600", "1,525", "1,440", "1,410", "1,325", "1,225", "1,150", "1,100", "980", "980", "780"],
  },
  {
    category: "RABI CROPS",
    name: "Gram",
    icon: "🫘",
    values: ["—", "5,875", "5,650", "5,440", "5,335", "5,230", "5,100", "4,875", "4,620", "4,250", "3,800", "3,425", "3,175", "3,100", "3,000", "2,800", "2,100"],
  },
  {
    category: "RABI CROPS",
    name: "Lentil (Masur)",
    icon: "🫘",
    values: ["—", "7,000", "6,700", "6,425", "6,000", "5,500", "5,100", "4,800", "4,475", "4,150", "3,800", "3,325", "3,075", "2,950", "2,900", "2,800", "2,250"],
  },
  {
    category: "RABI CROPS",
    name: "Rapeseed / Mustard",
    icon: "🌼",
    values: ["—", "6,200", "5,950", "5,650", "5,450", "5,050", "4,650", "4,425", "4,200", "3,900", "3,600", "3,350", "3,100", "3,050", "3,000", "2,500", "1,850"],
  },
  {
    category: "RABI CROPS",
    name: "Safflower",
    icon: "🌻",
    values: ["—", "6,540", "5,940", "5,800", "5,650", "5,441", "5,327", "5,215", "4,945", "4,000", "3,600", "3,300", "3,050", "3,000", "2,800", "2,500", "1,800"],
  },
  {
    category: "COMMERCIAL CROPS",
    name: "Jute",
    icon: "🌿",
    values: ["5,925", "5,650", "5,335", "5,050", "4,750", "4,500", "4,225", "3,950", "3,700", "3,500", "3,200", "2,700", "2,400", "2,300", "2,200", "1,675", "1,575"],
  },
  {
    category: "COMMERCIAL CROPS",
    name: "Sugarcane",
    icon: "🎋",
    values: ["365", "355", "340", "315", "305", "290", "285", "275", "275", "255", "230", "230", "220", "210", "170", "145", "139"],
  },
  {
    category: "COMMERCIAL CROPS",
    name: "Copra (Milling)",
    icon: "🥥",
    values: ["—", "12,027", "11,582", "11,160", "10,860", "10,590", "10,335", "9,960", "9,520", "7,500", "6,500", "5,950", "5,550", "5,250", "5,100", "5,100", "4,525"],
  },
  {
    category: "COMMERCIAL CROPS",
    name: "Copra (Ball)",
    icon: "🥥",
    values: ["—", "12,500", "12,100", "12,000", "11,750", "11,000", "10,600", "10,300", "9,920", "7,750", "6,785", "6,240", "5,830", "5,500", "5,350", "5,350", "4,775"],
  },
];

function formatMSP(value) {
  return value === "—" ? "—" : `₹${value}`;
}

function getCategoryRows(filteredCrops) {
  return ["KHARIF CROPS", "RABI CROPS", "COMMERCIAL CROPS"]
    .map((category) => ({
      category,
      rows: filteredCrops.filter((crop) => crop.category === category),
    }))
    .filter((group) => group.rows.length);
}

function Schedule({ onClose }) {
  const [search, setSearch] = useState("");

  const filteredCrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return crops;

    return crops.filter((crop) =>
      crop.name.toLowerCase().includes(query) ||
      crop.category.toLowerCase().includes(query)
    );
  }, [search]);

  const groupedRows = getCategoryRows(filteredCrops);

  return (
    <div className="schedule-overlay" role="dialog" aria-modal="true" aria-labelledby="schedule-title">
      <section className="schedule-modal">
        <button className="schedule-close" onClick={onClose} aria-label="Close schedule">
          ×
        </button>

        <div className="schedule-kicker">
          PROCUREMENT PRICES • CACP MINISTRY OF AGRICULTURE MSP SCHEDULE
        </div>

        <h1 id="schedule-title" className="schedule-title">
          PROCUREMENT PRICES
        </h1>

        <div className="schedule-section-heading">
          <span>▣</span>
          <strong>OFFICIAL MSP PROCUREMENT PRICES AND SCHEDULE &amp; OPERATIONAL CALENDAR</strong>
        </div>

        <div className="schedule-search-strip">
          <div className="schedule-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search crop ..."
              aria-label="Search crop"
            />
            {search && (
              <button className="schedule-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        </div>

        <div className="schedule-table-card">
          <div className="schedule-table-header">
            <div className="schedule-table-heading">
              <span>♜</span>
              <span>Crop &amp; Year-wise Minimum Support Price (MSP) Matrix</span>
            </div>

            
          </div>

          <div className="schedule-table-scroll">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="crop-column" rowSpan="2">Commodity</th>
                  {YEARS.map((year) => (
                    <th key={year} colSpan="2">{year}</th>
                  ))}
                </tr>
                <tr>
                  {YEARS.map((year) => (
                    <th key={`${year}-rec`} className="sub-head">Rec</th>
                  )).flatMap((_, index) => [
                    <th key={`${YEARS[index]}-rec`} className="sub-head">Rec</th>,
                    <th key={`${YEARS[index]}-fixed`} className="sub-head">Fixed</th>,
                  ])}
                </tr>
              </thead>

              <tbody>
                {groupedRows.length > 0 ? (
                  groupedRows.flatMap(({ category, rows }) => [
                    <tr key={`${category}-heading`} className="schedule-category-row">
                      <td colSpan={1 + YEARS.length * 2}>{category}</td>
                    </tr>,
                    ...rows.map((crop) => (
                      <tr key={crop.name} className="schedule-crop-row">
                        <td className="crop-name">
                          <span className="crop-icon">{crop.icon}</span>
                          <span>{crop.name}</span>
                        </td>

                        {crop.values.flatMap((value, index) => [
                          <td key={`${crop.name}-${YEARS[index]}-rec`} className="msp-value">
                            {formatMSP(value)}
                          </td>,
                          <td key={`${crop.name}-${YEARS[index]}-fixed`} className="msp-value">
                            {formatMSP(value)}
                          </td>,
                        ])}
                      </tr>
                    )),
                  ])
                ) : (
                  <tr>
                    <td className="schedule-no-results" colSpan={1 + YEARS.length * 2}>
                      No crop found for “{search}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="schedule-result-note">
            {search
              ? `${filteredCrops.length} matching crop${filteredCrops.length === 1 ? "" : "s"}`
              : `${crops.length} commodities shown`}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Schedule;