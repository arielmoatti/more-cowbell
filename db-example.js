var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/actors");

module.exports.getActors = () => {
    return db.query(`SELECT * FROM actors`);
};

module.exports.addActor = (name, age) => {
    return db.query(
        `
        INSERT INTO actors (name, age)
        VALUES ($1, $2)
        `,
        [name, age]
    );
};
