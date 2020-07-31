const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");
app.use(compression());

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

app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//petition reg
app.post("/register", (req, res) => {
    //console.log("req.body: ", req.body);
    const { first, last, email } = req.body;
    hash(req.body.pwd)
        .then((hashedPwd) => {
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

                    //if (err.code === "23505") {
                    //    res.render("reg", {
                    //        layout: "main",
                    //        duplicateKey: true,
                    //    });
                    //} else {
                    //    res.render("reg", {
                    //        layout: "main",
                    //        error: true,
                    //    });
                    //}
                });
        })
        .catch((err) => {
            console.log("err in password hashing: ", err);
            res.json({ regSuccess: false });
        });
});

app.listen(8080, function () {
    console.log("Thready, steady, go.");
});
