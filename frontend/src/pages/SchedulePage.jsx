import { CloseIcon } from "../components/common/Icons";
import MspTable from "../components/schedule/MspTable";
import "./SchedulePage.css";

// Modal overlay that wraps the MSP price matrix table
function SchedulePage({ onClose }) {
  const navigate = useNavigate();
  const handleClose = () => (onClose ? onClose() : navigate("/dashboard"));

  return (
    <div
      className="schedule-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-title"
    >
      <section className="schedule-modal">
        <button
          className="schedule-close"
          onClick={handleClose}
          aria-label="Close schedule"
        >
          <CloseIcon size={20} />
        </button>

        <MspTable />
      </section>
    </div>
  );
}

export default SchedulePage;
import { useNavigate } from "react-router-dom";
