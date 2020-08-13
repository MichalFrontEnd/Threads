import * as io from "socket.io-client";
import { chatHistory, displayMsg } from "./actions";

//import actions

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("chatHistory", (data) => {
            //console.log("data in chatHistory: ", data);
            store.dispatch(chatHistory(data));
        });
        socket.on("displayMsg", (data) => {
            //console.log("data in displayMsg: ", data);
            store.dispatch(displayMsg(data));
        });
    }
};
