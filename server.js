/* global process */

const express = require("express");

const app = express();

app.use(
  "/taas-admin-app",
  express.static("./dist", {
    setHeaders: (res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    },
  })
);

app.get("/", (req, res) => {
  res.send("alive");
});

const PORT = process.env.PORT || 8502;
app.listen(PORT, () => {
  console.log(`App is hosted on port ${PORT}.`); // eslint-disable-line no-console
});
