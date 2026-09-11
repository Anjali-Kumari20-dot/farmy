import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAvailableSlots, bookSlot, getMySlots, cancelSlot } from "../api/slots";
import BrandLogo from "../components/common/BrandLogo";
import {
  CalendarIcon,
  FileTextIcon,
  ShieldCheckIcon,
  LogOutIcon,
  WheatIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "../components/common/Icons";
import "./Dashboard.css";

const CROPS = ["Wheat", "Paddy / Rice", "Mustard", "Maize", "Cotton", "Soybean", "Pulses"];

function DashboardPage() {
  const navigate = useNavigate();
  const { farmer, logout } = useAuth();

  // Booking Form State
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [quantity, setQuantity] = useState("25");

  // Slots List & Loading State
  const [myBookings, setMyBookings] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Fetch slot availability for selected date
  const loadAvailableSlots = useCallback(async (date) => {
    setLoadingSlots(true);
    try {
      const res = await getAvailableSlots(date);
      if (res.success && res.slots) {
        setAvailableSlots(res.slots);
        setSelectedSlot("");
      }
    } catch (err) {
      console.error("Error loading availability:", err);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Fetch farmer's own booking history
  const loadMyBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await getMySlots();
      if (res.success && res.slots) {
        setMyBookings(res.slots);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    loadAvailableSlots(selectedDate);
  }, [selectedDate, loadAvailableSlots]);

  useEffect(() => {
    loadMyBookings();
  }, [loadMyBookings]);

  // Handle Book Slot
  const handleBookSlot = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (!selectedSlot) {
      setFeedback({ type: "error", message: "Please select an available time slot." });
      return;
    }

    setIsBooking(true);
    try {
      await bookSlot({
        date: selectedDate,
        timeSlot: selectedSlot,
        cropType: selectedCrop,
        quantityQuintals: quantity,
      });

      setFeedback({
        type: "success",
        message: `Slot booked successfully for ${selectedDate} (${selectedSlot}).`,
      });
      setSelectedSlot("");
      loadAvailableSlots(selectedDate);
      loadMyBookings();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsBooking(false);
    }
  };

  // Handle Cancel Slot
  const handleCancelBooking = async (slotId) => {
    if (!window.confirm("Are you sure you want to cancel this procurement slot?")) {
      return;
    }

    try {
      await cancelSlot(slotId);
      setFeedback({ type: "success", message: "Procurement slot has been cancelled." });
      loadMyBookings();
      loadAvailableSlots(selectedDate);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeBookingsCount = myBookings.filter((b) => b.status === "booked").length;

  return (
    <div className="dashboard-container">
      {/* TOP NAVIGATION BAR */}
      <header className="dashboard-navbar">
        <div className="navbar-brand">
          <BrandLogo />
          <span className="navbar-tag">PROCUREMENT PORTAL</span>
        </div>

        <div className="navbar-user-actions">
          <div className="farmer-badge">
            <span className="farmer-avatar">
              <UserIcon size={16} />
            </span>
            <div className="farmer-meta">
              <span className="farmer-name">{farmer?.fullname || "Farmer"}</span>
              <span className="farmer-phone">+91 {farmer?.mobileNumber}</span>
            </div>
          </div>

          <button type="button" className="logout-button" onClick={handleLogout}>
            <span>Logout</span>
            <LogOutIcon size={14} />
          </button>
        </div>
      </header>

      {/* DASHBOARD HERO / STATS */}
      <main className="dashboard-content">
        <section className="stats-grid">
          <div className="stat-card accent">
            <span className="stat-icon">
              <CalendarIcon size={22} />
            </span>
            <div className="stat-info">
              <h3>Active Bookings</h3>
              <p className="stat-number">{activeBookingsCount}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <FileTextIcon size={22} />
            </span>
            <div className="stat-info">
              <h3>Total History</h3>
              <p className="stat-number">{myBookings.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <ShieldCheckIcon size={22} />
            </span>
            <div className="stat-info">
              <h3>Farmer Status</h3>
              <p className="stat-status">KYC Verified</p>
            </div>
          </div>
        </section>

        {/* FEEDBACK BANNER */}
        {feedback.message && (
          <div
            className={`dashboard-alert ${
              feedback.type === "error" ? "alert-error" : "alert-success"
            }`}
            role="alert"
          >
            {feedback.type === "error" ? (
              <AlertCircleIcon size={18} />
            ) : (
              <CheckCircleIcon size={18} />
            )}
            <p>{feedback.message}</p>
          </div>
        )}

        {/* TWO COLUMN WORKSPACE */}
        <div className="dashboard-layout-grid">
          {/* COLUMN 1: BOOK NEW SLOT */}
          <section className="dashboard-card booking-panel">
            <div className="panel-header">
              <h2>Schedule Procurement Slot</h2>
              <p>Select your preferred date and available center time slot.</p>
            </div>

            <form onSubmit={handleBookSlot}>
              {/* Date Picker */}
              <div className="dash-input-group">
                <label htmlFor="slot-date">PROCUREMENT DATE*</label>
                <input
                  id="slot-date"
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="dash-control"
                />
              </div>

              {/* Crop & Quantity */}
              <div className="dash-two-col">
                <div className="dash-input-group">
                  <label htmlFor="crop-type">CROP TYPE*</label>
                  <select
                    id="crop-type"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="dash-control"
                  >
                    {CROPS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dash-input-group">
                  <label htmlFor="crop-qty">ESTIMATED QTY (QUINTALS)*</label>
                  <input
                    id="crop-qty"
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="dash-control"
                  />
                </div>
              </div>

              {/* Time Slots Selection */}
              <div className="dash-input-group">
                <label>AVAILABLE TIME SLOTS ({selectedDate})*</label>
                {loadingSlots ? (
                  <p className="loading-note">Checking center capacity...</p>
                ) : (
                  <div className="slots-picker-grid">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.timeSlot;
                      const isFull = !slot.available;

                      return (
                        <button
                          key={slot.timeSlot}
                          type="button"
                          disabled={isFull}
                          className={`slot-chip ${isSelected ? "selected" : ""} ${
                            isFull ? "full" : ""
                          }`}
                          onClick={() => setSelectedSlot(slot.timeSlot)}
                        >
                          <span className="slot-time">{slot.timeSlot}</span>
                          <span className="slot-badge">
                            {isFull ? "FULL" : `${slot.remainingCapacity} Left`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="confirm-booking-btn"
                disabled={isBooking || !selectedSlot}
              >
                {isBooking ? "BOOKING SLOT..." : "CONFIRM SLOT BOOKING"}
              </button>
            </form>
          </section>

          {/* COLUMN 2: MY BOOKINGS LIST */}
          <section className="dashboard-card bookings-list-panel">
            <div className="panel-header">
              <h2>My Scheduled Slots</h2>
              <p>Track your arrivals and procurement center status.</p>
            </div>

            {loadingBookings ? (
              <p className="loading-note">Loading your bookings...</p>
            ) : myBookings.length === 0 ? (
              <div className="empty-bookings">
                <span className="empty-icon">
                  <WheatIcon size={40} />
                </span>
                <h4>No slots booked yet</h4>
                <p>Pick a date on the left to schedule your crop procurement delivery.</p>
              </div>
            ) : (
              <div className="bookings-stack">
                {myBookings.map((b) => (
                  <div key={b._id} className={`booking-item-card status-${b.status}`}>
                    <div className="booking-top-line">
                      <span className={`status-pill pill-${b.status}`}>
                        {b.status.toUpperCase()}
                      </span>
                      <span className="booking-date">{b.date}</span>
                    </div>

                    <div className="booking-details">
                      <div className="detail-item">
                        <span className="detail-label">TIME SLOT</span>
                        <span className="detail-value">{b.timeSlot}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">CROP / QUANTITY</span>
                        <span className="detail-value">
                          {b.cropType || "Wheat"} ({b.quantityQuintals || 20} Quintals)
                        </span>
                      </div>
                    </div>

                    {b.status === "booked" && (
                      <div className="booking-actions">
                        <button
                          type="button"
                          className="cancel-slot-button"
                          onClick={() => handleCancelBooking(b._id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
