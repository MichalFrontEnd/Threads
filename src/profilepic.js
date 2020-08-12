import React, { useState } from "react";

export default function Profilepic(props) {
    let { first, last, url, toggleUpload } = props;

    url = url || "default.jpg";

    return (
        <React.Fragment>
            <img
                src={url}
                alt={(first, last)}
                onClick={toggleUpload}
                className={props.pPicClass}
                //toggleUpload={toggleUpload}
            />

            {/*<button onClick={toggleUpload}>Add photo</button>*/}
        </React.Fragment>
    );
}
