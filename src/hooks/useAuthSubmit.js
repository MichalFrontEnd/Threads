import React, { useState, useEffect } from "react";
import axios from "./axios";

export function useAuthSubmit(url, fieldvalues) {
    const [error, setError] = useState();

    const handleSubmit = () => {
        axios
            .post(url, fieldvalues)
            .then((resp) => {
                resp.data.success ? location.replace("/") : setError(true);

                ///equivalant of:
                //if (resp.data.success === true) {
                //    location.replace("/");
                //} else {
                //    setError(true);
                //}
            })
            .catch((err) => {
                console.log("error in axios post to: ", url, err);
                setError(true);
            });
    };
    return [error, handleSubmit];
}
