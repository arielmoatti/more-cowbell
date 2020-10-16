//~~~~ IMPORTS
const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");

//added global helpers-----------
const hbSet = hb.create({
    helpers: {
        someFn() {
            return "something";
        },
    },
});
//-------------

app.engine("handlebars", hbSet.engine);
app.set("view engine", "handlebars");

//~~~~~~~~~MIDDLEWARE
app.use(
    cookieSession({
        secret: `we need more cowbell!`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static("./public"));

//~~~~ ROUTES
app.get("/", (req, res) => {
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    res.render("home");
});

app.get("/signerslist", (req, res) => {
    const { signatureId } = req.session;
    if (signatureId) {
        db.getSigners()
            .then(({ rows }) => {
                let signersList = "";
                res.render("signerslist", {
                    rows,
                    signersList,
                });
            })
            .catch((err) => {
                console.log("error in /signerslist", err);
            });
    } else {
        res.redirect("/petition");
    }
});

app.post("/petition", (req, res) => {
    const { firstname, lastname, signature } = req.body;
    db.addSigner(`${firstname}`, `${lastname}`, `${signature}`)
        .then((results) => {
            //set cookie
            req.session.signatureId = results.rows[0].id;
            console.log("added new signer!");
            res.redirect("/thank-you");
        })
        .catch((err) => {
            console.log("error in POST /petition", err);
        });
});

app.get("/thank-you", (req, res) => {
    const { signatureId } = req.session;
    if (signatureId) {
        db.getCurrentSigner(signatureId).then((results) => {
            // console.log("results", results);
            res.render("thankyou", {
                results,
            });
        });
    } else {
        res.redirect("/petition");
    }
});
//
//
//
//

app.listen(8080, () => console.log("petition SERVER at 8080..."));
