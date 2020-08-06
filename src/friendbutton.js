import React, { useState, useEffect, Fragment } from "react";

export function Friendbutton() {
    ///will need to get passed the id of the user which we're trying to befriend/unfriend etc.
    //this will come from otheruser.abs

    //when mounts - axios.get request to figure out the relationship between viewer and viewee.
    //button text will be updated in state according to relationship status.abs

    //submit when the button is clicked. we need to either make a post request and send along the button text, or depending on the button text we'll make a request to a specific route. based on the response from the db we will update the text button.
    return (
        <Fragment>
            <button>placeholder</button>
        </Fragment>
    );
}
