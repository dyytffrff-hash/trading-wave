const mongoose = require("mongoose");

async function connectDB() {
  try {

    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 60000,

        // Better for Termux/mobile network
        maxPoolSize: 5,
        minPoolSize: 0,

        heartbeatFrequencyMS: 30000,

        retryWrites: true
      }
    );


    console.log(
      "MongoDB connected"
    );


    mongoose.connection.on(
      "error",
      (error) => {

        console.error(
          "MongoDB error:",
          error.message
        );

      }
    );


    // Silent reconnect events
    mongoose.connection.on(
      "disconnected",
      () => {}
    );


    mongoose.connection.on(
      "reconnected",
      () => {}
    );


    return mongoose.connection;


  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;

  }
}


module.exports = connectDB;
