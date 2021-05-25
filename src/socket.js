import * as io from "socket.io-client";
import { chatHistory, displayMsg } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("chatHistory", (data) => {
            store.dispatch(chatHistory(data));
        });
        socket.on("displayMsg", (data) => {
            store.dispatch(displayMsg(data));
        });
    }
};
