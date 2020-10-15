const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.get("/", (req, res) => {
    console.log("get request to / route has just happend");
    res.end();
});

app.get("/actors", (req, res) => {
    db.getActors()
        .then(({ rows }) => {
            console.log("results:", rows);
        })
        .catch((err) => {
            console.log(err);
        });
    res.end("check your terminal...");
});

app.post("/add-actor", (req, res) => {
    db.addActor("Ariel Moatti", 43)
        .then(() => {
            //worked!
            console.log("added city!");
            res.end("thank you!");
        })
        .catch((err) => {
            //err
            console.log("error in add-actor", err);
        });
});

//
//
//
//

app.listen(8080, () => console.log("petition is listening..."));
