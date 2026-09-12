/* eslint-disable react-hooks/set-state-in-effect -- async API loader updates after the request starts. */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets, getTicket } from "../api/tickets";
import BrandLogo from "../components/common/BrandLogo";
import { ArrowRightIcon, AlertCircleIcon } from "../components/common/Icons";
import "./TicketStatusPage.css";

function TicketStatusPage() {
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    try {
      const response = await getMyTickets();
      setTickets(response.tickets || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const handleLookup = async (event) => {
    event.preventDefault();
    setError("");
    setTicket(null);
    try {
      const response = await getTicket(ticketId.trim());
      setTicket(response.ticket);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="ticket-page">
      <header className="ticket-header"><BrandLogo /><button type="button" onClick={() => navigate("/dashboard")}>Back to dashboard</button></header>
      <section className="ticket-panel">
        <p className="ticket-eyebrow">PROCUREMENT TRACKING</p>
        <h1>Ticket Status</h1>
        <p>Use the one-time ticket ID generated after your intake form submission.</p>
        <form onSubmit={handleLookup} className="ticket-lookup">
          <input value={ticketId} onChange={(event) => setTicketId(event.target.value.toUpperCase())} placeholder="FMY-YYYY-..." required />
          <button type="submit">Check status <ArrowRightIcon size={16} /></button>
        </form>
        {error && <p className="ticket-error"><AlertCircleIcon size={16} /> {error}</p>}
        {ticket && (
          <article className="ticket-result">
            <div><span>Ticket ID</span><strong>{ticket.ticketId}</strong></div>
            <div><span>Current status</span><strong className="ticket-status">{ticket.status.replaceAll("_", " ")}</strong></div>
            <div><span>Crop / quantity</span><strong>{ticket.crop} · {ticket.expectedWeightQuintals} Quintals</strong></div>
            <ol>{ticket.statusHistory.map((event, index) => <li key={`${event.status}-${index}`}><strong>{event.status.replaceAll("_", " ")}</strong><span>{event.note}</span></li>)}</ol>
          </article>
        )}
        {!loading && !ticket && tickets.length > 0 && <div className="ticket-list"><h2>My tickets</h2>{tickets.map((item) => <button key={item.ticketId} type="button" onClick={() => setTicketId(item.ticketId)}>{item.ticketId} <span>{item.status.replaceAll("_", " ")}</span></button>)}</div>}
        {!loading && tickets.length === 0 && <p className="ticket-empty">No procurement tickets yet. Submit your intake form first.</p>}
      </section>
    </main>
  );
}

export default TicketStatusPage;
