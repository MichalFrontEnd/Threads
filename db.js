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

module.exports.getUserInfo = (id) => {
    let q = "SELECT first, last, email, bio, url FROM users WHERE id = $1";

    let params = [id];
    //console.log("params in getUserInfo: ", params);
    return db.query(q, params);
};

module.exports.newProfileImage = (id, url) => {
    let q = "UPDATE users SET url =$2 WHERE id=$1 RETURNING url";
    let params = [id, url];
    //console.log("params: ", params);
    return db.query(q, params);
};

module.exports.bioUpdate = (id, bio) => {
    let q = "UPDATE users SET bio =$2 WHERE id=$1 RETURNING bio";
    let params = [id, bio];
    //console.log("params: ", params);
    return db.query(q, params);
};

module.exports.lastUsers = () => {
    return db.query("SELECT * FROM users ORDER BY id DESC LIMIT 3");
};

module.exports.searchUser = (val) => {
    let q = "SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1";

    let params = [val + "%"];
    //console.log("params in searchUser: ", params);
    return db.query(q, params);
};

module.exports.checkFriendship = (sender_id, rec_id) => {
    let q = `SELECT * FROM friendships WHERE(rec_id = $1 AND sender_id = $2) 
    OR(rec_id = $2 AND sender_id = $1)`;

    let params = [sender_id, rec_id];
    return db.query(q, params);
};

module.exports.friendRequest = (sender_id, rec_id) => {
    let q =
        "INSERT INTO friendships (sender_id, rec_id) VALUES ($1, $2) RETURNING accepted";

    let params = [sender_id, rec_id];
    return db.query(q, params);
};

module.exports.acceptRequest = (sender_id, rec_id) => {
    let q =
        "UPDATE friendships SET accepted = true WHERE sender_id=$2 and rec_id=$1 RETURNING accepted";

    let params = [sender_id, rec_id];
    console.log("params in acceptRequest: ", params);
    return db.query(q, params);
};

module.exports.deleteFriendship = (sender_id, rec_id) => {
    let q =
        "DELETE FROM friendships WHERE sender_id=$1 AND rec_id=$2 OR rec_id = $1 AND sender_id = $2";

    let params = [sender_id, rec_id];
    //console.log("params in deleteFriendship: ", params);
    return db.query(q, params);
};

module.exports.checkGroupies = (id) => {
    const q = `
  SELECT users.id, first, last, url, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND rec_id = $1 AND sender_id = users.id)
  OR (accepted = true AND rec_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND rec_id = users.id)
`;
    let params = [id];
    return db.query(q, params);
};

module.exports.getChatHistory = () => {
    const q =
        "SELECT message, ts, first, last, url, users.id FROM chat_messages LEFT JOIN users ON users.id=chat_messages.sender_id ORDER BY chat_messages.id DESC LIMIT 10";

    return db.query(q);
};

module.exports.storeMessage = (id, msg) => {
    const q =
        "INSERT INTO chat_messages (sender_id, message) VALUES ($1, $2) RETURNING *";
    let params = [id, msg];
    //console.log("params in storeMessage: ", params);
    return db.query(q, params);
};

module.exports.displayMessage = (msg_id) => {
    const q =
        "SELECT message, ts, first, last, url, users.id FROM chat_messages LEFT JOIN users ON users.id=chat_messages.sender_id WHERE chat_messages.id=$1";

    let params = [msg_id];
    console.log("params: ", params);
    return db.query(q, params);
};

module.exports.getPosts = (posteeId) => {
    const q =
        "SELECT content, ts, first, last, url, users.id FROM wall_posts LEFT JOIN users ON users.id=wall_posts.sender_id WHERE users.id =$1 ORDER BY wall_posts.id DESC";
    let params = [posteeId];
    return db.query(q, params);
};

module.exports.addNewPost = (poster, postee, content) => {
    let q =
        "INSERT INTO wall_posts (sender_id, rec_id, content) VALUES ($1, $2, $3) RETURNING *";
    let params = [poster, postee, content];
    console.log("params in addnewPost: ", params);
    return db.query(q, params);
};

module.exports.displayPost = (post_id) => {
    const q =
        "SELECT content, ts, first, last, url, users.id FROM wall_posts LEFT JOIN users ON users.id=wall_posts.sender_id WHERE wall_posts.id=$1";

    let params = [post_id];
    console.log("params: ", params);
    return db.query(q, params);
};
