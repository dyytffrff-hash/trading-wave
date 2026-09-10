const { Telegraf, Markup } = require("telegraf");

const User = require("../models/User");
const Tournament = require("../models/Tournament");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is missing");
}

const bot = new Telegraf(BOT_TOKEN);


// ================================
// MENU
// ================================

function mainMenu() {
  return Markup.keyboard([
    ["🏆 Tournaments", "👤 My Account"],
    ["💰 Balance", "🎮 Games"],
    ["❓ Help"]
  ]).resize();
}


// ================================
// ERROR HANDLING
// ================================

bot.catch((error, ctx) => {

  console.error(
    "Telegram error:",
    error.message
  );

});


// ================================
// START
// ================================

bot.start(async (ctx) => {

  try {

    const telegramId =
      String(ctx.from.id);


    const user =
      await User.findOneAndUpdate(
        {
          telegramId
        },
        {
          telegramId,
          username:
            ctx.from.username || null,
          firstName:
            ctx.from.first_name || null,
          lastName:
            ctx.from.last_name || null
        },
        {
          upsert: true,
          new: true
        }
      );


    await ctx.reply(
`🌊 Trading Wave

Welcome ${user.firstName || "Player"}!

Trade. Compete. Win.

Choose an option:`,
      mainMenu()
    );


  } catch(error) {

    console.error(
      "START ERROR:",
      error.message
    );

    await ctx.reply(
      "Please try again."
    );

  }

});


// ================================
// TOURNAMENTS
// ================================

bot.hears(
"🏆 Tournaments",
async (ctx)=>{
console.log("Tournament button pressed");
try {



  const tournaments =
    await Tournament.find({
      status:"waiting"
    });


  if(!tournaments.length){

    return ctx.reply(
      "No tournaments available."
    );

  }


  let text =
`🏆 Trading Wave Tournaments

`;


  tournaments.forEach((t,i)=>{

    text +=
`${i+1}. ${t.name}

💵 Entry: $${t.entryFee}
🎮 Games: ${t.games.join(", ")}
💰 Demo: ${t.startingDemoBalance}
⏱ Duration: ${t.durationHours} hours

`;

  });


  await ctx.reply(
    text,
    mainMenu()
  );


}
catch(error){

 console.error(
 "TOURNAMENT ERROR:",
 error.message
 );

 await ctx.reply(
 "Unable to load tournaments. Try again."
 );

}

});


// ================================
// ACCOUNT
// ================================

bot.hears(
"👤 My Account",
async(ctx)=>{

try {

const user =
await User.findOne({
 telegramId:String(ctx.from.id)
});


if(!user){

return ctx.reply(
"Account not found."
);

}


await ctx.reply(
`👤 Trading Wave Account

Username: ${user.username || "None"}
Name: ${user.firstName || ""}
Telegram ID: ${user.telegramId}

Status: Active`,
mainMenu()
);


}catch(error){

console.error(
"ACCOUNT ERROR:",
error.message
);

}

});


// ================================
// HELP
// ================================

bot.hears(
"❓ Help",
async(ctx)=>{

await ctx.reply(
`❓ Trading Wave Help

🏆 View tournaments
💰 Deposit funds
🎮 Play games
📊 View leaderboard`,
mainMenu()
);

});


// ================================
// PING
// ================================

bot.command(
"ping",
async(ctx)=>{

await ctx.reply(
"Trading Wave bot is online."
);

});


module.exports = bot;
