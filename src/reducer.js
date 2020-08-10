export default function reducer(state = {}, actions) {
    if (actions.type == "GET_GROUPIES") {
        state = Object.assign({}, state, {
            groupies: actions.groupies,
        });
    }

    if (actions.type == "ACCEPT_FRIEND") {
        //console.log("state.pending: ", state.groupies);
        state = {
            ...state,
            groupies: state.groupies.map((user) => {
                //console.log("user.id: ", user.id);
                //console.log("actions.id: ", actions.id);
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
        console.log("state.pending: ", state.groupies);
        state = {
            ...state,
            groupies: state.groupies.filter((user) => user.id != actions.id),
        };
    }

    return state;
}
