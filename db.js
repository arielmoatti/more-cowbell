var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:arielmo:postgres@localhost:5432/petition");

module.exports.getSigners = () => {
    return db.query(`SELECT * FROM signatures`);
};

module.exports.addSigner = (firstName, lastName, subscribed) => {
    return db.query(
        `
        INSERT INTO signatures (first, last, signature)
        VALUES ($1, $2, $3)
        `,
        [firstName, lastName, subscribed]
    );
};
