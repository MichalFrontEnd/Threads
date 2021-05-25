import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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
        dispatch(getGroupies());
    }, []);

    return (
        <React.Fragment>
            {pending && <h3 className="sec_header">Pending friend requests</h3>}
            <div className="friends_container">
                {pending &&
                    pending.map((user, i) => {
                        return (
                            <div key={i} className="person">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        src={
                                            user.url ||
                                            "/images/defaultdesat.jpg"
                                        }
                                    />
                                    <p>{user.first + " " + user.last} </p>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(acceptFriend(user.id))
                                    }
                                >
                                    Accept
                                </button>
                            </div>
                        );
                    })}
            </div>
            {friends && <h3 className="sec_header">Friends</h3>}
            <div className="friends_container">
                {friends &&
                    friends.map((user, i) => {
                        return (
                            <div key={i} className="person">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        src={
                                            user.url ||
                                            "/images/defaultdesat.jpg"
                                        }
                                    />
                                    <p>{user.first + " " + user.last} </p>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(deleteFriend(user.id))
                                    }
                                >
                                    Disconnect
                                </button>
                            </div>
                        );
                    })}
            </div>
        </React.Fragment>
    );
}
