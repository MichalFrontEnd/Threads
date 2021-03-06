import React from "react";
import Registration from "./reg";
import Login from "./login";
import ResetPassword from "./resetpwd";
import { HashRouter, Route, Link } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <img className="large_logo" src="/images/3pur.png" />
                <Route exact path="/" component={Registration} />
                <Route path="/login" component={Login} />
                <Route path="/resetpwd" component={ResetPassword} />
            </div>
        </HashRouter>
    );
}
