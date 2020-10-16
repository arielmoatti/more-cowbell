var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.getSigners = () => {
    return db.query(`SELECT * FROM signatures`);
};

module.exports.getCurrentSigner = (cookie) => {
    return db.query(`SELECT * FROM signatures WHERE id=${cookie}`);
};

module.exports.addSigner = (firstName, lastName, signature) => {
    return db.query(
        `
        INSERT INTO signatures (first, last, signature)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [firstName, lastName, signature]
    );
};
