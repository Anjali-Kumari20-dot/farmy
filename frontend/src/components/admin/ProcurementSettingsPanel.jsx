import { useEffect, useState } from "react";
import { getAdminProcurementSettings, updateAdminProcurementSettings } from "../../api/admin";

function ProcurementSettingsPanel({ onError }) {
  const [timeSlots, setTimeSlots] = useState("");
  const [capacity, setCapacity] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await getAdminProcurementSettings();
        setTimeSlots(response.settings.timeSlots.join("\n"));
        setCapacity(response.settings.capacityPerSlot);
      } catch (requestError) {
        onError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [onError]);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const normalizedSlots = timeSlots.split("\n").map((slot) => slot.trim()).filter(Boolean);
      await updateAdminProcurementSettings(normalizedSlots, Number(capacity));
      setMessage("Future slot availability updated.");
    } catch (requestError) {
      onError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading procurement settings…</p>;

  return (
    <section className="admin-settings-panel">
      <h2>Procurement schedule settings</h2>
      <p>These settings control future availability. Existing bookings remain unchanged.</p>
      <form className="admin-decision-form" onSubmit={saveSettings}>
        <label>One time slot per line<textarea value={timeSlots} onChange={(event) => setTimeSlots(event.target.value)} required /></label>
        <label>Capacity per slot<input type="number" min="1" max="100" value={capacity} onChange={(event) => setCapacity(event.target.value)} required /></label>
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save schedule settings"}</button>
      </form>
      {message && <p className="admin-success">{message}</p>}
    </section>
  );
}

export default ProcurementSettingsPanel;
