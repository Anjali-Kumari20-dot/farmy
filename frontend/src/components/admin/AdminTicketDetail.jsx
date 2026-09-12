import { useState } from "react";
import {
  sendFarmerNotification,
  updateAdminTicketStatus,
  updateFarmerIdentityByAdmin,
} from "../../api/admin";

const DECISION_OPTIONS = [
  ["submitted", "Pending review"],
  ["under_review", "Under review"],
  ["accepted", "Accepted"],
  ["rejected", "Rejected"],
];

const formatStatus = (status) => status.replaceAll("_", " ");

function AdminTicketDetail({
  selected,
  canReview,
  canCorrectIdentity,
  canNotify,
  onTicketUpdated,
  onIdentityUpdated,
  onError,
}) {
  const { ticket, submission } = selected;
  const farmer = ticket.farmerId;
  const [status, setStatus] = useState(ticket.status);
  const [decisionNote, setDecisionNote] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(farmer?.dateOfBirth || "");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [savingDecision, setSavingDecision] = useState(false);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [message, setMessage] = useState("");

  const handleDecision = async (event) => {
    event.preventDefault();
    setMessage("");
    setSavingDecision(true);
    try {
      const response = await updateAdminTicketStatus(ticket.ticketId, status, decisionNote);
      onTicketUpdated(response.ticket);
      setDecisionNote("");
      setMessage("Decision recorded and the farmer was notified in the portal.");
    } catch (requestError) {
      onError(requestError.message);
    } finally {
      setSavingDecision(false);
    }
  };

  const handleIdentityCorrection = async (event) => {
    event.preventDefault();
    if (!dateOfBirth && !aadhaarNumber) {
      onError("Enter a date of birth or Aadhaar number before saving an identity correction.");
      return;
    }

    setMessage("");
    setSavingIdentity(true);
    try {
      const response = await updateFarmerIdentityByAdmin(farmer._id, dateOfBirth || undefined, aadhaarNumber || undefined);
      onIdentityUpdated(response.farmer);
      setAadhaarNumber("");
      setMessage("Identity correction saved. The farmer received an in-app notification.");
    } catch (requestError) {
      onError(requestError.message);
    } finally {
      setSavingIdentity(false);
    }
  };

  const handleNotification = async (event) => {
    event.preventDefault();
    setMessage("");
    setSendingNotification(true);
    try {
      await sendFarmerNotification(farmer._id, {
        title: notificationTitle,
        message: notificationMessage,
        ticketId: ticket.ticketId,
        type: "ticket",
      });
      setNotificationTitle("");
      setNotificationMessage("");
      setMessage("In-app notification sent to the farmer.");
    } catch (requestError) {
      onError(requestError.message);
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <section className="admin-ticket-detail">
      <div className="admin-detail-heading">
        <div>
          <p className="admin-eyebrow">PROCUREMENT TICKET</p>
          <h2>{ticket.ticketId}</h2>
        </div>
        <span className="admin-status-pill">{formatStatus(ticket.status)}</span>
      </div>

      <div className="admin-detail-grid">
        <p><span>Farmer</span>{farmer?.fullname || "—"}</p>
        <p><span>Mobile</span>{farmer?.mobileNumber || "—"}</p>
        <p><span>Identity</span>Aadhaar ending {farmer?.aadhaarLast4 || "—"}</p>
        <p><span>Identity status</span>{formatStatus(farmer?.identityVerificationStatus || "self_declared")}</p>
        <p><span>Date of birth</span>{farmer?.dateOfBirth || "—"}</p>
        <p><span>Land survey no.</span>{submission?.surveyNumber || "—"}</p>
        <p><span>Crop / expected quantity</span>{ticket.crop} · {ticket.expectedWeightQuintals} Qtl</p>
        <p><span>Intake-form status</span>{formatStatus(submission?.status || "submitted")}</p>
        <p><span>IFSC</span>{submission?.ifsc || "—"}</p>
      </div>

      {message && <p className="admin-success" role="status">{message}</p>}

      {canReview && (
        <form className="admin-decision-form" onSubmit={handleDecision}>
          <h3>Review ticket</h3>
          <label>
            Decision
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {DECISION_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Decision note
            <textarea value={decisionNote} onChange={(event) => setDecisionNote(event.target.value)} required maxLength="500" />
          </label>
          <button type="submit" disabled={savingDecision}>{savingDecision ? "Saving…" : "Save decision & notify farmer"}</button>
        </form>
      )}

      {canCorrectIdentity && farmer && (
        <form className="admin-decision-form admin-secondary-form" onSubmit={handleIdentityCorrection}>
          <h3>Correct identity data</h3>
          <p>Enter only the field being corrected. Full Aadhaar is encrypted and never displayed after submission.</p>
          <label>
            Date of birth
            <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
          </label>
          <label>
            Replacement Aadhaar number
            <input inputMode="numeric" maxLength="12" value={aadhaarNumber} onChange={(event) => setAadhaarNumber(event.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="12 digits" />
          </label>
          <button type="submit" disabled={savingIdentity}>{savingIdentity ? "Saving…" : "Save identity correction"}</button>
        </form>
      )}

      {canNotify && farmer && (
        <form className="admin-decision-form admin-secondary-form" onSubmit={handleNotification}>
          <h3>Send farmer notification</h3>
          <label>
            Title
            <input value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} maxLength="120" required />
          </label>
          <label>
            Message
            <textarea value={notificationMessage} onChange={(event) => setNotificationMessage(event.target.value)} maxLength="1000" required />
          </label>
          <button type="submit" disabled={sendingNotification}>{sendingNotification ? "Sending…" : "Send in-app notification"}</button>
        </form>
      )}
    </section>
  );
}

export default AdminTicketDetail;
