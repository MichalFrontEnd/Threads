import React from "react";
import Logo from "./logo";
import Profilepic from "./profilepic";

export default function Header(props) {
    console.log("props in header: ", props);
    return (
        <React.Fragment>
            <Logo />
            <a href="/logout">Log Out</a>
            <Profilepic
                first={props.first}
                last={props.last}
                url={props.url}
                toggleUpload={props.toggleUpload}
                pPicClass="header_pic"
            />
        </React.Fragment>
    );
}
