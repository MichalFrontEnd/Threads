import React, { Fragment } from "react";
import axios from "./axios";

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPhoto: null,
        };
    }

    inputChange(e) {
        this.setState({
            selectedPhoto: e.target.files[0],
        });
    }
    photoUpload(e) {
        e.preventDefault();
        let fd = new FormData();
        fd.append(
            "file",
            this.state.selectedPhoto
        );
        axios
            .post(
                "/photoupld",
                fd
                //onUploadProgress: ProgressEvent => {console.log("Upload progress: " +Math.round( ProgressEvent.loaded / ProgressEvent.total* 100) +"%")}
            )
            .then(({ data }) => {
                console.log("data in photoupld", data.data);
                this.props.imageUpdate(data.data);
            })
            .catch((err) =>
                console.log("error in axios/post photoupload", err)
            );
    }
    render() {
        return (
            <Fragment>
                <div className="uploader">
                    <input
                        name="file"
                        type="file"
                        onChange={(e) => this.inputChange(e)}
                        accept="image/*"
                    />

                    <button onClick={(e) => this.photoUpload(e)}>
                        Upload photo
                    </button>
                    <span>*Must be under 2MB</span>
                </div>
            </Fragment>
        );
    }
}

export default Uploader;
