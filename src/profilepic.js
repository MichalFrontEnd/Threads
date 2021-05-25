import React, { useState } from "react";

export default function Profilepic(props) {
    let { first, last, url, toggleUpload } = props;

    url = url || "/images/defaultdesat.jpg";

    return (
        <React.Fragment>
            <img
                src={url}
                alt={(first, last)}
                onClick={toggleUpload}
                className={props.pPicClass}
            />
        </React.Fragment>
    );
}
