const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sortByDate = (a, b) => {
  if (a.accessdate > b.accessdate) {
    return -1;
  }
  if (a.accessdate > b.accessdate) {
    return 1;
  }
  return 0;
};

app.get("/", (req, res) => {
  pool
    .query("SELECT * from visitors")
    .then((sql) => {
      sql.rows.sort(sortByDate);
      res.render("index", { data: sql.rows });
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
