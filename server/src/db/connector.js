const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_DB_URI = process.env.MONGO_DB_URI;

    await connect(MONGO_DB_URI, {
      dbName: "Roar",
      bufferCommands: true
    }).then(() => console.log("Connected to Database"))
  }
  catch (error) {
    console.log("Error happened while connecting to database", error.message);
  }
}

module.exports = connectDB;