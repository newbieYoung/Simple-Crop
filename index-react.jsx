import React from "react";
import Core from "./index.js";

export class SimpleCrop extends React.Component {
  instance; //实例

  constructor(props) {
    super(props);

    //传入裁剪结果到裁剪回调函数中
    let self = this;
    let cropCallback = this.props.cropCallback;
    this.props.cropCallback = function() {
      cropCallback(self.instance.$resultCanvas);
    };
  }

  componentDidMount() {
    this.instance = new Core(this.props);
  }

  render() {
    return <div />;
  }
}
