import { Link } from "react-router-dom";

function Profile() {
  const savedUser = localStorage.getItem("tradingWaveUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const firstName = user?.firstName || "Player";
  const lastName = user?.lastName || "";
  const email = user?.email || "Not available";

  return (
    <div className="profile-page">

      <header className="page-header">
        <Link to="/dashboard" className="brand">
          <div className="brand-logo">TW</div>
          <span>Trading Wave</span>
        </Link>

        <Link to="/dashboard" className="back-link">
          Dashboard
        </Link>
      </header>

      <main className="profile-container">

        <div className="profile-heading">
          <span className="section-label">ACCOUNT</span>

          <h1>Profile</h1>

          <p>
            Manage your Trading Wave account information.
          </p>
        </div>

        <section className="profile-card">

          <div className="profile-avatar">
            {firstName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-name">
            <h2>
              {firstName} {lastName}
            </h2>

            <span>Trading Wave Player</span>
          </div>

        </section>

        <section className="profile-card">

          <div className="profile-section-title">
            <span>PERSONAL INFORMATION</span>
          </div>

          <div className="profile-field">
            <span>First name</span>
            <strong>{firstName}</strong>
          </div>

          <div className="profile-field">
            <span>Last name</span>
            <strong>{lastName || "Not provided"}</strong>
          </div>

          <div className="profile-field">
            <span>Email address</span>
            <strong>{email}</strong>
          </div>

        </section>

        <section className="profile-menu">

          <Link to="/dashboard" className="profile-menu-item">
            <div>
              <strong>Dashboard</strong>
              <span>Return to your player dashboard</span>
            </div>
            <b>→</b>
          </Link>

          <Link to="/tournaments" className="profile-menu-item">
            <div>
              <strong>Tournament history</strong>
              <span>View your tournament activity</span>
            </div>
            <b>→</b>
          </Link>

          <Link to="/" className="profile-menu-item">
            <div>
              <strong>Trading Wave home</strong>
              <span>Return to the main website</span>
            </div>
            <b>→</b>
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Profile;
