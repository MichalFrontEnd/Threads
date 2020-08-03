import React, { Fragment } from "react";
import axios from "./axios";

class Uploader extends React.Component {
    //let { url, toggleUpload } = props
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
        console.log("this.state.selectedPhoto: ", this.state.selectedPhoto);
        fd.append(
            "file",
            this.state.selectedPhoto
            //this.state.selectedPhoto.name
        );
        //console.log("formData: ", fd);
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
                <h1>I am the Uploader sanity check</h1>;
                <input
                    name="file"
                    type="file"
                    onChange={(e) => this.inputChange(e)}
                    accept="image/*"
                />
                <button onClick={(e) => this.photoUpload(e)}>
                    Upload photo
                </button>
            </Fragment>
        );
    }
}

export default Uploader;
