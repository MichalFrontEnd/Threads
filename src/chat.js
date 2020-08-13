import * as io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";

export default function Search(props) {
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");

    //will have to do something else when there are actual results
    const history = useSelector((state) => state.history);

    useEffect(() => {}, []);

    setChatInput(e.target.value);
    console.log("chatInput: ", chatInput);

    return (
        <div className="chat_layout">
            <h1>Chat Sanity Check</h1>
            <div className="chat_window">{history}</div>
            <textarea
                className="chat_input"
                type="text"
                onChange={(e) => chatInput(e)}
            ></textarea>
            <button
            //onClick={(e) =>
            //    socket.emit("yo", { msg: "I just sent a message!" })
            //}
            >
                Submit
            </button>
        </div>
    );
}
