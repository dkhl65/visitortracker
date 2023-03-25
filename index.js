const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(req.socket.remoteAddress);
});

app.listen(4000, () => {
  console.log("running on port 4000");
});
