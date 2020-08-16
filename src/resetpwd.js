import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }
    inputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submitEmail() {
        axios
            .post("/checkemail", { email: this.state.email })
            .then(({ data }) => {
                //console.log("back from checking email");
                //console.log("data in checkEmail: ", data);
                if (data.checkEmailSuccess) {
                    this.setState({
                        step: 2,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    submitCode() {
        axios
            .post("/checkcode", {
                email: this.state.email,
                code: this.state.code,
            })
            .then(({ data }) => {
                console.log("data in checkcode: ", data);
                if (data.checkCodeSuccess) {
                    this.setState({
                        success: true,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    submitNewPwd() {
        axios
            .post("/setnewpwd", {
                email: this.state.email,
                pwd: this.state.pwd,
            })
            .then(({ data }) => {
                if (data.updatePwdSuccess) {
                    this.setState({
                        step: 3,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    render() {
        const { step } = this.state;
        //can also do a regular "if" statement, or write a function
        return (
            <div className="reg_form">
                {step == 1 && (
                    <div>
                        {this.state.error && (
                            <div className="error">
                                Invalid email. Please try again.
                            </div>
                        )}
                        <h1>Reset Password</h1>
                        <label>
                            Please enter the email you registered with:
                            <input
                                type="text"
                                onInput={(e) => this.inputChange(e)}
                                name="email"
                            />
                        </label>
                        <button onClick={(e) => this.submitEmail()}>
                            Submit
                        </button>
                        <p>
                            Or go
                            <Link to="/"> back </Link>!
                        </p>
                    </div>
                )}
                {step == 2 && (
                    <div>
                        {this.state.error && (
                            <div className="error">
                                Invalid or expired code. Please try again.
                            </div>
                        )}
                        <h1>Reset Password</h1>
                        <label>
                            Please enter the code you received:
                            <input
                                type="text"
                                onInput={(e) => this.inputChange(e)}
                                name="code"
                            />
                        </label>
                        <button onClick={(e) => this.submitCode()}>
                            Submit
                        </button>
                        {this.state.success && (
                            <div>
                                <label>
                                    Please enter your new password:
                                    <input
                                        type="password"
                                        onInput={(e) => this.inputChange(e)}
                                        name="pwd"
                                    />
                                </label>
                                <button onClick={(e) => this.submitNewPwd()}>
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {step == 3 && (
                    <div>
                        <h1>Reset Password</h1>
                        <h3>Password updated succesfully!</h3>
                        <p>
                            You may now <Link to="/login"> log in </Link>
                            with your new password!
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
