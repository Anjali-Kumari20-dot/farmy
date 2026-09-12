import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, signupAdmin } from "../api/admin";
import "./AdminPages.css";

const INITIAL_SIGNUP = {
  fullname: "",
  officialEmail: "",
  employeeId: "",
  mobileNumber: "",
  department: "procurement",
  password: "",
};

function AdminLoginPage() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [loginData, setLoginData] = useState({ officialEmail: "", password: "" });
  const [signupData, setSignupData] = useState(INITIAL_SIGNUP);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authenticate = (response) => {
    localStorage.setItem("farmy_admin_token", response.token);
    localStorage.setItem("farmy_admin", JSON.stringify(response.admin));
    navigate("/admin/dashboard");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      authenticate(await loginAdmin(loginData.officialEmail, loginData.password));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      authenticate(await signupAdmin(signupData));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="admin-eyebrow">FARMY ADMINISTRATOR CONSOLE</p>
        <h1>{showSignup ? "Administrator Sign Up" : "Administrator Login"}</h1>
        <p className="admin-copy">{showSignup ? "Create your administrator account." : "Sign in to manage procurement operations."}</p>
        {error && <p className="admin-error" role="alert">{error}</p>}

        {!showSignup ? (
          <form onSubmit={handleLogin} className="admin-form">
            <label>
              Official email
              <input type="email" value={loginData.officialEmail} onChange={(event) => setLoginData({ ...loginData, officialEmail: event.target.value })} required />
            </label>
            <label>
              Password
              <input type="password" value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} required />
            </label>
            <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="admin-form">
            <label>
              Full name
              <input value={signupData.fullname} onChange={(event) => setSignupData({ ...signupData, fullname: event.target.value })} required />
            </label>
            <label>
              Official email
              <input type="email" value={signupData.officialEmail} onChange={(event) => setSignupData({ ...signupData, officialEmail: event.target.value })} required />
            </label>
            <label>
              Employee ID
              <input value={signupData.employeeId} onChange={(event) => setSignupData({ ...signupData, employeeId: event.target.value.toUpperCase() })} required />
            </label>
            <label>
              Mobile number
              <input inputMode="numeric" maxLength="10" value={signupData.mobileNumber} onChange={(event) => setSignupData({ ...signupData, mobileNumber: event.target.value.replace(/\D/g, "") })} required />
            </label>
            <label>
              Department
              <select value={signupData.department} onChange={(event) => setSignupData({ ...signupData, department: event.target.value })}>
                <option value="procurement">Procurement</option>
                <option value="operations">Operations</option>
                <option value="support">Support</option>
                <option value="administration">Administration</option>
              </select>
            </label>
            <label>
              Password (10+ characters)
              <input type="password" minLength="10" value={signupData.password} onChange={(event) => setSignupData({ ...signupData, password: event.target.value })} required />
            </label>
            <button type="submit" disabled={loading}>{loading ? "Creating…" : "Create administrator account"}</button>
          </form>
        )}

        <div className="admin-auth-links">
          <Link to="/login">Farmer login</Link>
          <button type="button" onClick={() => { setShowSignup((current) => !current); setError(""); }}>
            {showSignup ? "Administrator login" : "Create administrator account"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;
