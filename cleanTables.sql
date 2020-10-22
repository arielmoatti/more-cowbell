
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

