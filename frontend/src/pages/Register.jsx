import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password
      });

      if (!result.success) {
        throw new Error(
          result.error || "Unable to create account."
        );
      }

      if (result.token) {
        localStorage.setItem(
          "tradingWaveToken",
          result.token
        );
      }

      if (result.user) {
        localStorage.setItem(
          "tradingWaveUser",
          JSON.stringify(result.user)
        );
      }

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <Link to="/" className="auth-brand">
        <div className="brand-logo">TW</div>
        <span>Trading Wave</span>
      </Link>

      <div className="auth-card">

        <div className="auth-heading">
          <span className="section-label">
            TRADING WAVE
          </span>

          <h1>Create account</h1>

          <p>
            Create your account to enter tournaments,
            play games and compete for prizes.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <label>
              First name
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={updateField}
                placeholder="First name"
                autoComplete="given-name"
                disabled={loading}
              />
            </label>

            <label>
              Last name
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={updateField}
                placeholder="Last name"
                autoComplete="family-name"
                disabled={loading}
              />
            </label>

          </div>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={loading}
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={updateField}
              placeholder="Repeat your password"
              autoComplete="new-password"
              disabled={loading}
            />
          </label>

          <p className="terms-text">
            By creating an account, you agree to the
            Trading Wave platform rules and terms.
          </p>

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

      <Link className="back-home" to="/">
        ← Back to Trading Wave
      </Link>

    </div>
  );
}

export default Register;
