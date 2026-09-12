import apiClient from "./client";

export const getMyTickets = () => apiClient.get("/tickets/mine");

export const getTicket = (ticketId) =>
  apiClient.get(`/tickets/${encodeURIComponent(ticketId)}`);
