import * as io from "socket.io-client";
import { chatHistory } from "./actions";

//import actions

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("chatHistory", (data) => {
            console.log(data);
            return store.dispatch(chatHistory(data));
        });
    }
};
