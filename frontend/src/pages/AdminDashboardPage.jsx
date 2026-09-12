import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminTicket, getAdminTickets, getCurrentAdmin } from "../api/admin";
import AdminTicketDetail from "../components/admin/AdminTicketDetail";
import AdminTicketList from "../components/admin/AdminTicketList";
import ProcurementSettingsPanel from "../components/admin/ProcurementSettingsPanel";
import "./AdminPages.css";

const TICKET_REVIEW_ROLES = new Set(["super_admin", "procurement_officer"]);
const IDENTITY_CORRECTION_ROLES = new Set([
  "super_admin",
  "procurement_officer",
]);
const NOTIFICATION_ROLES = new Set([
  "super_admin",
  "procurement_officer",
  "support_officer",
]);

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("farmy_admin_token");
    localStorage.removeItem("farmy_admin");
    navigate("/admin/login");
  }, [navigate]);

  const showError = useCallback((message) => setError(message), []);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminTickets();
      setTickets(response.tickets || []);
    } catch (requestError) {
      showError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    async function loadConsole() {
      try {
        const response = await getCurrentAdmin();
        setAdmin(response.admin);
        localStorage.setItem("farmy_admin", JSON.stringify(response.admin));
        await loadTickets();
      } catch {
        logout();
      }
    }
    loadConsole();
  }, [loadTickets, logout]);

  const selectTicket = async (ticketId) => {
    setError("");
    try {
      setSelected(await getAdminTicket(ticketId));
    } catch (requestError) {
      showError(requestError.message);
    }
  };

  const handleTicketUpdated = async (updatedTicket) => {
    setSelected(
      (current) =>
        current && {
          ...current,
          ticket: { ...updatedTicket, farmerId: current.ticket.farmerId },
        },
    );
    await loadTickets();
  };

  const handleIdentityUpdated = (farmer) => {
    setSelected(
      (current) =>
        current && {
          ...current,
          ticket: { ...current.ticket, farmerId: farmer },
        },
    );
  };

  const role = admin?.role;
  const canReview = TICKET_REVIEW_ROLES.has(role);
  const canCorrectIdentity = IDENTITY_CORRECTION_ROLES.has(role);
  const canNotify = NOTIFICATION_ROLES.has(role);

  return (
    <main className="admin-console">
      <header className="admin-console-header">
        <div>
          <p className="admin-eyebrow">FARMY · ADMINISTRATOR CONSOLE</p>
          <h1>Procurement Administration</h1>
          {admin && (
            <p className="admin-copy">
              {admin.fullname} · {admin.role.replaceAll("_", " ")}
            </p>
          )}
        </div>
        <button type="button" onClick={logout}>
          Log out
        </button>
      </header>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-grid">
        <AdminTicketList
          tickets={tickets}
          loading={loading}
          selectedTicketId={selected?.ticket.ticketId}
          onSelect={selectTicket}
        />
        {!selected ? (
          <section className="admin-ticket-detail admin-empty-detail">
            <h2>Choose a procurement ticket</h2>
            <p>
              Open a ticket to review the intake form, make a decision, correct
              permitted identity data, or notify its farmer.
            </p>
          </section>
        ) : (
          <AdminTicketDetail
            key={selected.ticket.ticketId}
            selected={selected}
            canReview={canReview}
            canCorrectIdentity={canCorrectIdentity}
            canNotify={canNotify}
            onTicketUpdated={handleTicketUpdated}
            onIdentityUpdated={handleIdentityUpdated}
            onError={showError}
          />
        )}
      </div>

      {role === "super_admin" && (
        <ProcurementSettingsPanel onError={showError} />
      )}
    </main>
  );
}

export default AdminDashboardPage;
