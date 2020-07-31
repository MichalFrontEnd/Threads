import React from "react";

export default function Profilepic(props) {
    let { first, last, url } = props;
    url = url || "img/default.png";
    return (
        <React.Fragment>
            <div>Here we'll see a picture</div>
            <img src={url} alt={first} />
            {first} {last}
        </React.Fragment>
    );
}
