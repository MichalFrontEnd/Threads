import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.inputChange = this.inputChange.bind(this);
    }
    inputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                pwd: this.state.pwd,
            })
            .then(({ data }) => {
                //console.log("data in login POST: ", data);
                if (data.loginSuccess) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Invalid email or password. Please try again.
                    </div>
                )}
                <label>
                    Email:
                    <input
                        type="text"
                        onInput={(e) => this.inputChange(e)}
                        name="email"
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        onInput={(e) => this.inputChange(e)}
                        name="pwd"
                    />
                </label>
                <button onClick={(e) => this.submit()}>Submit</button>
                <p>
                    Not yet a member? Click
                    <Link to="/reg"> here </Link>to register!
                </p>
                <p>
                    Forgot your password? Click
                    <Link to="/resetpwd"> here </Link>to reset it!
                </p>
            </div>
        );
    }
}
