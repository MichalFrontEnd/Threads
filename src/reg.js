import React from "react";
import axios from "./axios";

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
            .then((data) => {
                console.log("am I getting here?");
                console.log("data: ", data);
            })
            .catch((err) => {
                console.log("error in axios/register", err);
            });
    }
    render() {
        return (
            <div>
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
                    />
                </label>
                <button onClick={(e) => this.submit()}>Submit</button>
            </div>
        );
    }
}
