import React from "react";
import ReactDOM from "react-dom";
import { SimpleCrop } from "../index-react.jsx";
import "../dist/template-2.css";

class Test2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cropParams: {
        src: "https://newbieyoung.github.io/Simple-Crop/img/test2.jpg",
        size: {
          width: 1000,
          height: 600
        },
        cropSizePercent: 0.9,
        cropCallback: this.cropCallback.bind(this)
      }
    };
  }

  //图片裁剪回调函数
  cropCallback(canvas) {
    canvas.style.marginRight = "10px";
    canvas.style.width = "50%";
    document.body.appendChild(canvas);
  }

  render() {
    return <SimpleCrop {...this.state.cropParams} />;
  }
}

ReactDOM.render(<Test2 />, document.querySelector("#app"));
