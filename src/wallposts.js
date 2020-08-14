import React, { useState, useEffect } from "react";
import axios from "./axios";
//import { useDispatch, useSelector } from "react-redux";
//import { sendPost } from "./actions";

export default function Wallposts(props) {
    //console.log("props: ", props);
    //const dispatch = useDispatch();
    const [wallInput, setWallInput] = useState("");
    //const inputRef = useRef("");

    const content = (e) => {
        setWallInput(e.target.value);
    };

    //console.log("wallInput: ", wallInput);

    function newPost() {
        //dispatch(sendPost(inputRef.current.value));
        //setUserInput("");
        axios.post(`/post/user/${props.id}`, { wallInput });
        setWallInput("");
    }

    function checkEnter(e) {
        if (e.keyCode === 13) {
            newPost();
        }
    }
    return (
        <div className="wall_container">
            <h1>wall posts sanity check</h1>
            <textarea
                className="wall_input"
                type="text"
                onChange={content}
                onKeyDown={(e) => checkEnter(e)}
            ></textarea>
            <button
                onClick={() => {
                    newPost();
                }}
            >
                Send
            </button>
        </div>
    );
}
