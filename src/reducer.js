export default function reducer(state = {}, actions) {
    if (actions.type == "GET_GROUPIES") {
        state = Object.assign({}, state, {
            groupies: actions.groupies,
        });
    }

    if (actions.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            groupies: state.groupies.map((user) => {
                if (user.id == actions.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (actions.type == "DELETE_FRIEND") {
        //console.log("state.pending: ", state.groupies);
        state = {
            ...state,
            groupies: state.groupies.filter((user) => user.id != actions.id),
        };
    }

    if (actions.type == "CHAT_HISTORY") {
        state = {
            ...state,
            history: actions.history,
        };
    }

    if (actions.type == "SEND_MESSAGE") {
        state = {
            ...state,
            chatInput: actions.chatInput,
        };
    }
    //console.log("state.chatInput: ", state.chatInput);

    if (actions.type == "DISPLAY_MSG") {
        state = {
            ...state,
            history: [...state.history, actions.msg],
        };
    }
    //console.log("state.history after DISPLAY_MSG: ", state.history);

    return state;
}
