import React from "react";

export default function Profilepic(props) {
    let { first, last, url, toggleUpload } = props;
    console.log("props in Profilepic: ", props);
    url = url || "default.jpg";
    return (
        <React.Fragment>
            <p>
                Hey,{""} {first} {last}!
            </p>
            <img src={url} alt={(first, last)} onClick={toggleUpload} />
        </React.Fragment>
    );
}
