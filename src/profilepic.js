import React from "react";

export default function Profilepic(props) {
    let { first, last, url, toggleUpload } = props;
    //console.log("props in Profilepic: ", props);
    url = url || "default.jpg";
    return (
        <React.Fragment>
            <img
                src={url}
                alt={(first, last)}
                onClick={toggleUpload}
                className={props.pPicClass}
                toggleUpload={toggleUpload}
            />
        </React.Fragment>
    );
}
