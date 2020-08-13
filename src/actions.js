import axios from "./axios";
import { socket } from "./socket";

export async function getGroupies() {
    const { data } = await axios.get("/groupies");
    console.log("data in getGroupies: ", data);
    return {
        type: "GET_GROUPIES",
        groupies: data.data,
    };
}

export async function acceptFriend(id) {
    //console.log("id in acceptFriend: ", id);
    const { data } = await axios.post("/friendreq/Accept", { id });
    //console.log("data.data.id: ", data.id);
    return {
        type: "ACCEPT_FRIEND",
        id: data.id,
    };
}

export async function deleteFriend(id) {
    //console.log("id in deleteFriend: ", id);
    const { data } = await axios.post("/friendreq/Disconnect", { id });
    return {
        type: "DELETE_FRIEND",
        id,
    };
}

export function chatHistory(history) {
    return {
        type: "CHAT_HISTORY",
        history,
    };
}

export function sendMessage(chatInput) {
    socket.emit("chatInput", chatInput);
    return {
        type: "SEND_MESSAGE",
        chatInput,
    };
}

export function displayMsg(msg) {
    //console.log("msg: ", msg);
    return {
        type: "DISPLAY_MSG",
        msg,
    };
}
