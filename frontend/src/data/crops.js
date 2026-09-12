/**
 * Centralized crop data used across the application.
 * - DEMAND_CROPS: high-demand procurement targets (CropDemand page)
 * - MSP_YEARS / MSP_CROPS: historical MSP price matrix (Schedule page)
 * - CROP_OPTIONS: select dropdown entries (ProcurementForm)
 */

// -- High-demand crops shown on the CropDemand page --

export const DEMAND_CROPS = [
  {
    rank: 1,
    name: "Paddy Common",
    season: "Kharif Crops",
    tag: "CRITICAL NATIONAL DEMAND",
    tagType: "critical",
    category: "Foodgrains / Cereals",
    agency: "FCI & State Civil Supplies",
    target: 540,
    procured: 392.4,
    deficit: 147.6,
    msp: "\u20B92,441/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "National Food Security Act (NFSA), PMGKAY free grain distribution & 4-Month Central Strategic Buffer Reserve.",
    benefit:
      "100% guaranteed intake at all centers, express weighbridge gate clearance, 24-hr DBT payout settlement.",
  },
  {
    rank: 2,
    name: "Wheat",
    season: "Rabi Crops",
    tag: "CRITICAL NATIONAL DEMAND",
    tagType: "critical",
    category: "Foodgrains (Cereal)",
    agency: "FCI & State Agencies",
    target: 320,
    procured: 266,
    deficit: 54,
    msp: "\u20B92,585/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Central Pool Stock Replenishment, OMSS Market Stabilization & Public Distribution System (PDS).",
    benefit:
      "Zero quantity cap per verified farmer. Inter-district transport rebate of \u20B950/Qtl for >25 km transit.",
  },
  {
    rank: 3,
    name: "Medium Staple Cotton",
    season: "Kharif Crops",
    tag: "HIGH INDUSTRIAL DEMAND",
    tagType: "high",
    category: "Commercial & Textile",
    agency: "Cotton Corporation of India (CCI)",
    target: 70,
    procured: 46.5,
    deficit: 23.5,
    msp: "\u20B97,121/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Domestic Textile Mill Buffer Security, Cotton Price Stabilization & Export Buffer Reserves.",
    benefit:
      "Electronic moisture testers installed at all intake centers. Moisture up to 8% standard, relaxed to 12% with prorated chart.",
  },
  {
    rank: 4,
    name: "Maize",
    season: "Kharif Crops",
    tag: "HIGH INDUSTRIAL DEMAND",
    tagType: "high",
    category: "Biofuel & Industrial Cereal",
    agency: "NAFED, NCCF & FCI",
    target: 65,
    procured: 38,
    deficit: 27,
    msp: "\u20B92,225/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "National Ethanol Blending Programme (EBP - 20% by 2025-26) for Grain-Based Distilleries & Poultry Nutrition.",
    benefit:
      "Direct tie-up procurement for biofuel distilleries with guaranteed MSP and immediate weighing token clearance.",
  },
  {
    rank: 5,
    name: "Tur (Arhar)",
    season: "Kharif Crops",
    tag: "URGENT BUFFER DEFICIT",
    tagType: "urgent",
    category: "Pulse Buffer",
    agency: "NAFED & NCCF",
    target: 40,
    procured: 18.2,
    deficit: 21.8,
    msp: "\u20B97,550/Qtl",
    purchase: "+ \u20B9250/Qtl Special Buffer Incentive",
    purpose:
      "Price Stabilization Fund (PSF) Pulse Buffer Drive to combat domestic price spikes & curb import dependence.",
    benefit:
      "100% Procurement Guarantee without state ceiling limit + \u20B9250/Qtl Direct Buffer Incentive on spot.",
  },
  {
    rank: 6,
    name: "Urad",
    season: "Kharif Crops",
    tag: "URGENT BUFFER DEFICIT",
    tagType: "urgent",
    category: "High Priority Pulse",
    agency: "NAFED",
    target: 35,
    procured: 16.5,
    deficit: 18.5,
    msp: "\u20B97,400/Qtl",
    purchase: "+ \u20B9200/Qtl Special Buffer Incentive",
    purpose:
      "Central Strategic Pulse Buffer Stock & Defense Services Supply under Price Support Scheme (PSS).",
    benefit:
      "Assured purchase under PM-AASHA with instant digital moisture assaying and zero broker commissions.",
  },
  {
    rank: 7,
    name: "Rapeseed / Mustard",
    season: "Rabi Crops",
    tag: "HIGH EDIBLE OIL DEMAND",
    tagType: "high",
    category: "Oilseeds Mission",
    agency: "NAFED & State Oil Federations",
    target: 32,
    procured: 21.4,
    deficit: 10.6,
    msp: "\u20B95,950/Qtl",
    purchase: "+ \u20B9150/Qtl Special Buffer Incentive",
    purpose:
      "National Mission on Edible Oils - Oilseeds (NMEO-OS) to eliminate foreign cooking oil import dependence.",
    benefit:
      "Direct cooperative milling intake with oil-content premium bonus up to \u20B9150/Qtl for >40% oil content.",
  },
  {
    rank: 8,
    name: "Gram",
    season: "Rabi Crops",
    tag: "HIGH VOLUME DEMAND",
    tagType: "high",
    category: "Strategic Protein Reserve",
    agency: "NAFED",
    target: 30,
    procured: 22.5,
    deficit: 7.5,
    msp: "\u20B95,650/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Pulses Price Stabilization, Armed Forces Rationing & PM-POSHAN Mid-Day Meal Protein Allocation.",
    benefit:
      "Smooth electronic weighbridge tokening, zero market fees or statutory deductions for registered farmers.",
  },
  {
    rank: 9,
    name: "Soyabean Yellow",
    season: "Kharif Crops",
    tag: "HIGH VOLUME DEMAND",
    tagType: "high",
    category: "National Protein & Oil Drive",
    agency: "NAFED & State Federations",
    target: 28,
    procured: 17.8,
    deficit: 10.2,
    msp: "\u20B94,892/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Domestic Soya Oil Extraction & Non-GMO High-Protein Meal for National Dairy & Poultry Infrastructure.",
    benefit:
      "Assured purchase under PM-AASHA with instant assaying report and direct bank voucher release.",
  },
  {
    rank: 10,
    name: "Groundnut",
    season: "Kharif Crops",
    tag: "HIGH VOLUME DEMAND",
    tagType: "high",
    category: "Domestic Edible Oil Buffer",
    agency: "NAFED & State Oilseed Unions",
    target: 22,
    procured: 14.2,
    deficit: 7.8,
    msp: "\u20B96,783/Qtl",
    purchase: "Guaranteed 100% Purchase",
    purpose:
      "Domestic Groundnut Oil Reserves and HPS Export Grade Quality Buffer Stock Maintenance.",
    benefit:
      "Spot weighment and electronic assaying certification. No deduction for pod size variations within FAQ standards.",
  },
];


