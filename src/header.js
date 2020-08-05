import React from "react";
import Logo from "./logo";
import Profilepic from "./profilepic";
import { Link } from "react-router-dom";

export default function Header(props) {
    //console.log("props in header: ", props);
    return (
        <header>
            <Logo />
            <Link to="/usersearch" className="searcher">
                🔎
            </Link>
            <a className="logout" href="/logout">
                Log Out
            </a>
            <Link to="/" className="header_home">
                <Profilepic
                    first={props.first}
                    last={props.last}
                    url={props.url}
                    toggleUpload={props.doNothing}
                    pPicClass="header_pic"
                />
            </Link>
        </header>
    );
}
