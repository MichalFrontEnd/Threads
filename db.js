const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/caper-smedia"
);

module.exports.logCreds = (first, last, email, pwd) => {
    let q =
        "INSERT INTO users (first, last, email, pwd) VALUES ($1, $2, $3, $4) RETURNING *";

    let params = [first, last, email, pwd];
    //console.log("params in logCreds:", params);
    return db.query(q, params);
};

module.exports.getPwd = function (email) {
    let q = "SELECT first, pwd, id WHERE email = $1";

    let params = [email];
    console.log("q, params: ", q, params);
    return db.query(q, params);
};
