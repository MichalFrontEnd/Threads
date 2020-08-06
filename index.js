const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");
app.use(compression());
const { sendEmail } = require("./ses");

app.use(
    cookieSession({
        secret: "Let's get artsy!",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.static("./public"));
//app.use(express.static("./"));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//app.use(require("csurf")());

//app.use((req, res, next) => {
//    res.cookie("myToken", req.csrfToken());
//    next();
//});

///////FIle UPLOAD BOILERPLATE DON'T TOUCH!!//////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
//////END BOILERPLATE///////////

//node bundle-server.js
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.user_id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//petition reg
app.post("/register", (req, res) => {
    //console.log("req.body: ", req.body);
    const { first, last, email } = req.body;
    hash(req.body.pwd).then((hashedPwd) => {
        db.logCreds(first, last, email, hashedPwd)
            .then((results) => {
                //console.log("results.rows[0]: ", results.rows[0]);
                ////storing the user_id and name in the cookie:
                req.session.user_id = results.rows[0].id;
                req.session.first = req.body.first;
                res.json({ data: results.rows[0], regSuccess: true });
            })
            .catch((err) => {
                console.log("err in logCreds in POST /reg: ", err);

                //**********in petition I sent an error for existing email.*************

                if (err.code === "23505") {
                    res.json({ emailExists: true });
                } else {
                    res.json({ regSuccess: false });
                }
            });
    });
});

app.post("/login", (req, res) => {
    //getting the hashed pwd from the db using the email.
    //console.log("req.body in login: ", req.body);
    if (req.body.email) {
        //console.log("req.body.email: ", req.body.email);
        db.getPwd(req.body.email)
            .then((results) => {
                //console.log("results in getPwd: ", results);
                if (!results.rows[0].pwd) {
                    res.json({ loginSuccess: false });
                } else {
                    //comparing the user input pwd and the hashed pwd
                    compare(req.body.pwd, results.rows[0].pwd)
                        .then((matchValue) => {
                            if (matchValue === true) {
                                //req.session.email = req.body.email;
                                //req.session.first = results.rows[0].first;
                                req.session.user_id = results.rows[0].id;
                                res.json({
                                    loginSuccess: true,
                                    data: results.rows[0],
                                });
                            } else {
                                res.json({ loginSuccess: false });
                            }
                        })
                        .catch((err) => {
                            console.log("error in compare", err);
                            res.json({ loginSuccess: false });
                        });
                }
            })
            .catch((err) => {
                console.log("err in Post /login getting creds: ", err);
                res.json({ loginSuccess: false });
            });
    } else {
        res.json({ loginSuccess: false });
    }
});

app.post("/checkemail", (req, res) => {
    if (req.body.email) {
        db.getPwd(req.body.email)
            .then((results) => {
                //console.log("results in checkemail: ", results.rows[0]);

                const cryptoRandomString = require("crypto-random-string");
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.storeCode(req.body.email, secretCode)
                    .then(() => {
                        sendEmail(
                            "miyako.front@gmail.com",
                            results.rows[0].first,
                            secretCode,
                            "Reset password"
                        );
                        res.json({
                            checkEmailSuccess: true,
                            //data: results.rows[0],
                        });
                    })
                    .catch((err) => {
                        console.log("error in storeCode", err);
                        res.json({ checkEmailSuccess: false });
                    });
            })
            .catch((err) => {
                console.log("err in Post /checkemail: ", err);
                res.json({ checkEmailSuccess: false });
            });
    }
});

app.post("/checkcode", (req, res) => {
    if (req.body.code) {
        db.checkCode(req.body.email)
            .then((results) => {
                if (req.body.code === results.rows[0].code) {
                    //console.log("it's a match!");
                    res.json({ checkCodeSuccess: true });
                } else {
                    //console.log("it's not a match :/");
                    res.json({ checkCodeSuccess: false });
                }
            })
            .catch((err) => {
                console.log("err in Post /checkcode: ", err);
                res.json({ checkCodeSuccess: false });
            });
    } else {
        res.json({ checkCodeSuccess: false });
    }
});

app.post("/setnewpwd", (req, res) => {
    //console.log("req.body in setnewpwd: ", req.body);
    if (req.body.pwd) {
        hash(req.body.pwd).then((hashedPwd) => {
            db.updatePassword(req.body.email, hashedPwd)
                .then(() => {
                    //console.log("Password changed successfuly");
                    res.json({ updatePwdSuccess: true });
                })
                .catch((err) => {
                    console.log("error in updatePassword", err);
                });
        });
    } else {
        res.json({ updatePwdSuccess: false });
    }
});

app.get("/user", (req, res) => {
    db.getUserInfo(req.session.user_id)
        .then((results) => {
            res.json({ data: results.rows[0] });
        })
        .catch((err) => {
            console.log("error in getting user info", err);
        });
});

app.post("/photoupld", uploader.single("file"), s3.upload, (req, res) => {
    //console.log("is this working?");
    //console.log("req.file in photoupld: ", req.file);
    const { filename } = req.file;
    const url = s3Url + filename;

    db.newProfileImage(req.session.user_id, url)
        .then((results) => {
            //console.log("results in photoupld: ", results.rows[0].url);
            res.json({ data: results.rows[0].url });
        })
        .catch((err) => {
            console.log("error in photoupld :", err);
        });
});

app.post("/updatebio", (req, res) => {
    console.log("req.body in updatebio: ", req.body);

    db.bioUpdate(req.session.user_id, req.body.bio)
        .then((results) => {
            //console.log("results.rows[0] in updatebio: ", results.rows[0]);
            res.json({ data: results.rows[0].bio });
        })
        .catch((err) => {
            console.log("error in updatebio :", err);
        });
});

app.get("/switch/user/:id", (req, res) => {
    if (req.params.id == req.session.user_id) {
        return res.json({ sameUser: true });
    }
    //console.log("req.params: ", req.params.id);
    db.getUserInfo(req.params.id)
        .then((results) => {
            //console.log("results in GET ouser", results.rows[0]);
            if (!results.rows[0]) {
                res.json({ getInfoSuccess: false });
            } else {
                res.json({ data: results.rows[0], getInfoSuccess: true });
            }
        })
        .catch((err) => {
            console.log("error in GET ouser", err);
            res.json({ getInfoSuccess: false });
            //send error message if failed
        });
});

app.get("/showusers", (req, res) => {
    db.lastUsers()
        .then((results) => {
            //console.log("results in lastUsers", results.rows);
            res.json({ data: results.rows });
        })
        .catch((err) => {
            console.log("error in showusers", err);
        });
});

app.get("/search:search", (req, res) => {
    console.log("req.params in search: ", req.params.search);
    if (req.params.search) {
        db.searchUser(req.params.search)
            .then((results) => {
                //console.log("results in search", results.rows);
                if (results.rows.length == 0) {
                    res.json({ searchSuccess: false });
                } else {
                    ///use list.sort to reorganize the list
                    results.rows.sort(function (a, b) {
                        return a.last - b.last, a.first - b.first;
                    });
                    //console.log("results after sort", results.rows);
                    res.json({ data: results.rows, searchSuccess: true });
                }
            })
            .catch((err) => {
                console.log("error in search", err);
                res.json({ searchSuccess: false });
            });
    } else {
        console.log("no input yet");
        res.json({ searchSuccess: true });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/*");
});

app.get("*", function (req, res) {
    if (!req.session.user_id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("Thready, steady, go.");
});
