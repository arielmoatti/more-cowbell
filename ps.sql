DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles(
    id          SERIAL PRIMARY KEY,
    age         INT,
    city        VARCHAR(255),
    url         VARCHAR(255),
    user_id     INT NOT NULL REFERENCES users(id)
);

DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures (
    id SERIAL   PRIMARY KEY,    
    signature   TEXT NOT NULL,
    user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);