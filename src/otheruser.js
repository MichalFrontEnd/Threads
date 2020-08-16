import React, { Fragment } from "react";
import axios from "./axios";
import Friendbutton from "./friendbutton";
import Coverphoto from "./coverphoto";
import Wallposts from "./wallposts";

//import { Link, BrowserRouter } from "react-router-dom";

class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            friends: false,
            //viewer: null,
        };
    }
    componentDidMount() {
        //const id = this.props.match.params.id;
        //console.log(
        //    "this.props.match.params in OtherUser mount: ",
        //    this.props.match.params
        //);
        axios.get(`/switch/user/${this.state.id}`).then(({ data }) => {
            console.log("data in GET ouser", data);
            if (data.sameUser) {
                this.props.history.push("/");
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
                        url: data.data.url || "/images/defaultdesat.jpg",
                        bio: data.data.bio,
                        coverphoto: data.data.coverphoto,
                    }
                    //() => {
                    //    console.log("setState sanity check", this.state);
                    //}
                );
            }
        });
    }
    updateFriendship(arg) {
        this.setState(
            {
                friends: arg,
            },
            () => {
                console.log("this.state.friends: ", this.state.friends);
            }
        );
    }
    render() {
        let url = this.state.url || "/default.jpg";
        return (
            <div className="profile_layout">
                {this.state.error && (
                    <h2 className="error">Not a valid user.</h2>
                )}
                <div className="cover_container">
                    <Coverphoto />
                </div>
                <h1 className="username">
                    {this.state.first} {this.state.last}
                </h1>
                <div className="pro_pic_container">
                    <img
                        className="user_image"
                        src={url}
                        alt={(this.state.first, this.state.last)}
                    />
                </div>
                <Friendbutton
                    id={this.state.id}
                    updateFriendship={(e) => {
                        this.updateFriendship(e);
                    }}
                    // viewer={this.state.viewer}
                />
                <p>{this.state.bio}</p>
                {this.state.friends ? (
                    <Wallposts id={this.state.id} />
                ) : (
                    <h4>This part can only be viewed by friends!</h4>
                )}
            </div>
        );
    }
}

export default OtherUser;
