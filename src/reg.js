import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
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
        //e.preventDefault();
        const newUser = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            pwd: this.state.pwd,
        };
        axios
            .post("/register", newUser)
            .then(({ data }) => {
                //console.log("data: ", data);
                if (data.regSuccess) {
                    //console.log("We have succeeded");
                    location.replace("/");
                } else {
                    if (data.emailExists) {
                        this.setState({
                            emailError: true,
                        });
                    } else {
                        this.setState({
                            error: true,
                        });
                    }
                }
            })
            .catch((err) => {
                console.log("error in axios/register", err);
                this.setState({
                    error: true,
                });
            });
    }

    checkEnter(e) {
        if (e.keyCode === 13) {
            this.submit();
        }
    }

    render() {
        return (
            <div className="reg_form">
                {this.state.error && (
                    <div className="error">
                        An error has occured. Please try again.
                    </div>
                )}
                {this.state.emailError && (
                    <div className="error">
                        Email already exits. Please try again.
                    </div>
                )}
                <label>
                    First Name:
                    <input
                        type="text"
                        onInput={(e) => this.inputChange(e)}
                        name="first"
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        onInput={(e) => this.inputChange(e)}
                        name="last"
                    />
                </label>
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
                        onKeyDown={(e) => this.checkEnter(e)}
                    />
                </label>
                <button onClick={(e) => this.submit()}>Submit</button>
                <p>
                    Already a member? Click
                    <Link to="/login"> here </Link>to Log in!
                </p>
            </div>
        );
    }
}
