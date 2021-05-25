import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function Search(props) {
    const [lastUsers, setLastUsers] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [searchRes, setsearchRes] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("/showusers").then(({ data }) => {
            setLastUsers(data.data);
        });

        axios.get(`/search${userInput || "+"}`).then(({ data }) => {
            setsearchRes(data.data);

            userInput && setError(!data.searchSuccess);
        });
        setsearchRes("");
    }, [userInput]);

    const userSearch = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="tu_container">
            <h2>Here are our latest joiners!</h2>
            <div className="threeUsers">
                {lastUsers &&
                    lastUsers.map((user, i) => {
                        return (
                            <Link
                                to={`/user/${user.id}`}
                                key={i}
                                className="last_users"
                            >
                                <img
                                    src={user.url || "/images/defaultdesat.jpg"}
                                />
                                <h4>{user.first + " " + user.last} </h4>
                            </Link>
                        );
                    })}
            </div>
            <div className="user_search">
                <h3>Not who you&apos;re looking for?</h3>
                <label>Search:</label>
                <input
                    type="text"
                    name="search"
                    value={userInput}
                    onChange={userSearch}
                />
                <div></div>
                {error && (
                    <div className="error">
                        No results for this search, sorry :/.
                    </div>
                )}
                {userInput && (
                    <div className="res_container">
                        {searchRes &&
                            searchRes.map((person, i) => {
                                return (
                                    <div key={i}>
                                        <Link to={`/user/${person.id}`} key={i}>
                                            <div className="person">
                                                <img src={person.url} />
                                                <h4>
                                                    {`${person.first} ${person.last}`}
                                                </h4>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/*<button onClick=>Submit</button>*/}
            </div>
        </div>
    );
}
