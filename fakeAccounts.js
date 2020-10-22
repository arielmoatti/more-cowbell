const db = require("./db");
const { hash } = require("./bc");
let spicedPg = require("spiced-pg");
let database = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

//// reset database (DROP TABLES)
let dbReset = () => {
    database.query(`
        DROP TABLE IF EXISTS users CASCADE;
        CREATE TABLE users (
            id SERIAL   PRIMARY KEY,
            first       VARCHAR(255) NOT NULL,
            last        VARCHAR(255) NOT NULL,
            email       VARCHAR(255) NOT NULL UNIQUE,
            password    VARCHAR(255) NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

        DROP TABLE IF EXISTS user_profiles CASCADE;
        CREATE TABLE user_profiles (
            id          SERIAL PRIMARY KEY,
            age         INT,
            city        VARCHAR(255),
            url         VARCHAR(255),
            user_id     INT NOT NULL REFERENCES users(id) UNIQUE
        );

        DROP TABLE IF EXISTS signatures;
        CREATE TABLE signatures (
            id SERIAL   PRIMARY KEY,    
            signature   TEXT NOT NULL,
            user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id),
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};
/////

dbReset();
setTimeout(() => {
    fakeUsers();
    setTimeout(() => {
        fakeProfiles();
        setTimeout(() => {
            fakeSignature();
        }, 3000);
    }, 3000);
}, 3000);

/////

fakeUsers = () => {
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
};

fakeProfiles = () => {
    db.addProfile(
        25,
        "NYC",
        "http://seinfeldscripts.com/seinfeld-george.html",
        1
    )
        .then((results) => {
            console.log("a new profile was added!");
        })
        .catch((err) => {
            console.log("error in POST /profile", err);
        });

    db.addProfile(
        "",
        "NYC",
        "http://seinfeldscripts.com/seinfeld-jerry.html",
        2
    )
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
};

fakeSignature = () => {
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
            console.log("****finished creating new database****");
        })
        .catch((err) => {
            console.log("error in POST /petition addSignature()", err);
        });
};
