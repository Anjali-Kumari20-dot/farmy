import apiClient from "./client";

export const getAvailableSlots = (date) => {
  return apiClient.get(`/slots/available?date=${encodeURIComponent(date)}`);
};

export const bookSlot = ({ date, timeSlot, cropType, quantityQuintals }) => {
  return apiClient.post("/slots/book", {
    date,
    timeSlot,
    cropType,
    quantityQuintals: Number(quantityQuintals),
  });
};

export const getMySlots = () => {
  return apiClient.get("/slots/my-slots");
};

export const cancelSlot = (slotId) => {
  return apiClient.patch(`/slots/${encodeURIComponent(slotId)}/cancel`);
};
