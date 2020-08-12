import axios from "./axios";

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
