let spicedPg = require("spiced-pg");
let db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

exports.countSigners = () => {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};

exports.getCurrentSigner = (userId) => {
    return db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
};

exports.getSignature = (userId) => {
    return db.query(`SELECT signature FROM signatures WHERE user_id=$1`, [
        userId,
    ]);
};

exports.addSignature = (userId, canvaSignature) => {
    return db.query(
        `
        INSERT INTO signatures (user_id, signature)
        VALUES ($1, $2)
        `,
        [userId, canvaSignature]
    );
};

exports.createUser = (firstname, lastname, email, hashedPw) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [firstname, lastname, email, hashedPw]
    );
};

exports.addProfile = (age, city, url, userId) => {
    return db.query(
        `
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        `,
        [age || null, city, url, userId]
    );
};
exports.getUserDataByEmail = (inputEmail) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [inputEmail]);
};

exports.getSigners = () => {
    return db.query(`
    SELECT signatures.signature, users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url    
    FROM signatures
    JOIN users
    ON users.id = signatures.user_id
    JOIN user_profiles
    ON users.id = user_profiles.user_id;
    `);
};

exports.getProfile = (userId) => {
    return db.query(
        `
    SELECT users.first, users.last, users.email, user_profiles.age, user_profiles.city, user_profiles.url    
    FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE user_id=$1`,
        [userId]
    );
};

exports.updateUserWithoutPW = (first, last, email, userId) => {
    return db.query(
        `
    UPDATE users 
    SET first = $1, last=$2, email=$3
    WHERE id = $4
    RETURNING *
    `,
        [first, last, email, userId]
    );
};

exports.updateUserPassword = (hashedPw, userId) => {
    return db.query(
        `
    UPDATE users 
    SET password = $1
    WHERE id = $2
    `,
        [hashedPw, userId]
    );
};

exports.upsertProfile = (age, city, url, userId) => {
    return db.query(
        `
    INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3;
    `,
        [age || null, city, url, userId]
    );
};

exports.deleteSignature = (userId) => {
    return db.query(
        `
        DELETE
        FROM signatures
        WHERE user_id = $1;        
        `,
        [userId]
    );
};
/*
exports.getTimestamp = () => {
    let date = db.query(`SELECT EXTRACT (DAY FROM created) FROM signatures`);
    date += db.query(`SELECT EXTRACT (MONTH FROM created) FROM signatures`);
    date += db.query(`SELECT EXTRACT (YEAR FROM created) FROM signatures`);
    return date;
};
// return db.query(`SELECT EXTRACT (DAY FROM created) FROM signatures`);
*/
