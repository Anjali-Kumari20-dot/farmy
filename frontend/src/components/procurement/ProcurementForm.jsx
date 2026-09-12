import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { CROP_OPTIONS } from "../../data/crops";
import { ArrowRightIcon } from "../common/Icons";
import { submitProcurement } from "../../api/procurements";
import { updateFarmerIdentity } from "../../api/auth";
import "./ProcurementForm.css";

// Produce intake form — pre-fills farmer identity from auth context
function ProcurementForm() {
  const { farmer, updateFarmer } = useAuth();

  const [formData, setFormData] = useState({
    surveyNumber: "",
    crop: "",
    weight: "",
    accountNumber: "",
    ifsc: "",
    confirmation: false,
  });
  const [feedback, setFeedback] = useState({ type: "", message: "", ticketId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identityData, setIdentityData] = useState({ dateOfBirth: "", aadhaarNumber: "" });
  const needsIdentity = !farmer?.dateOfBirth || !farmer?.aadhaarLast4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "", ticketId: "" });

    if (!formData.confirmation) {
      setFeedback({ type: "error", message: "Please confirm that the information provided is correct." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (needsIdentity) {
        const identityResponse = await updateFarmerIdentity(identityData);
        updateFarmer(identityResponse.farmer);
      }
      const response = await submitProcurement({
        surveyNumber: formData.surveyNumber,
        crop: formData.crop,
        expectedWeightQuintals: formData.weight,
        bankAccountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
      });
      setFeedback({ type: "success", message: response.message, ticketId: response.ticket.ticketId });
      setFormData({ surveyNumber: "", crop: "", weight: "", accountNumber: "", ifsc: "", confirmation: false });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="procurement-form" onSubmit={handleSubmit}>
      {/* Form heading */}
      <div className="pf-label">FORM FILLING & PRODUCE INTAKE</div>
      <h1 className="pf-title">FORM FILLING</h1>

      {feedback.message && (
        <div className={`pf-feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
          <p>{feedback.message}</p>
          {feedback.ticketId && <strong>Your ticket ID: {feedback.ticketId}</strong>}
        </div>
      )}

      {/* Read-only fields from auth context */}
      <div className="pf-group">
        <label>Farmer Full Name (Default)</label>
        <input type="text" value={farmer?.fullname || ""} readOnly />
      </div>

      <div className="pf-group">
        <label>Registered Mobile Number (Default)</label>
        <input type="tel" value={farmer?.mobileNumber ? `+91 ${farmer.mobileNumber}` : ""} readOnly />
      </div>

      <div className="pf-group">
        <label>Identity Profile (Default)</label>
        <input type="text" value={farmer?.aadhaarLast4 ? `Aadhaar ending ${farmer.aadhaarLast4} · DOB ${farmer.dateOfBirth}` : "Identity profile incomplete"} readOnly />
      </div>

      {needsIdentity && (
        <>
          <div className="pf-group">
            <label>Date of Birth <span>*</span></label>
            <input type="date" value={identityData.dateOfBirth} onChange={(e) => setIdentityData((current) => ({ ...current, dateOfBirth: e.target.value }))} required />
          </div>
          <div className="pf-group">
            <label>Aadhaar Number <span>*</span></label>
            <input type="text" inputMode="numeric" maxLength="12" placeholder="Enter 12-digit Aadhaar number" value={identityData.aadhaarNumber} onChange={(e) => setIdentityData((current) => ({ ...current, aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12) }))} required />
          </div>
        </>
      )}

      <div className="pf-group">
        <label>Designated Procurement Village (Default)</label>
        <input type="text" value={farmer?.village || "Not provided"} readOnly />
      </div>

      {/* Editable fields */}
      <div className="pf-group">
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

      <div className="pf-group">
        <label>
          Agricultural Produce / Crop <span>*</span>
        </label>
        <select
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          required
        >
          <option value="">Select Agricultural Produce</option>
          {CROP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} -- Govt. MSP {opt.msp}
            </option>
          ))}
        </select>
      </div>

      <div className="pf-group">
        <label>
          Expected Crop Weight <span>*</span>
        </label>
        <div className="pf-weight-row">
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

      <div className="pf-group">
        <label>
          Bank Account Number <span>*</span>
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 18) }))}
          placeholder="Enter bank account number"
          inputMode="numeric"
          minLength="9"
          maxLength="18"
          required
        />
      </div>

      <div className="pf-group">
        <label>
          Bank IFSC Code <span>*</span>
        </label>
        <input
          type="text"
          name="ifsc"
          value={formData.ifsc}
          onChange={(e) => setFormData((prev) => ({ ...prev, ifsc: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11) }))}
          placeholder="ENTER IFSC CODE"
          maxLength="11"
          required
          style={{ textTransform: "uppercase" }}
        />
      </div>

      {/* Confirmation checkbox */}
      <div className="pf-confirmation">
        <input
          type="checkbox"
          name="confirmation"
          id="pf-confirm"
          checked={formData.confirmation}
          onChange={handleChange}
        />
        <label htmlFor="pf-confirm">
          I confirm that the information provided is correct.
        </label>
      </div>

      {/* Submit */}
      <button type="submit" className="pf-submit" disabled={isSubmitting}>
        {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
        <ArrowRightIcon size={18} />
      </button>
    </form>
  );
}

export default ProcurementForm;
