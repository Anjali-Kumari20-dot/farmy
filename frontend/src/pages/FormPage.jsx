import ProcurementForm from "../components/procurement/ProcurementForm";
import "./FormPage.css";

// Full-page wrapper for the produce intake form
function FormPage({ onClose }) {
  return (
    <div className="form-page-overlay">
      <div className="form-page-inner">
        <ProcurementForm onClose={onClose} />
      </div>
    </div>
  );
}

export default FormPage;
