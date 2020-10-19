DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL       PRIMARY KEY,
    userid          VARCHAR,
    first           VARCHAR NOT NULL CHECK (first != ''),
    last            VARCHAR NOT NULL CHECK (last != ''),
    signature       VARCHAR NOT NULL CHECK (signature != ''),
    created         TIMESTAMP DEFAULT NOW()
);