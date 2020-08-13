import * as io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "./actions";
//const elemRef = useRef();

export default function Chat(props) {
    const dispatch = useDispatch();
    const [userInput, setUserInput] = useState("");
    let [chatInput, setChatInput] = useState("");

    //will have to do something else when there are actual results
    const history = useSelector((state) => state.history);

    const msg = useSelector((state) => state.msg);
    //console.log("msg: ", msg);
    //console.log("history: ", history);
    useEffect(() => {}, []);
    chatInput = (e) => {
        setUserInput(e.target.value);
    };

    function newMessage() {
        dispatch(sendMessage({ userInput }));
        setChatInput("");
    }

    //console.log("userInput: ", userInput);
    //console.log("chatInput: ", chatInput);

    return (
        <div className="chat_layout">
            <h1>Chat Sanity Check</h1>
            <div className="chat_window">
                {history &&
                    history.map((history, i) => {
                        return (
                            <div className="chat_history" key={i}>
                                <img
                                    src={history.url}
                                    height="50px"
                                    width="50px"
                                />
                                <h5>
                                    {`${history.first} ${history.last} on ${history.ts}`}
                                </h5>
                                <p>{history.message}</p>
                            </div>
                        );
                    })}

                {msg &&
                    msg.map((msg, i) => {
                        return (
                            <div className="chat_msg" key={i}>
                                <img src={msg.url} height="50px" width="50px" />
                                <h5>
                                    {`${msg.first} ${msg.last} on ${msg.ts}`}
                                </h5>
                                <p>{msg.message}</p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                className="chat_input"
                type="text"
                onChange={(e) => chatInput(e)}
            ></textarea>
            <button
                onClick={() => {
                    newMessage();
                }}
            >
                SEND
            </button>
        </div>
    );
}
