import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
let isLoggedIn = location.pathname != "/welcome";

if (isLoggedIn) {
    elem = <img src="/Bowssmall.png" />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
