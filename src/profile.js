import React, { useState } from "react";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Bio from "./bio";
import Coverphoto from "./coverphoto";
import Wallposts from "./wallposts";

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
    const [modalShown, setModalShown] = useState(false);
    //const [hasFrame, setHasFrame] = useState(false);
    //const toggleFrame = () => setHasFrame(!hasFrame);

    function toggleModal() {
        //console.log("modal should show");

        setModalShown(!modalShown);
    }

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
                onClick={() => toggleModal()}
            >
                <Profilepic
                    first={first}
                    last={last}
                    url={url}
                    //toggleUpload={toggleUpload}
                    pPicClass="profile_pic"
                />
            </div>
            {modalShown && (
                <div
                    className="overlay"
                    onClick={(e) => {
                        setModalShown(!modalShown);
                    }}
                >
                    <div className="large_pp">
                        <img
                            onClick={(e) => {
                                setModalShown(!modalShown);
                            }}
                            src={url}
                            alt={`${first}  ${last}`}
                        ></img>
                    </div>
                </div>
            )}
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
            <Wallposts />
        </div>
    );
}
