const db = require("./db");
// const { hash, compare } = require("./bc");

db.addSignature(1, "signed")
    .then((results) => {
        console.log("user signature added!");
    })
    .catch((err) => {
        console.log("error in POST /petition addSignature()", err);
    });

db.addSignature(2, "signed")
    .then((results) => {
        console.log("user signature added!");
    })
    .catch((err) => {
        console.log("error in POST /petition addSignature()", err);
    });

db.addSignature(3, "signed")
    .then((results) => {
        console.log("user signature added!");
    })
    .catch((err) => {
        console.log("error in POST /petition addSignature()", err);
    });

db.addSignature(4, "signed")
    .then((results) => {
        console.log("user signature added!");
    })
    .catch((err) => {
        console.log("error in POST /petition addSignature()", err);
    });

db.addSignature(7, "signed")
    .then((results) => {
        console.log("user signature added!");
    })
    .catch((err) => {
        console.log("error in POST /petition addSignature()", err);
    });
