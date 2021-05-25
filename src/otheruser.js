import React, { Fragment } from "react";
import axios from "./axios";
import Friendbutton from "./friendbutton";
import Coverphoto from "./coverphoto";
import Wallposts from "./wallposts";


class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            friends: false,
            modalIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }
    componentDidMount() {
        axios.get(`/switch/user/${this.state.id}`).then(({ data }) => {
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
                );
            }
        });
    }
    toggleModal() {
        this.setState({
            modalIsVisible: !this.state.modalIsVisible,
        });
    }

    updateFriendship(arg) {
        this.setState(
            {
                friends: arg,
            }
        );
    }

    render() {
        let url = this.state.url || "/default.jpg";
        return (
            <div className="profile_layout">
                {this.state.modalIsVisible && (
                    <div
                        className="overlay"
                        onClick={() => {
                            this.toggleModal();
                        }}
                    >
                        <div className="large_pp">
                            <img
                                onClick={() => {
                                    this.toggleModal();
                                }}
                                src={url}
                                alt={(this.state.first, this.state.last)}
                            ></img>
                        </div>
                    </div>
                )}
                {this.state.error && (
                    <h2 className="error">Not a valid user.</h2>
                )}
                <div className="cover_container">
                    <Coverphoto />
                </div>

                <div className="oupro_pic_container">
                    <img
                        className="profile_pic"
                        src={url}
                        alt={(this.state.first, this.state.last)}
                        onClick={(e) => {
                            this.toggleModal(e);
                        }}
                    />
                </div>
                <Friendbutton
                    id={this.state.id}
                    fbClass="ouser_fb"
                    updateFriendship={(e) => {
                        this.updateFriendship(e);
                    }}
                />
                <div className="user_info">
                    <h1 className="username">
                        {this.state.first} {this.state.last}
                    </h1>
                    <div className="bio_container">
                        <p className="bio">{this.state.bio}</p>
                    </div>
                </div>
                {this.state.friends ? (
                    <Wallposts id={this.state.id} />
                ) : (
                    <h2 className="private">
                        Wall posts can only be viewed by friends!
                    </h2>
                )}
            </div>
        );
    }
}

export default OtherUser;