// -- MSP Schedule year labels --

export const MSP_YEARS = [
  "2026-27", "2025-26", "2024-25", "2023-24", "2022-23", "2021-22",
  "2020-21", "2019-20", "2018-19", "2017-18", "2016-17", "2015-16",
  "2014-15", "2013-14", "2012-13", "2011-12", "2010-11",
];


// -- MSP historical price data per crop (matches MSP_YEARS indices) --

export const MSP_CROPS = [
  { category: "KHARIF CROPS", name: "Paddy Common",         values: ["2,441","2,369","2,300","2,183","2,040","1,940","1,868","1,815","1,750","1,550","1,470","1,410","1,360","1,310","1,250","1,080","1,000"] },
  { category: "KHARIF CROPS", name: "Paddy(F)/Grade A",     values: ["2,461","2,389","2,320","2,203","2,060","1,960","1,888","1,835","1,770","1,590","1,510","1,450","1,400","1,345","1,280","1,110","1,030"] },
  { category: "KHARIF CROPS", name: "Jowar-Hybrid",         values: ["4,023","3,699","3,371","3,180","2,970","2,738","2,620","2,550","2,430","1,700","1,625","1,570","1,530","1,500","1,500","980","880"] },
  { category: "KHARIF CROPS", name: "Jowar-Maldandi",       values: ["4,073","3,749","3,421","3,225","2,990","2,758","2,640","2,570","2,450","1,725","1,650","1,590","1,550","1,520","1,520","1,000","900"] },
  { category: "KHARIF CROPS", name: "Bajra",                values: ["2,900","2,775","2,625","2,500","2,350","2,250","2,150","2,000","1,950","1,425","1,330","1,275","1,250","1,175","1,175","980","880"] },
  { category: "KHARIF CROPS", name: "Maize",                values: ["2,410","2,400","2,225","2,090","1,962","1,870","1,850","1,760","1,700","1,425","1,365","1,325","1,310","1,310","1,175","980","880"] },
  { category: "KHARIF CROPS", name: "Ragi",                 values: ["5,205","4,886","4,290","3,846","3,578","3,377","3,295","3,150","2,895","1,900","1,725","1,650","1,550","1,500","1,500","1,050","965"] },
  { category: "KHARIF CROPS", name: "Tur (Arhar)",          values: ["8,450","8,000","7,550","7,000","6,600","6,300","6,000","5,800","5,675","5,250","4,625","4,425","4,350","3,850","3,850","3,100","2,800"] },
  { category: "KHARIF CROPS", name: "Moong",                values: ["8,780","8,768","8,682","8,558","7,755","7,275","7,196","7,050","6,975","5,375","4,800","4,650","4,600","4,500","4,400","3,400","3,170"] },
  { category: "KHARIF CROPS", name: "Urad",                 values: ["8,200","7,800","7,400","6,950","6,600","6,300","6,000","5,700","5,600","5,200","4,575","4,425","4,350","4,300","4,300","3,300","2,900"] },
  { category: "KHARIF CROPS", name: "Groundnut",            values: ["7,517","7,263","6,783","6,377","5,850","5,550","5,275","5,090","4,890","4,250","4,120","4,030","4,000","4,000","3,700","2,700","2,300"] },
  { category: "KHARIF CROPS", name: "Sunflower Seed",       values: ["8,343","7,721","7,280","6,760","6,400","6,015","5,885","5,650","5,385","4,000","3,850","3,800","3,750","3,700","3,700","2,800","2,350"] },
  { category: "KHARIF CROPS", name: "Soyabean Yellow",      values: ["5,708","5,328","4,892","4,600","4,300","3,950","3,880","3,710","3,390","2,850","2,675","2,600","2,560","2,560","\u2014","1,690","1,440"] },
  { category: "KHARIF CROPS", name: "Sesamum",              values: ["10,346","9,846","9,267","8,635","7,830","7,307","6,855","6,485","6,230","5,200","4,800","4,700","4,600","4,500","4,200","3,400","2,900"] },
  { category: "KHARIF CROPS", name: "Nigerseed",            values: ["10,052","9,537","8,717","7,734","7,287","6,930","6,695","5,940","5,860","3,950","3,725","3,650","3,600","3,500","3,500","2,900","2,450"] },
  { category: "KHARIF CROPS", name: "Medium Staple Cotton", values: ["8,267","7,710","7,121","6,620","6,080","5,726","5,515","5,255","5,150","4,020","3,860","3,800","3,750","3,700","3,600","2,800","2,500"] },
  { category: "KHARIF CROPS", name: "Long Staple Cotton",   values: ["8,667","8,110","7,521","7,020","6,380","6,025","5,825","5,550","5,450","4,320","4,160","4,100","4,050","4,000","3,900","3,300","3,000"] },
  { category: "RABI CROPS",   name: "Wheat",                values: ["\u2014","2,585","2,425","2,275","2,125","2,015","1,975","1,925","1,840","1,735","1,625","1,525","1,450","1,400","1,285","1,285","1,120"] },
  { category: "RABI CROPS",   name: "Barley",               values: ["\u2014","2,150","1,980","1,850","1,735","1,635","1,600","1,525","1,440","1,410","1,325","1,225","1,150","1,100","980","980","780"] },
  { category: "RABI CROPS",   name: "Gram",                 values: ["\u2014","5,875","5,650","5,440","5,335","5,230","5,100","4,875","4,620","4,250","3,800","3,425","3,175","3,100","3,000","2,800","2,100"] },
  { category: "RABI CROPS",   name: "Lentil (Masur)",       values: ["\u2014","7,000","6,700","6,425","6,000","5,500","5,100","4,800","4,475","4,150","3,800","3,325","3,075","2,950","2,900","2,800","2,250"] },
  { category: "RABI CROPS",   name: "Rapeseed / Mustard",   values: ["\u2014","6,200","5,950","5,650","5,450","5,050","4,650","4,425","4,200","3,900","3,600","3,350","3,100","3,050","3,000","2,500","1,850"] },
  { category: "RABI CROPS",   name: "Safflower",            values: ["\u2014","6,540","5,940","5,800","5,650","5,441","5,327","5,215","4,945","4,000","3,600","3,300","3,050","3,000","2,800","2,500","1,800"] },
  { category: "COMMERCIAL CROPS", name: "Jute",             values: ["5,925","5,650","5,335","5,050","4,750","4,500","4,225","3,950","3,700","3,500","3,200","2,700","2,400","2,300","2,200","1,675","1,575"] },
  { category: "COMMERCIAL CROPS", name: "Sugarcane",        values: ["365","355","340","315","305","290","285","275","275","255","230","230","220","210","170","145","139"] },
  { category: "COMMERCIAL CROPS", name: "Copra (Milling)",  values: ["\u2014","12,027","11,582","11,160","10,860","10,590","10,335","9,960","9,520","7,500","6,500","5,950","5,550","5,250","5,100","5,100","4,525"] },
  { category: "COMMERCIAL CROPS", name: "Copra (Ball)",     values: ["\u2014","12,500","12,100","12,000","11,750","11,000","10,600","10,300","9,920","7,750","6,785","6,240","5,830","5,500","5,350","5,350","4,775"] },
];


