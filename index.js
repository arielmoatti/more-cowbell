//~~~~ IMPORTS
const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");

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
    res.redirect("/register");
});

app.get("/petition", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        db.getSignature(userId).then((results) => {
            if (results.rows[0].signature) {
                req.session.signed = true;
                res.redirect("/thank-you");
            } else {
                db.getCurrentSigner(userId).then(({ rows }) => {
                    res.render("petition", {
                        rows,
                    });
                });
            }
        });
    } else {
        res.redirect("/register");
    }
});

app.post("/petition", (req, res) => {
    const { userId } = req.session;
    const { signature } = req.body;
    if (signature !== "") {
        db.addSignature(userId, signature)
            .then((results) => {
                //set cookie
                req.session.signed = true;
                console.log("user has finally signed!");
                res.redirect("/thank-you");
            })
            .catch((err) => {
                console.log("error in POST /petition addSignature()", err);
            });
    } else {
        res.render("petition", {
            err:
                "Oops! Looks like you still haven't signed my petition. You need to use the mouse to make your signature...",
            btn: "try again",
        });
    }
});

app.get("/thank-you", (req, res) => {
    const { signed, userId } = req.session;
    if (signed) {
        db.countSigners().then((counts) => {
            const numberOfSigners = counts.rows[0].count;
            db.getSignature(userId).then((results) => {
                const signature = results.rows[0].signature;
                db.getCurrentSigner(userId).then(({ rows }) => {
                    res.render("thankyou", {
                        rows,
                        signature,
                        numberOfSigners,
                    });
                });
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.get("/signerslist", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        db.getSigners()
            .then(({ rows }) => {
                console.log("rows", rows);
                res.render("signerslist", {
                    rows,
                });
            })
            .catch((err) => {
                console.log("error in /signerslist", err);
            });
    } else {
        res.redirect("/register");
    }
});

app.get("/register", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        res.redirect("/petition");
    } else {
        res.render("register", {});
    }
});

app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    // console.log(firstname, lastname, email, password);
    if (
        firstname !== "" &&
        lastname !== "" &&
        email !== "" &&
        password !== ""
    ) {
        //existing email validation
        db.getPasswordByEmail(email)
            .then((results) => {
                if (results.rows.length == 0) {
                    //email not existing
                    hash(password)
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
                                    console.log(
                                        "error in POST /register createUser()",
                                        err
                                    );
                                    res.send(
                                        "<h1>Server error: user could NOT be added to db</h1>"
                                    );
                                });
                        }) //end of hash()
                        .catch((err) => {
                            console.log("error is POST /register hash()", err);
                            res.send(
                                "<h1>Server error: your password could NOT be hashed</h1>"
                            );
                        });
                } else {
                    //of if block (email)
                    console.log("email has been already used");
                    res.render("register", {
                        err: "email has been already used",
                    });
                }
            }) //end of getPasswordByEmail()
            .catch((err) => {
                console.log("error is POST /register checkEmail", err);
                res.send(
                    "<h1>Server error: your email could NOT be verified</h1>"
                );
            });
        //end of hash block
    } else {
        //of if block (firstname, lastname, email, password)
        res.render("register", {
            err: "make sure your form is complete!",
            btn: "try again",
        });
    }
});

app.get("/login", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        res.redirect("/petition");
    } else {
        res.render("login", {});
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("user input email: ", email, "user input password: ", password);
    if (email !== "" && password !== "") {
        db.getPasswordByEmail(email)
            .then((results) => {
                // console.log("from getPasswordByEmail > results: ", results);
                const hashedPw = results.rows[0].password;
                console.log("from getPasswordByEmail > hashedPw: ", hashedPw);
                compare(password, hashedPw)
                    .then((match) => {
                        console.log(
                            "user input password matches the hash? ",
                            match
                        );
                        if (match) {
                            req.session.userId = results.rows[0].id; //set cookie
                            res.redirect("/petition");
                        } else {
                            res.render("login", {
                                err: "Uh oh! you have failed to log in...",
                                btn: "try again",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("error in POST /login compare():", err);
                        res.send(
                            "<h1>Server error: your password does NOT match</h1>"
                        );
                    });
            })
            .catch((err) => {
                console.log("error in POST /login getPasswordByEmail():", err);
                res.render("login", {
                    err: "Uh oh! you have failed to log in...",
                    btn: "try again",
                });
            });
    } else {
        res.render("login", {
            err: "make sure your form is complete!",
            btn: "try again",
        });
    }
});

app.get("/profile", (req, res) => {
    const { userId, profiled } = req.session;
    if (userId) {
        if (profiled) {
            res.redirect("/petition");
        } else {
            res.render("profile", {});
        }
    } else {
        res.redirect("/register");
    }
});

app.post("/profile", (req, res) => {
    const { age, city, url } = req.body;
    const { userId } = req.session;
    console.log(age, city, url);
    db.addProfile(age, city, url, userId)
        .then((results) => {
            console.log("a new profile was added!");
            req.session.profiled = true;
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("error in POST /profile", err);
            res.send("<h1>Server error: profile could NOT be added to db</h1>");
        });
});

app.listen(8080, () => console.log("petition SERVER at 8080..."));
