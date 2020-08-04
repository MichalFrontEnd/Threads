import React from "react";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Bio from "./bio";

export default function Profile(props) {
    //let { first, last, url, toggleUpload } = props;

    //console.log("props in Profile: ", props);
    return (
        <div>
            <h1>Profile Page sanity check</h1>
            <p>
                Hey,{""} {props.first} {props.last}!
            </p>
            <Profilepic
                first={props.first}
                last={props.last}
                url={props.url}
                toggleUpload={() => {
                    props.toggleUpload();
                }}
                pPicClass="profile_pic"
            />
            <button
                onClick={() => {
                    props.toggleUpload();
                }}
            >
                Add photo
            </button>
            {props.uploaderIsVisible && (
                <Uploader
                    url={props.url}
                    imageUpdate={(url) => {
                        props.imageUpdate(url);
                    }}
                />
            )}
            <Bio
                bio={props.bio}
                bioUpdate={(bio) => {
                    props.bioUpdate(bio);
                }}
            />
        </div>
    );
}
