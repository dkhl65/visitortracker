const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", (req, res) => {
  pool
    .query("SELECT * from visitors")
    .then((sql) => {
      res.send(sql.rows);
    })
    .catch((e) => {
      console.error(e.stack);
      res.sendStatus(500);
    });
});

app.post("/", (req, res) => {
  pool
    .query(
      "INSERT INTO visitors VALUES($1, $2, current_timestamp) ON CONFLICT (ipaddr, website) DO UPDATE SET accessdate = current_timestamp",
      [req.body.ipaddr, req.body.website]
    )
    .catch((e) => {
      console.error(e.stack);
      res.sendStatus(500);
    })
    .finally(() => {
      res.send();
    });
});

app.listen(4000, () => {
  console.log("running on port 4000");
});
