import React, { useState } from "react";
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
    const [isShown, setIsShown] = useState(false);

    //console.log("props in Profile: ", props);
    return (
        <div className="profile_layout">
            <div className="cover_container">
                <img className="cover_photo" src="/Japanshop.jpg" />
            </div>
            <div
                className="pro_pic_container"
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
            >
                <Profilepic
                    first={first}
                    last={last}
                    url={url}
                    toggleUpload={toggleUpload}
                    pPicClass="profile_pic"
                />
            </div>

            {isShown && (
                <div
                    className="overlay"
                    onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)}
                >
                    {/*<button className="photo_add" onClick={props.toggleUpload}>
                        Add photo
                    </button>*/}
                </div>
            )}
            <h1 className="username">
                <span>Hey,{""}</span> {first} {last}!
            </h1>

            {uploaderIsVisible && (
                <Uploader url={url} imageUpdate={imageUpdate} />
            )}
            <Bio bio={bio} bioUpdate={bioUpdate} />
        </div>
    );
}
