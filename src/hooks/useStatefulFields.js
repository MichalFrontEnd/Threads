import React, { useState } from "react";

export function useStatefulFields() {
    const [fields, setFields] = useState({});
    const handleChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
        console.log("fields: ", fields);
    };
    return [fields, handleChange];
}
