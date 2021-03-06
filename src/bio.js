import React from "react";
import axios from "./axios";

class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "view",
            value: this.props.bio,
        };
    }

    componentDidMount() {
        if (!this.props.bio) {
            this.setState({
                mode: "add",
            });
        }
    }
    bioChange(e) {
        this.setState({
            value: e.target.value,
        });
    }

    toggleBio() {
        this.setState(
            {
                mode: "edit",
            }
        );
    }
    sendBio() {
        let fd = new FormData();
        fd.append("bio", this.state.value);

        axios.post("/updatebio", { bio: this.state.value }).then(({ data }) => {
            this.props.bioUpdate(data.data);
            this.setState({
                mode: "view",
            });
        });
    }
    editBio() {
        this.setState({
            mode: "edit",
        });
    }

    checkEnter(e) {
        if (e.keyCode === 13) {
            this.sendBio();
        }
    }

    render() {
        let elem;
        const { mode } = this.state;
        {
            mode == "add" &&
                (elem = (
                    <button
                        className="bio_button"
                        onClick={(e) => this.toggleBio(e)}
                    >
                        Add bio!
                    </button>
                ));
        }
        //}
        {
            mode == "view" &&
                (elem = (
                    <div className="bio_container">
                        <p className="bio">{this.props.bio}</p>
                        <button
                            className="bio_button"
                            onClick={(e) => this.editBio(e)}
                        >
                            Edit bio!
                        </button>
                    </div>
                ));
        }
        {
            mode == "edit" &&
                (elem = (
                    <div className="bio_container">
                        <textarea
                            name="bio"
                            rows="5"
                            cols="30"
                            value={this.state.value}
                            onChange={(e) => this.bioChange(e)}
                            onKeyDown={(e) => this.checkEnter(e)}
                        ></textarea>
                        <button
                            className="bio_button"
                            onClick={(e) => this.sendBio(e)}
                        >
                            Submit!
                        </button>
                    </div>
                ));
        }
        return <div className="bio_container">{elem}</div>;
    }
}

export default Bio;
