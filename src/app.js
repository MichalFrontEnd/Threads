//import React, { Component } from 'react';
import React, { Fragment } from "react";
import Logo from "./logo";
import axios from "./axios";
import Profile from "./profile";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUpload = this.toggleUpload.bind(this);
    }
    componentDidMount() {
        //console.log(
        //    "this.state.uploaderIsVisible: ",
        //    this.state.uploaderIsVisible
        //);
        axios.get("/user").then(({ data }) => {
            //console.log("data.data in get /user: ", data.data);
            this.setState({
                first: data.data.first,
                last: data.data.last,
                bio: data.data.bio,
                url: data.data.url,
            });
        });
    }
    toggleUpload() {
        this.setState(
            {
                uploaderIsVisible: !this.state.uploaderIsVisible,
            },
            () => {
                console.log(
                    //"uploader is toggled!",
                    this.state.uploaderIsVisible
                );
            }
        );
    }
    imageUpdate(img) {
        this.setState(
            {
                url: img,
                uploaderIsVisible: false,
            },
            () => {
                console.log(
                    "this.state in imageUpdate function",
                    this.state.url
                );
            }
        );
    }
    render() {
        if (!this.state.first) {
            return null;
        }
        return (
            <Fragment>
                <Logo />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.url}
                    uploaderIsVisible={this.state.uploaderIsVisible}
                    toggleUpload={() => {
                        this.toggleUpload();
                    }}
                    imageUpdate={(e) => {
                        this.imageUpdate(e);
                    }}
                />
            </Fragment>
        );
    }
}

export default App;
