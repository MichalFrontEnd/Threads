import React from "react";
import Profilepic from "./profilepic";
import Uploader from "./uploader";

export default function Profile(props) {
    //let { first, last, url, toggleUpload } = props;

    console.log("props in Profile: ", props);
    return (
        <div>
            <h1>Profile Page sanity check</h1>
            <Profilepic
                first={props.first}
                last={props.last}
                url={props.url}
                toggleUpload={() => {
                    props.toggleUpload();
                }}
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
        </div>
    );
}
