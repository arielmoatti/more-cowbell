//~~~~ IMPORTS
const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");

// db.getTimestamp().then((result) => {
//     console.log("result", result);
// });

// console.log("db.getTimestamp()", db.getTimestamp());

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

app.use(csurf());

app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.set("x-frame-options", "DENY");
    next();
});

app.use(express.static("./public"));

//~~~~ ROUTES
app.get("/", (req, res) => {
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    const { signatureId } = req.session;
    if (!signatureId) {
        res.render("home");
    } else {
        res.redirect("/thank-you");
    }
});

app.post("/petition", (req, res) => {
    const { firstname, lastname, signature } = req.body;
    if (firstname !== "" && lastname !== "" && signature !== "") {
        db.addSigner(`${firstname}`, `${lastname}`, `${signature}`)
            .then((results) => {
                //set cookie
                req.session.signatureId = results.rows[0].id;
                // console.log("added new signer!");
                res.redirect("/thank-you");
            })
            .catch((err) => {
                console.log("error in POST /petition", err);
            });
    } else {
        res.render("home", {
            unfilled: true,
        });
    }
});

app.get("/thank-you", (req, res) => {
    const { signatureId } = req.session;
    if (signatureId) {
        db.countSigners().then((counts) => {
            const numberOfSigners = counts.rows[0].count;
            db.getCurrentSigner(signatureId).then(({ rows }) => {
                res.render("thankyou", {
                    rows,
                    numberOfSigners,
                });
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.get("/signerslist", (req, res) => {
    const { signatureId } = req.session;
    if (signatureId) {
        db.getSigners()
            .then(({ rows }) => {
                res.render("signerslist", {
                    rows,
                });
            })
            .catch((err) => {
                console.log("error in /signerslist", err);
            });
    } else {
        res.redirect("/petition");
    }
});

app.get("/register", (req, res) => {
    res.render("register", {});
});

app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    console.log(firstname, lastname, email, password);

    //use hash when a user registers, all we need is what the user wants their password to be
    //const { userPassword } = req.body
    hash(password) //here goes the password from the input field
        .then((hashedPw) => {
            console.log("hashedPw", hashedPw);

            //we want to store the user's hashed pw and all the other user info in our db
        })
        .catch((err) => {
            console.log("error is POST register hash", err);
        });
});

app.get("/login", (req, res) => {
    res.render("login", {});
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    /*
    //here we want to use compare() to check if the user is the right one
    //we go to our db, check if the email address exists, and if so, SELECT the user's stored password hash
    const hashed = "read"; //this will be again the input field
    compare(userPassword, hashed).then(match => {
        //does this match?
        console.log("clear text pw matches the hash? ", match);
        //if the password matches, we can set a cookie with the user's id, 
        //if not, we need to re-render the login template with an error message
        //if the password doesn't match, let your user know
    }).catch(err => {
        console.log("error in POST /login compare", err);
        //render the login template with error message
    })
    */
});
//
//
//
//

app.listen(8080, () => console.log("petition SERVER at 8080..."));
