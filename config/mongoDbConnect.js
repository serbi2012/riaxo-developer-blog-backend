const mongoose = require("mongoose");

module.exports = (URI) => {
  if (!URI) throw new Error("Database URI is invalid");

  mongoose
    .connect(URI, {
      useNewUrlParser: true,
    })
    .catch((err) => console.log(`DB connection error: ${err}`));

  mongoose.connection.on("disconnected", () => {
    console.log("DB disconnected");
  });

  mongoose.connection.once("open", () => console.log("Connected to DB"));
};
