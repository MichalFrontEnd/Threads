import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    construstor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }
    render() {
        const { step } = this.state;
        //can also do a regular "if" statement, or write a function
        return (
            <div>
                {step == 1 && <div></div>}
                {step == 2 && <div></div>}
                {step == 3 && <div></div>}
            </div>
        );
    }
}
