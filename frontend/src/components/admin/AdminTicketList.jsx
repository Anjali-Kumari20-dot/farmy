function AdminTicketList({ tickets, loading, selectedTicketId, onSelect }) {
  return (
    <section className="admin-ticket-list">
      <h2>Procurement tickets</h2>
      {loading && <p>Loading tickets…</p>}
      {!loading && tickets.length === 0 && <p>No tickets submitted.</p>}
      {tickets.map((ticket) => (
        <button
          type="button"
          key={ticket.ticketId}
          className={selectedTicketId === ticket.ticketId ? "selected" : ""}
          onClick={() => onSelect(ticket.ticketId)}
          aria-pressed={selectedTicketId === ticket.ticketId}
        >
          <strong>{ticket.ticketId}</strong>
          <span>{ticket.farmerId?.fullname || "Farmer"} · {ticket.crop}</span>
          <em>{ticket.status.replaceAll("_", " ")}</em>
        </button>
      ))}
    </section>
  );
}

export default AdminTicketList;
