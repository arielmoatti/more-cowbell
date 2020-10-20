var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.getSigners = () => {
    return db.query(`SELECT * FROM users`);
};

module.exports.countSigners = () => {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};

module.exports.getCurrentSigner = (userId) => {
    return db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
};

module.exports.getSignature = (userId) => {
    return db.query(`SELECT signature FROM signatures WHERE user_id=$1`, [
        userId,
    ]);
};

module.exports.addSignature = (userId, canvaSignature) => {
    return db.query(
        `
        INSERT INTO signatures (user_id, signature)
        VALUES ($1, $2)
        `,
        [userId, canvaSignature]
    );
};

module.exports.createUser = (firstname, lastname, email, hashedPw) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [firstname, lastname, email, hashedPw]
    );
};

module.exports.addProfile = (age, city, url, userId) => {
    return db.query(
        `
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        `,
        [age, city, url, userId]
    );
};
module.exports.getPasswordByEmail = (inputEmail) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [inputEmail]);
    // return db.query(`SELECT * FROM users WHERE email=$1`, [inputEmail]);
};

/*
module.exports.getTimestamp = () => {
    let date = db.query(`SELECT EXTRACT (DAY FROM created) FROM signatures`);
    date += db.query(`SELECT EXTRACT (MONTH FROM created) FROM signatures`);
    date += db.query(`SELECT EXTRACT (YEAR FROM created) FROM signatures`);
    return date;
};
// return db.query(`SELECT EXTRACT (DAY FROM created) FROM signatures`);
*/
