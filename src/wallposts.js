import React, { useState, useEffect } from "react";
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
    let [content, setContent] = useState("");

    //const inputRef = useRef("");

    content = (e) => {
        setWallInput(e.target.value);
    };

    useEffect(() => {
        //component mounted: get wall posts
        axios.get(`/post/user/${props.id}`).then(({ data }) => {
            console.log("data in get Post history", data);
            setWallposts(data.rows);
            setDelButton(data.deleteButton);
        });
    }, []);

    //console.log("wallInput: ", wallInput);

    function newPost() {
        //dispatch(sendPost(inputRef.current.value));
        axios.post(`/post/user/${props.id}`, { wallInput }).then(({ data }) => {
            console.log("data after sending post back to FE: ", data);

            if (data.emptyPost) {
                setError(true);
            }
            console.log("state posts before adding new post: ", wallposts);
            setWallposts((wallposts) => [...wallposts, data.rows]);
        });
        console.log("state posts after adding new post: ", wallposts);
        setContent("");
    }

    function checkEnter(e) {
        if (e.keyCode === 13) {
            newPost();
        }
        setContent("");
    }
    return (
        <div className="wall_container">
            <h1>wall posts sanity check</h1>
            {error && (
                <div className="error">Wall posts must have content!</div>
            )}
            <textarea
                className="wall_input"
                type="text"
                onChange={content}
                onKeyDown={(e) => checkEnter(e)}
                //rows="10"
            ></textarea>
            <button
                onClick={() => {
                    newPost();
                }}
            >
                Send
            </button>
            <div className="posts_container">
                {wallposts &&
                    wallposts.map((post, i) => {
                        return (
                            <div className="post" key={i}>
                                {delButton && <button>remove</button>}

                                <Link to={`/user/${post.sender_id}`}>
                                    <img id="post_img" src={post.url} />
                                    <h5 id="post_name">
                                        {post.first + " " + post.last}{" "}
                                    </h5>
                                </Link>
                                <p id="content">{post.content}</p>
                                <p id="post_ts">{post.ts}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
