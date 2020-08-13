import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { getGroupies, acceptFriend, deleteFriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const pending = useSelector(
        (state) =>
            state.groupies &&
            state.groupies.filter((groupie) => groupie.accepted == false)
    );
    const friends = useSelector(
        (state) =>
            state.groupies &&
            state.groupies.filter((groupie) => groupie.accepted == true)
    );

    useEffect(() => {
        //axios.get(`/friends/${props.id}`);
        dispatch(getGroupies());
    }, []);

    return (
        <React.Fragment>
            {pending &&
                pending.map((user, i) => {
                    return (
                        <div key={i}>
                            <h3>Pending friend requests</h3>
                            <Link
                                to={`/user/${user.id}`}
                                key={i}
                                className="last_users"
                            >
                                <img src={user.url} />
                                <p>{user.first + " " + user.last} </p>
                            </Link>
                            <button
                                onClick={() => dispatch(acceptFriend(user.id))}
                            >
                                Accept
                            </button>
                        </div>
                    );
                })}

            {friends &&
                friends.map((user, i) => {
                    return (
                        <div key={i}>
                            <h3>Friends</h3>
                            <Link
                                to={`/user/${user.id}`}
                                key={i}
                                className="last_users"
                            >
                                <img src={user.url} />
                                <p>{user.first + " " + user.last} </p>
                            </Link>
                            <button
                                onClick={() => dispatch(deleteFriend(user.id))}
                            >
                                Disconnect
                            </button>
                        </div>
                    );
                })}
        </React.Fragment>
    );
}
