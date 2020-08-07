-- psql caper-smedia -f  sql/db.sql
--sudo service postgresql start
--
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS pwd_codes CASCADE;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK(first !=''),
    last VARCHAR(255) NOT NULL CHECK(last !=''),
    email VARCHAR(255) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    bio VARCHAR(255),
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pwd_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    code VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friendships CASCADE;
CREATE TABLE friendships( 
     id SERIAL PRIMARY KEY,
     sender_id INT REFERENCES users(id) NOT NULL,
     rec_id INT REFERENCES users(id) NOT NULL,
     accepted BOOLEAN DEFAULT false);
