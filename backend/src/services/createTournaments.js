require("dotenv").config();

const connectDB = require("../config/db");

const {
  createStarterTournament,
  createTenDollarTournament
} = require("./tournamentService");

async function main() {
  await connectDB();

  const starter = await createStarterTournament();
  const tenDollar = await createTenDollarTournament();

  console.log("\nTrading Wave tournaments created:\n");

  console.log("$2 STARTER");
  console.log("ID:", starter._id);
  console.log("Duration:", starter.durationHours, "hours");
  console.log("Starting DEMO:", starter.startingDemoBalance);

  console.log("\n$10 TARGET");
  console.log("ID:", tenDollar._id);
  console.log("Duration:", tenDollar.durationHours, "hours");
  console.log("Starting DEMO:", tenDollar.startingDemoBalance);
  console.log("AI Target:", tenDollar.targetAmount);

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
