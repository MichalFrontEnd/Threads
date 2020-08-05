import React, { Fragment } from "react";
import axios from "./axios";
//import { Link, BrowserRouter } from "react-router-dom";

class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        console.log(
            "this.props.match.params in OtherUser mount: ",
            this.props.match.params
        );
        axios.get(`/switch/user/${id}`, id).then(({ data }) => {
            console.log("data in GET ouser", data);
            if (data.sameUser) {
                this.props.history.push("/app");
            }
            if (!data.getInfoSuccess) {
                this.setState({
                    error: true,
                });
            } else {
                this.setState(
                    {
                        first: data.data.first,
                        last: data.data.last,
                        url: data.data.url,
                        bio: data.data.bio,
                    }
                    //() => {
                    //    console.log("setState sanity check", this.state);
                    //}
                );
            }
        });
    }
    render() {
        let url = this.state.url || "/default.jpg";
        return (
            <div className="user_card">
                {this.state.error && (
                    <h2 className="error">Not a valid user.</h2>
                )}

                <h1 className="username">
                    {this.state.first} {this.state.last}
                </h1>
                <img
                    className="user_image"
                    src={url}
                    alt={(this.state.first, this.state.last)}
                />
                <p>{this.state.bio}</p>
            </div>
        );
    }
}

export default OtherUser;
