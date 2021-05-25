import React, { Fragment } from "react";
import Header from "./header";
import axios from "./axios";
import Profile from "./profile";
import OtherUser from "./otheruser";
import Search from "./search";
import Friends from "./friends";
import Chat from "./chat";
import { Link, BrowserRouter, Route } from "react-router-dom";

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
            this.setState({
                first: data.data.first,
                last: data.data.last,
                bio: data.data.bio,
                url: data.data.url,
                coverphoto: data.data.coverphoto,
            });
        });
    }
    doNothing() {
        console.log("I'm just here for my beauty");
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
            <BrowserRouter>
                <div className="header_container">
                    <Header
                        first={this.state.first}
                        last={this.state.last}
                        url={this.state.url}
                        toggleUpload={this.doNothing}
                    />
                    <Route path="/usersearch" component={Search} />
                    <Route path="/friends" component={Friends} />
                    <Route path="/chat" component={Chat} />
                </div>
                <div className="app_container">
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                url={this.state.url}
                                bio={this.state.bio}
                                coverphoto={this.state.coverphoto}
                                uploaderIsVisible={this.state.uploaderIsVisible}
                                toggleUpload={this.toggleUpload}
                                imageUpdate={(e) => {
                                    this.imageUpdate(e);
                                }}
                                bioUpdate={(e) => {
                                    this.bioUpdate(e);
                                }}
                            />
                        )}
                    />
                </div>
                {/*end of Route, Profile*/}
                <Route path="/user/:id" component={OtherUser} />
            </BrowserRouter>
        );
    }
}

export default App;
