import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
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

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(form);

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <div className="brand-logo">TW</div>
        <span>Trading Wave</span>
      </div>

      <div className="auth-card">

        <div className="auth-heading">
          <span className="section-label">
            WELCOME BACK
          </span>

          <h1>Sign in</h1>

          <p>
            Sign in to continue to your Trading Wave account.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register">
            Create account
          </Link>
        </div>

      </div>

      <Link className="back-home" to="/">
        ← Back to Trading Wave
      </Link>

    </div>
  );
}

export default Login;