// -- Crop options for the procurement form dropdown --

export const CROP_OPTIONS = [
  { value: "paddy",     label: "Paddy Common",           msp: "\u20B92,441/Qtl" },
  { value: "paddy-a",   label: "Paddy (F)/Grade A",      msp: "\u20B92,461/Qtl" },
  { value: "cotton-m",  label: "Medium Staple Cotton",    msp: "\u20B98,267/Qtl" },
  { value: "cotton-l",  label: "Long Staple Cotton",      msp: "\u20B98,667/Qtl" },
  { value: "wheat",     label: "Wheat",                   msp: "\u20B92,585/Qtl" },
  { value: "maize",     label: "Maize",                   msp: "\u20B92,410/Qtl" },
  { value: "groundnut", label: "Groundnut",               msp: "\u20B97,517/Qtl" },
  { value: "mustard",   label: "Rapeseed/Mustard",        msp: "\u20B96,200/Qtl" },
  { value: "soybean",   label: "Soyabean Yellow",         msp: "\u20B95,708/Qtl" },
  { value: "ragi",      label: "Ragi",                    msp: "\u20B95,205/Qtl" },
  { value: "tur",       label: "Tur (Arhar)",             msp: "\u20B98,450/Qtl" },
  { value: "moong",     label: "Moong",                   msp: "\u20B98,780/Qtl" },
  { value: "urad",      label: "Urad",                    msp: "\u20B98,200/Qtl" },
  { value: "gram",      label: "Gram",                    msp: "\u20B95,875/Qtl" },
  { value: "jute",      label: "Jute",                    msp: "\u20B95,925/Qtl" },
  { value: "sugarcane", label: "Sugarcane",               msp: "\u20B9365/Qtl" },
];


