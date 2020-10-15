const express = require("express");
const app = express();

app.use(express.static("./public"));

app.get("/", (req, res) => {
    console.log("get request to / route has just happend");
    res.end();
});

//
//
//
//
//

app.listen(8080, () => console.log("petition is listening..."));
