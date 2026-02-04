const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const generateRoute = require("./routes/generate");
const playgroundRoute = require("./routes/playground");
const authRoute = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(authRoute);
app.use("/api/generate", generateRoute);
app.use("/api/playground", playgroundRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
