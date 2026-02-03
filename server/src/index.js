const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const generateRoute = require("./routes/generate");
const playgroundRoute = require("./routes/playground");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/generate", generateRoute);
app.use("/api/playground", playgroundRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
