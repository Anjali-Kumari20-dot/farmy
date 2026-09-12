import { useLocation, useNavigate } from "react-router-dom";
import ProcurementForm from "../components/procurement/ProcurementForm";
import { CloseIcon } from "../components/common/Icons";
import "./FormPage.css";

// Full-page wrapper for the produce intake form
function FormPage({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/dashboard";
  const handleClose = () => (onClose ? onClose() : navigate(returnTo));

  return (
    <div className="form-page-overlay">
      <div className="form-page-inner">
        <button type="button" className="form-page-close" onClick={handleClose} aria-label="Close form">
          <CloseIcon size={20} />
        </button>
        <ProcurementForm onTicketCreated={() => navigate(returnTo)} />
      </div>
    </div>
  );
}

export default FormPage;
