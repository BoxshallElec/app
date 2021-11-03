import React, { Component } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

class CameraInput extends Component {
  state = {};
  render() {
    return (
      <Camera
        onTakePhoto={(dataUri) => {
          this.props.handleTakePhoto(dataUri);
        }}
      />
    );
  }
}

export default CameraInput;
