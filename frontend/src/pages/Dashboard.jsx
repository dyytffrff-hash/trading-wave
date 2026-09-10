import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("tradingWaveUser") || "null"
  );

  const firstName = user?.firstName?.trim();
  const username = user?.username?.trim();
  const emailName = user?.email
    ? user.email.split("@")[0]
    : "Player";

  const name = firstName || username || emailName;

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <Link to="/" className="brand">
          <div className="brand-logo">TW</div>
          <span>Trading Wave</span>
        </Link>

        <Link to="/profile" className="profile-button">
          {name.charAt(0).toUpperCase()}
        </Link>

      </header>

      <main className="dashboard-content">

        <div className="dashboard-welcome">
          <span className="section-label">
            PLAYER DASHBOARD
          </span>

          <h1>
            Welcome, {name}.
          </h1>

          <p>
            Manage your tournaments, games and account
            from one place.
          </p>
        </div>

        <section className="dashboard-balance">

          <div>
            <span>DEMO BALANCE</span>
            <strong>$0.00</strong>
            <small>
              Tournament credits
            </small>
          </div>

          <div className="balance-mark">
            $
          </div>

        </section>

        <section className="dashboard-grid">

          <Link to="/tournaments" className="dashboard-card">
            <span>🏆</span>
            <strong>Tournaments</strong>
            <small>
              View and join tournaments
            </small>
          </Link>

          <Link to="/games" className="dashboard-card">
            <span>🎮</span>
            <strong>Games</strong>
            <small>
              Play Trading Wave games
            </small>
          </Link>

          <Link to="/leaderboard" className="dashboard-card">
            <span>🏅</span>
            <strong>Leaderboard</strong>
            <small>
              See the top players
            </small>
          </Link>

          <Link to="/community" className="dashboard-card">
            <span>💬</span>
            <strong>Community</strong>
            <small>
              Announcements and discussions
            </small>
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
