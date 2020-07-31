import React from "react";
import Registration from "./reg";
import Login from "./login";
import { HashRouter, Route, Link } from "react-router-dom";
//import ReactDOM from "react-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <h1> Welcome </h1> <img src="Bows.png" />
                <Route exact path="/" component={Registration} />
                <Route path="/login" component={Login} />
            </div>
        </HashRouter>
    );
}
