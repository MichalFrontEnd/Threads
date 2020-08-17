import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
//import { useDispatch, useSelector } from "react-redux";
//import { sendPost } from "./actions";

export default function Wallposts(props) {
    //console.log("props: ", props);
    //const dispatch = useDispatch();
    const [wallInput, setWallInput] = useState("");
    const [error, setError] = useState(false);
    const [wallposts, setWallposts] = useState([]);
    const [delButton, setDelButton] = useState(false);
    const [modalVis, setModalVis] = useState(false);

    //const inputRef = useRef("");

    //content = (e) => {
    //    setWallInput(e.target.value);
    //};
    //function toggleModal() {
    //    setModalVis(!modalVis);
    //}

    useEffect(() => {
        //component mounted: get wall posts
        axios.get(`/post/user/${props.id}`).then(({ data }) => {
            //console.log("data in get Post history", data);
            setWallposts(data.rows);
            setDelButton(data.deleteButton);
        });
    }, [wallInput]);

    //console.log("wallInput: ", wallInput);

    function newPost() {
        //dispatch(sendPost(inputRef.current.value));
        axios.post(`/post/user/${props.id}`, { wallInput }).then(({ data }) => {
            //console.log("data after sending post back to FE: ", data);

            if (data.emptyPost) {
                setError(true);
            }
            //console.log("state posts before adding new post: ", wallposts);
            setWallposts((wallposts) => [...wallposts, data.rows]);
            setWallInput("");
        });
        //console.log("state posts after adding new post: ", wallposts);
    }

    function checkEnter(e) {
        if (e.keyCode === 13) {
            newPost();
        }
    }

    function removePost(e) {
        //console.log("remove this id?", e.target.name);
        const post_id = e.target.name;
        axios
            .post("/deletepost", { post_id })
            .then(({ data }) => {
                //console.log("data in removePost: ", data);
                setWallposts(data.rows);
            })
            .catch((err) => {
                console.log("error in removePost: ", err);
            });
    }

    return (
        <div className="wall_container">
            <div className="post_input">
                <h1>What&apos;s on your mind?</h1>
                {error && (
                    <div className="error">Wall posts must have content!</div>
                )}
                <textarea
                    className="wall_input"
                    type="text"
                    value={wallInput}
                    onChange={(e) => setWallInput(e.target.value)}
                    onKeyDown={(e) => checkEnter(e)}
                    //rows="10"
                ></textarea>
                <button
                    onClick={() => {
                        newPost();
                    }}
                >
                    Post
                </button>
            </div>
            <div className="posts_container">
                {wallposts &&
                    wallposts.map((post, i) => {
                        return (
                            <div className="post" key={i}>
                                {delButton && (
                                    <button
                                        name={post.post_id}
                                        onClick={(e) => {
                                            setModalVis(!modalVis);
                                        }}
                                    >
                                        remove
                                    </button>
                                )}

                                <Link to={`/user/${post.sender_id}`}>
                                    <img
                                        id="post_img"
                                        src={
                                            post.url ||
                                            "/images/defaultdesat.jpg"
                                        }
                                    />
                                    <h4 id="post_name">
                                        {post.first + " " + post.last}{" "}
                                    </h4>
                                </Link>
                                <p id="content">{post.content}</p>
                                <p id="post_ts">{post.ts}</p>
                                {modalVis && (
                                    <div
                                        className="overlay"
                                        onClick={(e) => {
                                            setModalVis(!modalVis);
                                        }}
                                    >
                                        <div className="post_del">
                                            <h5>
                                                Are you sure you want to delete
                                                this post?
                                            </h5>
                                            <button
                                                onClick={(e) => {
                                                    setModalVis(!modalVis);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                name={post.post_id}
                                                onClick={(e) => {
                                                    removePost(e);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
