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
    bioChange(e) {
        this.setState({
            value: e.target.value,
        });
    }

    toggleBio() {
        this.setState(
            {
                mode: "edit",
            },
            () => console.log("moving into edit mode!")
        );
    }
    sendBio(e) {
        e.preventDefault();
        let fd = new FormData();
        //console.log("this.state.newBio ", this.state.newBio);
        fd.append("bio", this.state.value);

        axios.post("/updatebio", { bio: this.state.value }).then(({ data }) => {
            //console.log("data in updateBio: ", data.data);
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

    render() {
        let elem;
        const { mode } = this.state;

        if (!this.props.bio) {
            elem = (
                <div>
                    <button onClick={(e) => this.toggleBio(e)}>Add bio!</button>
                </div>
            );
        }
        {
            mode == "view" &&
                //if (this.mode === "view") {
                (elem = (
                    <div>
                        <h3>About Me</h3>
                        <p>{this.props.bio}</p>
                        <button onClick={(e) => this.editBio(e)}>
                            Edit bio!
                        </button>
                    </div>
                ));
        }
        // else if (this.mode === "edit") {
        {
            mode == "edit" &&
                (elem = (
                    <div>
                        <textarea
                            name="bio"
                            rows="10"
                            cols="30"
                            value={this.state.value}
                            onChange={(e) => this.bioChange(e)}
                        ></textarea>
                        <button onClick={(e) => this.sendBio(e)}>
                            Submit!
                        </button>
                    </div>
                ));
        }
        return (
            <div>
                <h1>Bio sanity check!</h1>
                {elem}
            </div>
        );
    }
}

export default Bio;
