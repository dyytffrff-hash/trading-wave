import { useEffect, useState } from "react";

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/tournaments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load tournaments");
        }
        return response.json();
      })
      .then((data) => {
        setTournaments(data.tournaments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not connect to Trading Wave server.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Tournaments</h1>
        <p>Loading tournaments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Tournaments</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Tournaments</h1>

      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        <div>
          {tournaments.map((tournament) => (
            <div key={tournament._id}>
              <h2>{tournament.name}</h2>

              <p>
                Entry Fee: ${tournament.entryFee}
              </p>

              <p>
                Starting Demo Balance: $
                {tournament.startingDemoBalance}
              </p>

              <p>
                Players: {tournament.playerCount || 0}
              </p>

              <p>
                Status: {tournament.status}
              </p>

              <button>View Tournament</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tournaments;
