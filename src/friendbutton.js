import React, { useState, useEffect, Fragment } from "react";
import axios from "./axios";

export default function Friendbutton(props) {
    //console.log("props in Friendbutton: ", props);
    const [buttonText, setButtonText] = useState("Connect!");
    //const [reqButton, setReqButton] = useState();
    const [viewerButton, setViewerButton] = useState("Connect!");
    const [viewer, setViewer] = useState("");

    useEffect(() => {
        console.log("useEffect sanity check");
        axios
            .get(`/friendreq/${props.id}`)
            .then(({ data }) => {
                //console.log("data.data in checkfriendship: ", data);
                console.log("data.button: ", data);

                setButtonText(data.button);
            })
            .catch((err) => console.log("err in friendreq mount", err));
    }, []);

    const requestHandler = () => {
        //setButtonText("Cancel :(");
        axios
            .post(`/friendreq/${buttonText}`, { id: props.id })
            .then(({ data }) => {
                console.log("data.button: ", data);
                setButtonText(data.button);
            });
    };

    ///will need to get passed the id of the user which we're trying to befriend/unfriend etc.
    //this will come from otheruser.abs

    //when mounts - axios.get request to figure out the relationship between viewer and viewee.
    //button text will be updated in state according to relationship status.abs

    //submit when the button is clicked. we need to either make a post request and send along the button text, or depending on the button text we'll make a request to a specific route. based on the response from the db we will update the text button.
    return (
        <Fragment>
            <button onClick={requestHandler}>{buttonText}</button>
        </Fragment>
    );
}
