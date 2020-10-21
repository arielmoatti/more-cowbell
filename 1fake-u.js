const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const { hash, compare } = require("./bc");

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("Jerry", "Seinfeld", "1@1", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("George", "Costanza", "2@2", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("Elaine", "Benes", "3@3", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("Cosmo", "Kramer", "4@4", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("Newman", "the mailman", "5@5", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("Uncle", "Leo", "6@6", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });

hash("123") //our default password
    .then((hashedPw) => {
        db.createUser("Soup", "Nazi", "7@7", hashedPw)
            .then((results) => {
                console.log("a new user was added!");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
    });
