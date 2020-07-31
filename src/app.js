//import React, { Component } from 'react';
import React, { Fragment } from "react";
import Profilepic from "./profilepic";
import Uploader from "./uploader";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
    }
    toggleUpload() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    render() {
        return (
            <Fragment>
                <h1>I am the app</h1>;
                <Profilepic first={this.state.first} last={this.state.last} />
                <button
                    onClick={() => {
                        this.toggleUpload();
                    }}
                >
                    Add photo
                </button>
                {this.state.uploaderIsVisible && <Uploader />}
            </Fragment>
        );
    }
}

export default App;
