import React from "react";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Bio from "./bio";

export default function Profile(props) {
    let {
        first,
        last,
        url,
        bio,
        toggleUpload,
        uploaderIsVisible,
        imageUpdate,
        bioUpdate,
    } = props;

    //console.log("props in Profile: ", props);
    return (
        <div className="user_card">
            <h1 className="username">
                <span>Hey,{""}</span> {first} {last}!
            </h1>

            <Profilepic
                first={first}
                last={last}
                url={url}
                toggleUpload={toggleUpload}
                pPicClass="profile_pic"
            />
            <button onClick={props.toggleUpload}>Add photo</button>
            {uploaderIsVisible && (
                <Uploader url={url} imageUpdate={imageUpdate} />
            )}
            <Bio bio={bio} bioUpdate={bioUpdate} />
        </div>
    );
}
