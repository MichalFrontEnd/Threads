import React from "react";
import Logo from "./logo";
import Profilepic from "./profilepic";
import { Link } from "react-router-dom";

export default function Header(props) {
    //console.log("props in header: ", props);
    return (
        <header>
            <Logo />
            <Link to="/usersearch" className="header_links searcher">
                🔎
            </Link>
            <Link to="/friends" className="header_links friends">
                Friends
            </Link>
            <Link to="/chat" className="header_links chat">
                Chat
            </Link>
            <a className="header_links logout" href="/logout">
                Log Out
            </a>
            <Link to="/" className="header_link header_home">
                <Profilepic
                    first={props.first}
                    last={props.last}
                    url={props.url}
                    //toggleUpload={props.doNothing}
                    pPicClass="header_pic"
                />
            </Link>
        </header>
    );
}
