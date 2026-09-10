require("dotenv").config();

const connectDB = require("../config/db");
const { setTargetForTournament } = require("./targetService");

async function main() {
  await connectDB();

  const tournamentId = "6a81a59ae4a8f4d266d6eac4";

  const tournament =
    await setTargetForTournament(tournamentId);

  console.log("\n$10 Tournament AI Target:");
  console.log("Target:", tournament.targetAmount);
  console.log("Set by AI:", tournament.targetSetByAI);

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
