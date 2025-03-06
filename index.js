const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql")
const path = require('path')
const port = 8089;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "smartDevices"
});
// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`Connected to database`)
});
global.db = db;

require("./routes/main")(app);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));