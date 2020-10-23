//~~~~ IMPORTS
const express = require("express");
const app = (exports.app = express());
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

// other functions

const checkFields = (age, url) => {
    let field;
    if (isNaN(age) || age < 0) {
        field = "you should enter a valid age (or leave the field empty)";
        return field;
    } else if (url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            if (url.startsWith("www")) {
                field = `please add "http://" or "https://" to your address`;
                return field;
            } else if (url.startsWith("javascript:")) {
                field = "WHAT ARE YOU TRYING TO PULL HERE?!";
                return field;
            } else {
                field = `make sure your address begins with "http://" or "https://"`;
                return field;
            }
        }
    }
};

//~~~~ ROUTES
app.get("/", (req, res) => {
    res.redirect("/register");
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
        db.getUserDataByEmail(email)
            .then((results) => {
                if (results.rows.length == 0) {
                    //email not existing
                    hash(password)
                        .then((hashedPw) => {
                            // console.log("hashedPw", hashedPw);
                            db.createUser(firstname, lastname, email, hashedPw)
                                .then((results) => {
                                    //set cookie
                                    req.session.userId = results.rows[0].id;
                                    // console.log("a new user was added!");
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
                    // console.log("email has been already used");
                    res.render("register", {
                        message: "this email is already in use",
                        btn: "try again",
                        href: "javascript://",
                    });
                }
            }) //end of getUserDataByEmail()
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
            message: "make sure your form is complete!",
            btn: "try again",
            href: "javascript://",
        });
    }
});

app.get("/login", (req, res) => {
    // console.log("req session at login GET", req.session);
    const { userId } = req.session;
    if (userId) {
        res.redirect("/petition");
    } else {
        res.render("login", {});
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email !== "" && password !== "") {
        db.getUserDataByEmail(email)
            .then((results) => {
                // console.log("from getUserDataByEmail > results: ", results);
                const hashedPw = results.rows[0].password;
                // console.log("from getUserDataByEmail > hashedPw: ", hashedPw);
                compare(password, hashedPw)
                    .then((match) => {
                        // console.log("user input password matches the hash? ",match);
                        if (match) {
                            req.session.userId = results.rows[0].id; //set cookie
                            //
                            db.getSignature(req.session.userId)
                                .then((results) => {
                                    if (results.rows.length != 0) {
                                        req.session.signed = true;
                                    }
                                })
                                .catch((err) => {
                                    console.log(
                                        "error in POST /login getSignature()",
                                        err
                                    );
                                });
                            //
                            res.redirect("/profile");
                        } else {
                            res.render("login", {
                                message: "Uh oh! you have failed to log in...",
                                btn: "try again",
                                href: "javascript://",
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
                console.log("error in POST /login getUserDataByEmail():", err);
                res.render("login", {
                    message: "Uh oh! you have failed to log in...",
                    btn: "try again",
                    href: "javascript://",
                });
            });
    } else {
        res.render("login", {
            message: "these two fields are mandatory!",
            btn: "try again",
            href: "javascript://",
        });
    }
});

app.get("/petition", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        db.getSignature(userId)
            .then((results) => {
                if (results.rows.length != 0) {
                    req.session.signed = true;
                    res.redirect("/thank-you");
                } else {
                    db.getCurrentSigner(userId).then(({ rows }) => {
                        res.render("petition", {
                            rows,
                        });
                    });
                }
            })
            .catch((err) => {
                console.log("error in GET /petition getSignature()", err);
            });
    } else {
        res.redirect("/register");
    }
});

app.post("/petition", (req, res) => {
    const { userId } = req.session;
    const { signature } = req.body;
    if (signature != "") {
        db.addSignature(userId, signature)
            .then((results) => {
                //set cookie
                req.session.signed = true;
                // console.log("user has finally signed!");
                res.redirect("/thank-you");
            })
            .catch((err) => {
                console.log("error in POST /petition addSignature()", err);
            });
    } else {
        res.render("petition", {
            message:
                "Oops! Looks like you still haven't signed my petition. You need to use the mouse to make your signature...",
            btn: "try again",
            href: "javascript://",
        });
    }
});

app.get("/thank-you", (req, res) => {
    // console.log("req session at thankyou", req.session);
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
    const { signed, userId } = req.session;
    if (userId) {
        if (signed) {
            db.getSigners()
                .then(({ rows }) => {
                    // console.log("rows", rows);
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
    } else {
        res.redirect("/register");
    }
});

app.get("/profile", (req, res) => {
    const { userId, profiled } = req.session;
    // console.log("profiled", profiled);
    if (userId) {
        if (profiled) {
            res.redirect("/petition");
        } else {
            db.getProfile(userId)
                .then(({ rows }) => {
                    // console.log("rows", rows);
                    if (rows.length == 0) {
                        res.render("profile", {});
                    } else {
                        // console.log("user has a profile!");
                        req.session.profiled = true;
                        res.redirect("/petition");
                    }
                })
                .catch((err) => {
                    console.log("error in GET /profile getProfile()", err);
                });
        }
    } else {
        res.redirect("/register");
    }
});

app.post("/profile", (req, res) => {
    const { age, city, url } = req.body;
    const { userId } = req.session;
    // checks validation of fields
    const validation = checkFields(age, url);
    if (validation) {
        //returns with errors
        res.render("profile", {
            message: validation,
            btn: "try again",
            href: "javascript://",
        });
    } else {
        db.addProfile(age, city, url, userId)
            .then((results) => {
                // console.log("a new profile was added!");
                req.session.profiled = true;
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log("error in POST /profile", err);
                res.send(
                    "<h1>Server error: profile could NOT be added to db</h1>"
                );
            });
    }
});

app.get("/profile/update", (req, res) => {
    const { userId, profiled } = req.session;
    if (userId) {
        if (profiled) {
            //valid fields
            db.getProfile(userId).then(({ rows }) => {
                req.session.userEmail = rows[0].email;
                res.render("update", {
                    rows,
                });
            });
        } else {
            //not profiles
            res.redirect("/profile");
        }
    } else {
        res.redirect("/register");
    }
});

app.post("/profile/update", (req, res) => {
    const { firstname, lastname, email, password, age, city, url } = req.body;
    const { userId, userEmail } = req.session;
    if (firstname !== "" && lastname !== "" && email !== "") {
        const validation = checkFields(age, url);
        if (validation) {
            //returns with errors
            res.render("profile", {
                message: validation,
                btn: "try again",
                href: "/profile/update",
            });
        } else {
            //existing email validation
            db.getUserDataByEmail(email)
                .then(({ rows }) => {
                    if (rows.length === 0 || rows[0].email === userEmail) {
                        // console.log("email is good to use!");
                        db.updateUserWithoutPW(
                            firstname,
                            lastname,
                            email,
                            userId
                        )
                            .then((results) => {
                                //more updates here
                                //
                                if (password) {
                                    hash(password)
                                        .then((hashedPw) => {
                                            // console.log("hashedPw", hashedPw);
                                            db.updateUserPassword(
                                                hashedPw,
                                                userId
                                            )
                                                .then(() => {
                                                    // console.log(
                                                    //     "user has changed password!"
                                                    // );
                                                }) //end of updateUserPassword()
                                                .catch((err) => {
                                                    console.log(
                                                        "error in POST /update updateUserPassword()",
                                                        err
                                                    );
                                                    res.send(
                                                        "<h1>Server error: user could NOT update password in db</h1>"
                                                    );
                                                });
                                        }) //end of hash()
                                        .catch((err) => {
                                            console.log(
                                                "error is POST /update hash()",
                                                err
                                            );
                                            res.send(
                                                "<h1>Server error: your password could NOT be hashed</h1>"
                                            );
                                        });
                                } //end of if password
                                ////// update rest of profile fields //////
                                db.upsertProfile(age, city, url, userId)
                                    .then(() => {
                                        //
                                        // console.log(
                                        //     "successful update other fields"
                                        // );
                                    })
                                    .catch((err) => {
                                        console.log(
                                            "error in POST /update upsertUser()",
                                            err
                                        );
                                        res.send(
                                            "<h1>Server error: user could NOT update other fields in db</h1>"
                                        );
                                    });
                                //
                                //
                                res.render("update", {
                                    message:
                                        "your profile was successfully updated",
                                    btn: "continue",
                                    href: "/petition",
                                });
                            })
                            .catch((err) => {
                                console.log(
                                    "error in POST /update updateUserWithoutPW()",
                                    err
                                );
                                res.send(
                                    "<h1>Server error: user profile could NOT be updates in db</h1>"
                                );
                            });
                    } else {
                        //of if block (email is free)
                        // console.log("email has been already used");
                        res.render("update", {
                            message: "this email is already in use",
                            btn: "try again",
                            href: "/profile/update",
                        });
                    }
                }) //end of getUserDataByEmail()
                .catch((err) => {
                    console.log("error is POST /update checkEmail", err);
                    res.send(
                        "<h1>Server error: your email could NOT be verified</h1>"
                    );
                });
        } //closes fields validation
    } else {
        //of if block (firstname, lastname, email, password)
        // console.log("missing fields");
        res.render("update", {
            message: "you cannot leave mandatory fields empty!",
            btn: "try again",
            href: "/profile/update",
        });
    } //close else for empty fields
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.post("/delete/signature", (req, res) => {
    //
    const { userId } = req.session;
    if (userId) {
        db.deleteSignature(userId)
            .then(() => {
                console.log("signature deleted!");
                req.session.signed = null;
                // res.redirect("/petition");
                res.render("thankyou", {
                    message: "your signature was deleted",
                    btn: "continue",
                    // href: "javascript://",
                    href: "/petition",
                });
            })
            .catch((err) => {
                console.log("error in deleteSignature()", err);
            });
    } else {
        res.redirect("/register");
    }
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("petition SERVER at 8080...")
    );
}
