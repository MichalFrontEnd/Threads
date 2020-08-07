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
        <div className="profile_layout">
            <div className="cover_container">
                <img className="cover_photo" src="/Japanshop.jpg" />
            </div>

            <Profilepic
                first={first}
                last={last}
                url={url}
                toggleUpload={toggleUpload}
                pPicClass="profile_pic"
            />

            <h1 className="username">
                <span>Hey,{""}</span> {first} {last}!
            </h1>
            {/*<button onClick={props.toggleUpload}>Add photo</button>*/}
            {uploaderIsVisible && (
                <Uploader url={url} imageUpdate={imageUpdate} />
            )}
            <Bio bio={bio} bioUpdate={bioUpdate} />
        </div>
    );
}