// -- Category grouping helper for MSP table --

const MSP_CATEGORY_ORDER = ["KHARIF CROPS", "RABI CROPS", "COMMERCIAL CROPS"];

export function groupMspCropsByCategory(filteredCrops) {
  return MSP_CATEGORY_ORDER
    .map((category) => ({
      category,
      rows: filteredCrops.filter((crop) => crop.category === category),
    }))
    .filter((group) => group.rows.length > 0);
}


// -- Category filter helpers for demand page --

export const DEMAND_CATEGORIES = [
  { key: "all",        label: "All High Demand" },
  { key: "foodgrains", label: "Foodgrains / Cereals" },
  { key: "pulses",     label: "Urgent Pulses / Buffer Deficit" },
  { key: "oilseeds",   label: "Oilseeds Mission" },
  { key: "commercial", label: "Commercial / Industrial" },
];

export function matchesDemandCategory(crop, categoryKey) {
  if (categoryKey === "all") return true;

  const cat = crop.category;
  switch (categoryKey) {
    case "foodgrains":  return cat.includes("Foodgrain");
    case "pulses":      return cat.includes("Pulse") || cat.includes("Protein");
    case "oilseeds":    return cat.includes("Oil") || cat.includes("Edible");
    case "commercial":  return cat.includes("Commercial") || cat.includes("Biofuel");
    default:            return true;
  }
}
