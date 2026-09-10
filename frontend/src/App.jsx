import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Tournaments from "./pages/Tournaments";

import "./App.css";

function Home() {
  return (
    <div className="app">

      <header className="header">

        <Link to="/" className="brand">
          <div className="brand-logo">TW</div>
          <span>Trading Wave</span>
        </Link>

        <div className="header-actions">
          <Link to="/login" className="login-link">
            Sign in
          </Link>

          <Link
            to="/register"
            className="header-register"
          >
            Create account
          </Link>
        </div>

      </header>

      <main>

        <section className="hero-section">

          <div className="hero-badge">
            TRADING WAVE
          </div>

          <h1>
            Play.
            <br />
            <span>Compete.</span>
            <br />
            Win.
          </h1>

          <p>
            Enter tournaments, compete using DEMO credits,
            climb the leaderboard and compete for prizes.
          </p>

          <div className="hero-actions">

            <Link
              to="/register"
              className="primary-button"
            >
              Create account
            </Link>

            <Link
              to="/tournaments"
              className="secondary-hero-button"
            >
              View tournaments
            </Link>

          </div>

        </section>

        <section className="feature-section">

          <div>
            <span className="section-label">
              THE PLATFORM
            </span>

            <h2>
              Built for competitive players.
            </h2>
          </div>

          <div className="feature-grid">

            <div className="feature-card">
              <span>01</span>
              <h3>Tournaments</h3>
              <p>
                Enter competitive tournaments and
                climb the leaderboard.
              </p>
            </div>

            <div className="feature-card">
              <span>02</span>
              <h3>Games</h3>
              <p>
                Choose from multiple games and
                build your DEMO balance.
              </p>
            </div>

            <div className="feature-card">
              <span>03</span>
              <h3>Community</h3>
              <p>
                Stay connected with Trading Wave
                announcements and players.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="placeholder-page">
      <Link to="/" className="brand">
        <div className="brand-logo">TW</div>
        <span>Trading Wave</span>
      </Link>

      <div>
        <span className="section-label">
          TRADING WAVE
        </span>

        <h1>{title}</h1>

        <p>
          This section is being built and will be
          connected to the Trading Wave backend.
        </p>

        <Link
          to="/"
          className="primary-button"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/tournaments"
          element={<Tournaments />}
        />

        <Route
          path="/games"
          element={
            <Placeholder title="Games" />
          }
        />

        <Route
          path="/leaderboard"
          element={
            <Placeholder title="Leaderboard" />
          }
        />

        <Route
          path="/community"
          element={
            <Placeholder title="Community" />
          }
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
