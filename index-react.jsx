import React from "react";
import Core from "./index.js";

export class SimpleCrop extends React.Component {
  instance; //组件实例

  updateProps; //组件更新属性

  constructor(props) {
    super(props);

    //传入裁剪结果到裁剪回调函数中
    let self = this;
    let cropCallback = this.props.cropCallback;
    this.props.cropCallback = function() {
      cropCallback(self.instance.$resultCanvas);
    };
  }

  //初次渲染
  componentDidMount() {
    this.instance = new Core(this.props);
  }

  //更新
  componentDidUpdate(prevProps) {
    console.log(prevProps);
  }

  render() {
    return <div />;
  }
}
