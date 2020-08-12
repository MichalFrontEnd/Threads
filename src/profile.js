import React, { useState } from "react";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Bio from "./bio";
import Coverphoto from "./coverphoto";

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
    //const [hasFrame, setHasFrame] = useState(false);
    //const toggleFrame = () => setHasFrame(!hasFrame);

    return (
        <div
            className="profile_layout"
            onMouseEnter={(e) => {
                setIsShown(false);
            }}
        >
            <div className="cover_container">
                <Coverphoto />
            </div>
            <div
                className="pro_pic_container"
                //{hasFrame ? "frame_hover" : ""}
                onMouseEnter={(e) => {
                    setIsShown(true);
                }}
                onMouseLeave={(e) => {
                    setIsShown(false);
                    //toggleFrame;
                }}
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
                <button
                    className="photo_add"
                    onClick={props.toggleUpload}
                    onMouseEnter={(e) => {
                        setIsShown(true);
                    }}
                >
                    Upload new photo
                </button>
            )}

            {uploaderIsVisible && (
                <Uploader url={url} imageUpdate={imageUpdate} />
            )}
            <div className="user_info">
                <h1 className="username">
                    {first} {last}
                </h1>
                <Bio bio={bio} bioUpdate={bioUpdate} />
            </div>
        </div>
    );
}
