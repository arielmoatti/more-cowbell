const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");

//~~~~~~~~~MIDDLEWARE
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static("./public"));

//~~~~ ROUTES
app.get("/", (req, res) => {
    // console.log("get request to / route has just happend");
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    res.send(`
<h1>Please sign up for my petition!</h1>
        <form method='POST' style="display: flex; flex-direction: column; justify-content: space-between; width: 20%; height: 50%;">
            <input type='text' required name='firstname' placeholder='First Name' autocomplete='off'>
            <input type='text' required name='lastname' placeholder='Last Name' autocomplete='off'>            
            <div>
                <input type="checkbox" name="subscribe"><span>Please check this box to add your acceptance</span>
            </div>
            <button> submit </submit>
        </form>
    `);
});

app.get("/signerslist", (req, res) => {
    db.getSigners()
        .then(({ rows }) => {
            console.log("results:", rows);
            // rows.forEach((signer) => {
            let signersList = "";
            for (let i = 0; i < rows.length; i++) {
                // res.send(`<h2>${rows[i].first} ${rows[i].last}</h2>`);
                signersList += `<h2>${rows[i].first} ${rows[i].last}</h2>`;
            }
            res.send(`${signersList}`);
            // });
        })
        .catch((err) => {
            console.log("error in /signerslist", err);
        });
    // res.send("check your terminal...");
});

let currentFirst,
    currentLast = "";
app.post("/petition", (req, res) => {
    const { firstname, lastname, subscribe } = req.body;
    currentFirst = firstname;
    currentLast = lastname;
    db.addSigner(`${firstname}`, `${lastname}`, `${subscribe}`)
        .then(() => {
            console.log("added new signer!");
            res.redirect("/thank-you");
            /*
            res.send(`
        <p style="font-size: 30">thank you, <span style="color: green; font-weight: bold">${firstname} ${lastname}, </span>for signing my petition!</p>
        `);
        */
        })
        .catch((err) => {
            console.log("error in POST /petition", err);
        });
});

app.get("/thank-you", (req, res) => {
    res.send(`
        <p style="font-size: 30">thank you, <span style="color: green; font-weight: bold">${currentFirst} ${currentLast}, </span>for signing my petition!</p>
        `);
});
//
//
//
//

app.listen(8080, () => console.log("petition SERVER at 8080..."));
