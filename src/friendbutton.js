import React, { useState, useEffect, Fragment } from "react";
import axios from "./axios";

export default function Friendbutton(props) {
    const [buttonText, setButtonText] = useState("Connect!");

    useEffect(() => {
        axios
            .get(`/friendreq/${props.id}`)
            .then(
                ({ data }) => {
                    setButtonText(data.button);
                    if (data.button === "Disconnect") {
                        props.updateFriendship(true);
                    }
                }
            )
            .catch((err) => console.log("err in friendreq mount", err));
    }, []);

    const requestHandler = () => {
        axios
            .post(`/friendreq/${buttonText}`, { id: props.id })
            .then(({ data }) => {
                setButtonText(data.button);
                if (data.button === "Disconnect") {
                    props.updateFriendship(true);
                }
            });
    };

    return (
        <Fragment>
            <button className={props.fbClass} onClick={requestHandler}>
                {buttonText}
            </button>
        </Fragment>
    );
}
