import { useState } from "react";
import "./form.css";

function Form({ onClose }) {
  const [formData, setFormData] = useState(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("farmy-profile") || "{}");

      return {
        farmerName: profile.name || "Farmer",
        mobile: profile.phone || "",
        village: profile.village || "VILLAGE ABC",
        surveyNumber: "",
        crop: "",
        cropWeight: "2.5",
        bankAccount: "",
        ifsc: "",
      };
    } catch {
      return {
        farmerName: "Farmer",
        mobile: "",
        village: "VILLAGE ABC",
        surveyNumber: "",
        crop: "",
        cropWeight: "2.5",
        bankAccount: "",
        ifsc: "",
      };
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Procurement form submitted:", formData);

    alert("Form submitted successfully!");

    onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div
        className="form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="form-header">
          <div>
            <span className="form-badge">
              PROCUREMENT CENTRE & SLOT BOOKING
            </span>

            <h1>BOOK PROCUREMENT SLOT</h1>

            <p>
              Enter your crop and procurement details to reserve a
              real-time weighbridge slot at your designated centre.
            </p>
          </div>

          <button
            className="form-close"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Farmer Name */}
          <div className="form-field">
            <label>FARMER FULL NAME</label>

            <input
              type="text"
              name="farmerName"
              value={formData.farmerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile */}
          <div className="form-field">
            <label>REGISTERED MOBILE NUMBER</label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Village */}
          <div className="form-field">
            <label>DESIGNATED PROCUREMENT VILLAGE</label>

            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              required
            />
          </div>

          {/* Survey Number */}
          <div className="form-field">
            <label>LAND SURVEY NUMBER *</label>

            <input
              type="text"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={handleChange}
              placeholder="e.g. Survey #402/1A or Plot 12B"
              required
            />
          </div>

          {/* Crop */}
          <div className="form-field">
            <label>AGRICULTURAL PRODUCE / CROP *</label>

            <select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              required
            >
              <option value="">Select Agricultural Produce</option>

              <option value="paddy">
                🌾 Paddy Common - Govt. MSP ₹2,441/Qtl
              </option>

              <option value="paddy-grade-a">
                🌾 Paddy(F)/Grade A - Govt. MSP ₹2,441/Qtl
              </option>

              <option value="cotton-medium">
                ☁️ Medium Staple Cotton - Govt. MSP ₹8,267/Qtl
              </option>

              <option value="cotton-long">
                ☁️ Long Staple Cotton - Govt. MSP ₹8,267/Qtl
              </option>

              <option value="maize">
                🌽 Maize - Govt. MSP ₹2,410/Qtl
              </option>

              <option value="groundnut">
                🥜 Groundnut - Govt. MSP ₹7,517/Qtl
              </option>

              <option value="ragi">
                🌾 Ragi - Govt. MSP ₹5,205/Qtl
              </option>

              <option value="wheat">
                🌾 Wheat - Govt. MSP ₹2,585/Qtl
              </option>

              <option value="mustard">
                🌻 Rapeseed / Mustard - Govt. MSP ₹6,200/Qtl
              </option>

              <option value="soybean">
                🌱 Soyabean Yellow - Govt. MSP ₹2,275/Qtl
              </option>

              <option value="tur">
                🫘 Tur (Arhar) - Govt. MSP ₹8,450/Qtl
              </option>

              <option value="moong">
                🫘 Moong - Govt. MSP ₹8,780/Qtl
              </option>

              <option value="urad">
                🫘 Urad - Govt. MSP ₹8,200/Qtl
              </option>

              <option value="gram">
                🫘 Gram - Govt. MSP ₹5,875/Qtl
              </option>

              <option value="jute">
                🌿 Jute - Govt. MSP ₹5,925/Qtl
              </option>

              <option value="sugarcane">
                🌾 Sugarcane - Govt. MSP ₹365/Qtl
              </option>
            </select>
          </div>

          {/* Weight */}
          <div className="form-field">
            <label>EXPECTED CROP WEIGHT *</label>

            <div className="weight-wrapper">
              <input
                type="number"
                name="cropWeight"
                min="0.1"
                step="0.1"
                value={formData.cropWeight}
                onChange={handleChange}
                required
              />

              <span>QUINTALS</span>
            </div>
          </div>

          {/* Procurement Centre */}
          <div className="form-field">
            <label>PROCUREMENT CENTRE *</label>

            <select required name="procurementCentre">
              <option value="">
                Select Procurement Centre
              </option>

              <option value="centre-1">
                Procurement Centre - Village ABC
              </option>

              <option value="centre-2">
                Primary Agricultural Cooperative Centre
              </option>

              <option value="centre-3">
                Government Procurement Centre
              </option>
            </select>
          </div>

          {/* Date */}
          <div className="form-field">
            <label>PREFERRED INTAKE DATE *</label>

            <input
              type="date"
              required
              name="preferredDate"
            />
          </div>

          {/* Slot */}
          <div className="form-field">
            <label>PREFERRED WEIGHBRIDGE SLOT *</label>

            <select required name="preferredSlot">
              <option value="">
                Select Available Slot
              </option>

              <option value="09:00">
                09:00 AM – 10:00 AM
              </option>

              <option value="10:00">
                10:00 AM – 11:00 AM
              </option>

              <option value="11:00">
                11:00 AM – 12:00 PM
              </option>

              <option value="14:00">
                02:00 PM – 03:00 PM
              </option>

              <option value="15:00">
                03:00 PM – 04:00 PM
              </option>
            </select>
          </div>

          {/* Bank */}
          <div className="form-field">
            <label>BANK ACCOUNT NUMBER *</label>

            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              placeholder="Enter bank account number"
              required
            />
          </div>

          {/* IFSC */}
          <div className="form-field">
            <label>BANK IFSC CODE *</label>

            <input
              type="text"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              placeholder="ENTER IFSC CODE"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-form-button"
          >
            SUBMIT FORM
            <span>→</span>
          </button>

        </form>
      </div>
    </div>
  );
}

export default Form;