const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/caper-smedia"
);

module.exports.logCreds = (first, last, email, pwd) => {
    let q =
        "INSERT INTO users (first, last, email, pwd) VALUES ($1, $2, $3, $4) RETURNING *";

    let params = [first, last, email, pwd];
    console.log("params in logCreds:", params);
    return db.query(q, params);
};
