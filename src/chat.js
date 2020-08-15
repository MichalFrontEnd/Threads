import * as io from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "./actions";
import { Link } from "react-router-dom";

//const elemRef = useRef();

export default function Chat() {
    const dispatch = useDispatch();
    const inputRef = useRef("");
    const chatWindowRef = useRef();
    //let [chatInput, setChatInput] = useState("");

    const history = useSelector((state) => state.history);

    //const msg = useSelector((state) => state.msg);
    const scrollToBottom = () => {
        chatWindowRef.current.scrollTop =
            chatWindowRef.current.scrollHeight -
            chatWindowRef.current.clientHeight;
    };
    //console.log("msg: ", msg);
    //console.log("history: ", history);
    useEffect(() => {
        scrollToBottom();
    });

    const chatInput = (e) => {
        inputRef.current.value = e.target.value;
    };

    function newMessage() {
        dispatch(sendMessage(inputRef.current.value));
        //setUserInput("");
        inputRef.current.value = "";
    }

    function checkEnter(e) {
        if (e.keyCode === 13) {
            newMessage();
        }
    }

    return (
        <div className="chat_layout">
            <h1>Chat</h1>
            <div className="chat_window" ref={chatWindowRef}>
                {history &&
                    history.map((history, i) => {
                        return (
                            <div className="chat_msg" key={i}>
                                <img src={history.url} />
                                <h5>
                                    <Link to={`/user/${history.id}`}>
                                        {history.first} {history.last}
                                    </Link>

                                    {`  on ${history.ts}`}
                                </h5>
                                <p>{history.message}</p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                className="chat_input"
                type="text"
                onChange={(e) => chatInput(e)}
                ref={inputRef}
                onKeyDown={(e) => checkEnter(e)}
            ></textarea>
            <button
                onClick={() => {
                    newMessage();
                }}
            >
                SEND
            </button>
            <div></div>
        </div>
    );
}
