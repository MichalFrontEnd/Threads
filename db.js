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
    let q = "SELECT first, pwd, id FROM users WHERE email = $1";

    let params = [email];
    //console.log("q, params: ", q, params);
    return db.query(q, params);
};

module.exports.storeCode = (email, code) => {
    let q = "INSERT INTO pwd_codes (email, code) VALUES ($1, $2)";
    let params = [email, code];
    //console.log("params in storeCode: ", params);
    return db.query(q, params);
};

module.exports.checkCode = function (email) {
    let q =
        "SELECT * FROM pwd_codes WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' ORDER BY id DESC LIMIT 1";
    //WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';
    let params = [email];
    //console.log("params in checkCode: ", params);
    return db.query(q, params);
};

module.exports.updatePassword = (email, pwd) => {
    let q = "UPDATE users SET pwd = $2 WHERE email = $1";
    let params = [email, pwd];
    //console.log("params in updatePassword: ", params);
    return db.query(q, params);
};

module.exports.getUserInfo = function (id) {
    let q = "SELECT first, last, bio, url FROM users WHERE id = $1";

    let params = [id];
    //console.log("params: ", params);
    return db.query(q, params);
};

module.exports.newProfileImage = (id, url) => {
    let q = "UPDATE users SET url =$2 WHERE id=$1 RETURNING url";
    let params = [id, url];
    //console.log("params: ", params);
    return db.query(q, params);
};
