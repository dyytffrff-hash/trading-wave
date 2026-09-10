const Tournament = require("../models/Tournament");


// ==========================================
// AI TARGET GENERATOR
// ==========================================

function generateTarget() {
  const minimum = 2500;
  const maximum = 6000;

  return (
    Math.floor(
      Math.random() *
        (maximum - minimum + 1)
    ) + minimum
  );
}


// ==========================================
// SET TARGET FOR $10 TOURNAMENT
// ==========================================

async function setTargetForTournament(
  tournamentId
) {
  const tournament =
    await Tournament.findById(
      tournamentId
    );

  if (!tournament) {
    throw new Error(
      "Tournament not found"
    );
  }

  if (tournament.entryFee !== 10) {
    throw new Error(
      "AI target is only available for the $10 tournament"
    );
  }

  if (
    tournament.winCondition !==
    "target_race"
  ) {
    throw new Error(
      "This tournament does not use a target"
    );
  }

  /*
   * If a target already exists,
   * never replace it.
   */
  if (
    tournament.targetAmount !== null
  ) {
    return tournament;
  }

  const target =
    generateTarget();

  tournament.targetAmount =
    target;

  tournament.targetSetByAI =
    true;

  await tournament.save();

  console.log(
    `AI target selected privately: ${target}`
  );

  return tournament;
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  generateTarget,
  setTargetForTournament
};
