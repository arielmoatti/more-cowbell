const db = require("./db");

db.addProfile(25, "NYC", "http://seinfeldscripts.com/seinfeld-george.html", 1)
    .then((results) => {
        console.log("a new profile was added!");
    })
    .catch((err) => {
        console.log("error in POST /profile", err);
    });

db.addProfile("", "NYC", "http://seinfeldscripts.com/seinfeld-jerry.html", 2)
    .then((results) => {
        console.log("a new profile was added!");
    })
    .catch((err) => {
        console.log("error in POST /profile", err);
    });

db.addProfile("", "NYC", "", 4)
    .then((results) => {
        console.log("a new profile was added!");
    })
    .catch((err) => {
        console.log("error in POST /profile", err);
    });

db.addProfile(
    25,
    "Berlin",
    "http://seinfeldscripts.com/seinfeld-kramer.html",
    5
)
    .then((results) => {
        console.log("a new profile was added!");
    })
    .catch((err) => {
        console.log("error in POST /profile", err);
    });

db.addProfile("", "", "", 7)
    .then((results) => {
        console.log("a new profile was added!");
    })
    .catch((err) => {
        console.log("error in POST /profile", err);
    });
