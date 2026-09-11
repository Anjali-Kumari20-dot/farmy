import React, { useState } from "react";
import "./form.css";

function App() {
  const [formData, setFormData] = useState({
    farmerName: "",
    mobile: "",
    village: "",
    surveyNumber: "",
    crop: "",
    weight: "",
    accountNumber: "",
    ifsc: "",
    confirmation: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.confirmation) {
      alert("Please confirm that the information provided is correct.");
      return;
    }

    console.log("Submitted Data:", formData);

    alert("Crop details submitted successfully!");
  };

  return (
    <div className="page">

      <form className="crop-form" onSubmit={handleSubmit}>

        {/* Form Heading */}
        <div className="form-label">
          FORM FILLING & PRODUCE INTAKE
        </div>

        <h1>FORM FILLING</h1>


        {/* Farmer Name */}
        <div className="form-group">
          <label>
            Farmer Full Name (Default)
          </label>

          <input
            type="text"
            name="farmerName"
            value={formData.farmerName}
            readOnly
          />
        </div>


        {/* Mobile Number */}
        <div className="form-group">
          <label>
            Registered Mobile Number (Default)
          </label>

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            readOnly
          />
        </div>


        {/* Village */}
        <div className="form-group">
          <label>
            Designated Procurement Village (Default)
          </label>

          <input
            type="text"
            name="village"
            value={formData.village}
            readOnly
          />
        </div>


        {/* Survey Number */}
        <div className="form-group">
          <label>
            Land Survey Number <span>*</span>
          </label>

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
        <div className="form-group">
          <label>
            Agricultural Produce / Crop <span>*</span>
          </label>

          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Agricultural Produce ▼
            </option>

            <option value="paddy">Paddy Common - Govt.MSP ₹2,441/Qtl</option>
            <option value="paddy">Paddy (F)/Grade A - Govt.MSP ₹2,441/Qtl</option>
            <option value="cotton">Medium Staple Cotton - Govt.MSP ₹8,267/Qtl</option>
            <option value="">Long Staple Cotton - Govt.MSP ₹8,267/Qtl</option>
            <option value="wheat">Wheat - Govt.MSP ₹2,585/Qtl</option>
            <option value="maize">Maize - Govt.MSP ₹2,410/Qtl</option>
            <option value="groundnut">Groundnut - Govt.MSP ₹7,517/Qtl</option>
            <option value="mustard">Rapeseed/Mustard - Govt.MSP ₹6,200/Qtl</option>
            <option value="soybean">Soybean - Govt.MSP ₹2,275/Qtl</option>
            <option value="Ragi">Ragi - Govt.MSP ₹5,205/Qtl</option>
            <option value="dal">Tur(Arhar) - Govt.MSP ₹8,450/Qtl</option>
            <option value="dal">Moong - Govt.MSP ₹8,780/Qtl</option>
            <option value="dal">Urad - Govt.MSP ₹8,200/Qtl</option>
            <option value="dal">Gram - Govt.MSP ₹5,875/Qtl</option>
            <option value="jute">Jute - Govt.MSP ₹5,925/Qtl</option>
            <option value="Sugarcane">Sugarcane - Govt.MSP ₹365/Qtl</option>
          </select>
        </div>


        {/* Crop Weight */}
        <div className="form-group">
          <label>
            Expected Crop Weight <span>*</span>
          </label>

          <div className="weight-container">

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter expected weight in Quintals"
              min="1"
              required
            />

            <span>Quintals</span>

          </div>
        </div>


        {/* Bank Account */}
        <div className="form-group">
          <label>
            Bank Account Number <span>*</span>
          </label>

          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter bank account number"
            inputMode="numeric"
            required
          />
        </div>


        {/* IFSC */}
        <div className="form-group">
          <label>
            Bank IFSC Code <span>*</span>
          </label>

          <input
            type="text"
            name="ifsc"
            value={formData.ifsc}
            onChange={handleChange}
            placeholder="ENTER IFSC CODE"
            maxLength="11"
            required
            style={{ textTransform: "uppercase" }}
          />
        </div>


        {/* Confirmation */}
        <div className="confirmation">

          <input
            type="checkbox"
            name="confirmation"
            checked={formData.confirmation}
            onChange={handleChange}
            id="confirmation"
          />

          <label htmlFor="confirmation">
            I confirm that the information provided is correct.
          </label>

        </div>


        {/* Submit */}
        <button
          type="submit"
          className="submit-button"
        >
          SUBMIT 
          <span>→</span>
        </button>

      </form>

    </div>
  );
}

export default App;