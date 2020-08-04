//import React, { Component } from 'react';
import React, { Fragment } from "react";
import Header from "./header";
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
    bioUpdate(bio) {
        this.setState({
            bio: bio,
        });
    }
    render() {
        if (!this.state.first) {
            return null;
        }
        return (
            <Fragment>
                <header>
                    <Header
                        first={this.state.first}
                        last={this.state.last}
                        url={this.state.url}
                        toggleUpload={(e) => {
                            this.toggleUpload(e);
                        }}
                    />
                </header>
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.url}
                    bio={this.state.bio}
                    uploaderIsVisible={this.state.uploaderIsVisible}
                    toggleUpload={(e) => {
                        this.toggleUpload(e);
                    }}
                    imageUpdate={(e) => {
                        this.imageUpdate(e);
                    }}
                    bioUpdate={(e) => {
                        this.bioUpdate(e);
                    }}
                />
            </Fragment>
        );
    }
}

export default App;
