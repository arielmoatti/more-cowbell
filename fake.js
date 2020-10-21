const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const { hash, compare } = require("./bc");
const fakeUsers = require("./fakeUsers.json");

const [{ firstname, lastname, email, password }] = fakeUsers[2];
console.log(firstname, lastname, email, password);
// console.log(fakeUsers);
// console.log(fakeUsers.firstname);
/*hash(password)
    .then((hashedPw) => {
        console.log("hashedPw", hashedPw);
        db.createUser(firstname, lastname, email, hashedPw)
            .then((results) => {
                //set cookie
                req.session.userId = results.rows[0].id;
                console.log("a new user was added!");
                res.redirect("/profile");
            }) //end of createUser()
            .catch((err) => {
                console.log("error in POST /register createUser()", err);
                res.send(
                    "<h1>Server error: user could NOT be added to db</h1>"
                );
            });
    }) //end of hash()
    .catch((err) => {
        console.log("error is POST /register hash()", err);
        res.send("<h1>Server error: your password could NOT be hashed</h1>");
    });
*/
