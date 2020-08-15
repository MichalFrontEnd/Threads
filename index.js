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
const io = require("socket.io")(server, { origins: "localhost:3000" });
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

//app.use((req, res, next) => {
//    console.log("is this working?");
//    console.log("req.url test: ", req.url);
//    next();
//});

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
                            req.body.email,
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
    //console.log("req.body in updatebio: ", req.body);

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
    //console.log("req.params in search: ", req.params.search);
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
        //console.log("no input yet");
        res.json({ searchSuccess: true });
    }
});

app.get("/friendreq/:id", (req, res) => {
    //console.log("req.params.id in friendreq: ", req.params.id);
    //console.log("req.session.user_id in friendreq: ", req.session.user_id);
    const viewer = req.session.user_id;
    const viewee = req.params.id;
    //console.log("page mounted before db q");
    ///if the results are empty it means there is no relationship. a relationship makes a row.
    db.checkFriendship(viewer, viewee)
        .then((results) => {
            //console.log("results in checkFriendship", results.rows);

            //console.log(
            //    "results.rows[0].length > 0 : ",
            //    results.rows.length > 0
            //);
            //console.log(
            //    "results.rows[0].accepted == false: ",
            //    results.rows[0].accepted == false
            //);
            if (results.rows.length === 0) {
                res.json({ button: "Connect!" });
            } else if (
                results.rows.length > 0 &&
                results.rows[0].accepted == true
            ) {
                //console.log(
                //    "results.rows in button-to-disconnect: ",
                //    results.rows
                //);
                //console.log("button should be disconnect");
                res.json({ button: "Disconnect", friends: true });
            } else if (
                results.rows.length > 0 &&
                results.rows[0].accepted == false
            ) {
                if (req.params.id == results.rows[0].sender_id) {
                    res.json({
                        button: "Cancel",
                    });
                } else if (req.params.id == results.rows[0].rec_id) {
                    res.json({ button: "Accept" });
                }
            }
        })
        .catch((err) => {
            console.log("error in checkFriendship", err);
        });
});

app.post("/friendreq/:status", (req, res) => {
    //console.log("req.params in friendreq/status: ", req.params);

    //console.log("req.body in friendreq/status: ", req.body);
    const viewer = req.session.user_id;
    const viewee = req.body.id;
    ////have if that will check the params to know which db query to do:

    //If sent friend request
    if (req.params.status == "Connect!") {
        db.friendRequest(viewer, viewee)
            .then((results) => {
                //console.log("results in checkFriendship", results.rows);
                res.json({ button: "Cancel" });
            })
            .catch((err) => {
                console.log("error in friendreq/:status", err);
            });
    } else if (req.params.status == "Accept") {
        //console.log("Do I actually know I'm here?!");
        //console.log("viewee: ", viewee);
        //console.log("req.params.id: ", req.params.id);
        db.acceptRequest(viewer, viewee)
            .then((results) => {
                //console.log("did I accept friendship?");
                //console.log("results in acceptFriendship", results.rows);
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
            //console.log("results in deleteFriendship: ", results.rows);
            //console.log("DId it delete?");
            res.json({ button: "Connect!" });
        });
    }
});

app.get("/groupies", (req, res) => {
    //console.log("friends sanity check");
    db.checkGroupies(req.session.user_id)
        .then((results) => {
            //console.log("results in checkGroupies: ", results.rows);
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
    console.log("viewer: ", viewer);
    console.log("viewee: ", viewee);
    //db.checkFriendship = (viewer, viewee).then((results)=> {

    //})

    db.getPosts(viewee).then(({ rows }) => {
        console.log("results in getposts: ", rows);
        if (viewee == viewer) {
            res.json({ rows: rows, deleteButton: true });
            //console.log("viewee==viewer: ", viewee == viewer);
        } else {
            res.json({ rows: rows, deleteButton: false });
        }
    });
});

app.post("/post/user/:id", (req, res) => {
    //console.log("req.body: ", req.body);
    //console.log("req.params.id: ", req.params.id);
    const poster = req.session.user_id;
    let postee;
    if (req.params.id === "undefined") {
        postee = poster;
    } else {
        postee = req.params.id;
    }
    //console.log("poster: ", poster);
    //console.log("postee: ", postee);
    db.addNewPost(poster, postee, req.body.wallInput)
        .then((results) => {
            //console.log(results.rows[0]);
            //const lastPostId = results.rows[0].id;
            db.getPosts(postee)
                .then((results) => {
                    //console.log(
                    //    "results.rows in displayPost: ",
                    //    results.rows[0]
                    //);
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
            //console.log('err.code==="23514": ', err.code === "23514");
            if (err.code === "23514") {
                res.json({ emptyPost: true });
            }
        });

    //const viewer = req.session.user_id;
    //const viewee = req.body.id;
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

server.listen(3000, function () {
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
                //console.log("no messages!");
                socket.emit("chatHistory", "no messages!");
            } else {
                //console.log("results.rows in getChatHistory", rows);
                socket.emit("chatHistory", rows.reverse());
            }
        })
        .catch((err) => {
            console.log("error in getChatHistory: ", err);
        });
    socket.on("chatInput", (data) => {
        //console.log("data in chatInput: ", data);
        //console.log("user_id: ", user_id);
        db.storeMessage(user_id, data).then((results) => {
            //console.log("results in chatInput: ", results);
            //const lastMsgId = results.rows[0].id;
            //console.log("lastMsgId: ", lastMsgId);
            db.displayMessage().then(({ rows }) => {
                //console.log("rows in displayMessages", rows);
                io.emit("displayMsg", rows[0]);
            });
        });
    });
    //console.log("user_id sanity check: ", user_id);
    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now DISCONNECTED`);
    });
});
