const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");
const { sendEmail } = require("./ses");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:3000 https://threadssn.herokuapp.com/:*",
});

const cookieSessionMW = cookieSession({
    secret: "Let's get artsy!",
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(compression());

app.use(cookieSessionMW);
io.use(function (socket, next) {
    cookieSessionMW(socket.request, socket.request.res, next);
});

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

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


//app.use(require("csurf")());

//app.use((req, res, next) => {
//    res.cookie("myToken", req.csrfToken());
//    next();
//});

app.get("/welcome", (req, res) => {
    if (req.session.user_id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//reg
app.post("/register", (req, res) => {
    const { first, last, email } = req.body;
    hash(req.body.pwd).then((hashedPwd) => {
        db.logCreds(first, last, email, hashedPwd)
            .then((results) => {
                ////storing the user_id and name in the cookie:
                req.session.user_id = results.rows[0].id;
                req.session.first = req.body.first;
                res.json({ data: results.rows[0], regSuccess: true });
            })
            .catch((err) => {
                console.log("err in logCreds in POST /reg: ", err);

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
    if (req.body.email) {
        db.getPwd(req.body.email)
            .then((results) => {
                if (!results.rows[0].pwd) {
                    res.json({ loginSuccess: false });
                } else {
                    //comparing the user input pwd and the hashed pwd
                    compare(req.body.pwd, results.rows[0].pwd)
                        .then((matchValue) => {
                            if (matchValue === true) {
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
                const cryptoRandomString = require("crypto-random-string");
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.storeCode(req.body.email, secretCode)
                    .then(() => {
                        sendEmail(
                            //"miyako.front@gmail.com",
                            req.body.email,
                            results.rows[0].first,
                            secretCode,
                            "Reset password"
                        );
                        res.json({
                            checkEmailSuccess: true,
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
                    res.json({ checkCodeSuccess: true });
                } else {
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
    if (req.body.pwd) {
        hash(req.body.pwd).then((hashedPwd) => {
            db.updatePassword(req.body.email, hashedPwd)
                .then(() => {
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
    const { filename } = req.file;
    const url = s3Url + filename;

    db.newProfileImage(req.session.user_id, url)
        .then((results) => {
            res.json({ data: results.rows[0].url });
        })
        .catch((err) => {
            console.log("error in photoupld :", err);
        });
});

app.post("/updatebio", (req, res) => {
    db.bioUpdate(req.session.user_id, req.body.bio)
        .then((results) => {
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
    db.getUserInfo(req.params.id)
        .then((results) => {
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
            res.json({ data: results.rows });
        })
        .catch((err) => {
            console.log("error in showusers", err);
        });
});

app.get("/search:search", (req, res) => {
    if (req.params.search) {
        db.searchUser(req.params.search)
            .then((results) => {
                if (results.rows.length == 0) {
                    res.json({ searchSuccess: false });
                } else {
                    ///use list.sort to reorganize the list
                    results.rows.sort(function (a, b) {
                        return a.last - b.last, a.first - b.first;
                    });
                    res.json({ data: results.rows, searchSuccess: true });
                }
            })
            .catch((err) => {
                console.log("error in search", err);
                res.json({ searchSuccess: false });
            });
    } else {
        res.json({ searchSuccess: true });
    }
});

app.get("/friendreq/:id", (req, res) => {
    const viewer = req.session.user_id;
    const viewee = req.params.id;
    ///if the results are empty it means there is no relationship. a relationship makes a row.
    db.checkFriendship(viewer, viewee)
        .then((results) => {
            if (results.rows.length === 0) {
                res.json({ button: "Connect!" });
            } else if (
                results.rows.length > 0 &&
                results.rows[0].accepted == true
            ) {
                res.json({ button: "Disconnect", friends: true });
            } else if (
                results.rows.length > 0 &&
                results.rows[0].accepted == false
            ) {
                if (viewer == results.rows[0].sender_id) {
                    res.json({
                        button: "Cancel",
                    });
                } else if (viewer == results.rows[0].rec_id) {
                    res.json({ button: "Accept" });
                }
            }
        })
        .catch((err) => {
            console.log("error in checkFriendship", err);
        });
});

app.post("/friendreq/:status", (req, res) => {
    const viewer = req.session.user_id;
    const viewee = req.body.id;
    ////have if that will check the params to know which db query to do:

    //If sent friend request
    if (req.params.status == "Connect!") {
        db.friendRequest(viewer, viewee)
            .then((results) => {
                res.json({ button: "Cancel" });
            })
            .catch((err) => {
                console.log("error in friendreq/:status", err);
            });
    } else if (req.params.status == "Accept") {
        db.acceptRequest(viewer, viewee)
            .then((results) => {
                res.json({ button: "Disconnect", id: viewee });
            })
            .catch((err) => {
                console.log("error in acceptFriendship", err);
            });
    } else if (
        req.params.status == "Disconnect" ||
        req.params.status == "Cancel"
    ) {
        db.deleteFriendship(viewer, viewee).then((results) => {
            res.json({ button: "Connect!" });
        });
    }
});

app.get("/groupies", (req, res) => {
    db.checkGroupies(req.session.user_id)
        .then((results) => {
            res.json({ data: results.rows });
        })
        .catch((err) => {
            console.log("error on CheckGroupies", err);
        });
});

app.get("/post/user/:id", (req, res) => {
    const viewer = req.session.user_id;
    let viewee;
    if (req.params.id === "undefined") {
        viewee = viewer;
    } else {
        viewee = req.params.id;
    }

    db.getPosts(viewee).then(({ rows }) => {
        if (viewee == viewer) {
            res.json({ rows: rows, deleteButton: true });
        } else {
            res.json({ rows: rows, deleteButton: false });
        }
    });
});

app.post("/post/user/:id", (req, res) => {
    const poster = req.session.user_id;
    let postee;
    if (req.params.id === "undefined") {
        postee = poster;
    } else {
        postee = req.params.id;
    }
    db.addNewPost(poster, postee, req.body.wallInput)
        .then((results) => {
            db.getPosts(postee)
                .then((results) => {
                    if (poster == postee) {
                        res.json({ rows: results.rows[0], deleteButton: true });
                    } else {
                        res.json({
                            rows: results.rows[0],
                            deleteButton: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log("error in displayPost: ", err);
                });
        })
        .catch((err) => {
            console.log("error in addNewPost: ", err);
            if (err.code === "23514") {
                res.json({ emptyPost: true });
            }
        });
});

app.post("/deletepost", (req, res) => {
    db.deletePost(req.body.post_id)
        .then(({ rows }) => {
            db.getPosts(req.session.user_id)
                .then(({ rows }) => {
                    res.json({ rows: rows, deleteButton: true });
                })
                .catch((err) => {
                    console.log("err in regetting posts", err);
                });
        })
        .catch((err) => {
            console.log("err in deletePost: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/*");
});

app.get("*", function (req, res) {
    if (!req.session.user_id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function () {
    console.log("Thready, steady, go.");
});

io.on("connection", (socket) => {
    console.log(`socket with the id ${socket.id} is now CONNECTED`);

    const { user_id } = socket.request.session;

    if (!user_id) {
        return socket.disconnect();
    }

    db.getChatHistory()
        .then(({ rows }) => {
            if (rows.length === 0) {
                socket.emit("chatHistory", "no messages!");
            } else {
                socket.emit("chatHistory", rows.reverse());
            }
        })
        .catch((err) => {
            console.log("error in getChatHistory: ", err);
        });
    socket.on("chatInput", (data) => {
        db.storeMessage(user_id, data).then((results) => {
            db.displayMessage().then(({ rows }) => {
                io.emit("displayMsg", rows[0]);
            });
        });
    });
    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now DISCONNECTED`);
    });
});
