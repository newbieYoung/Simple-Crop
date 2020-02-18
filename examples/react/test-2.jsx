import React from "react";
import ReactDOM from "react-dom";
import { SimpleCrop } from "../../index-react.jsx";
import "../../dist/template-2.css";

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
        cropCallback: this.cropCallback
      }
    };
  }

  //图片裁剪回调函数
  cropCallback () {
    this.$resultCanvas.style.marginRight = "10px";
    this.$resultCanvas.style.width = "50%";
    document.body.appendChild(this.$resultCanvas);
  }

  //设置裁剪图片并显示
  setCropImg () {
    let cropParams = this.state.cropParams;
    cropParams.src = "https://newbieyoung.github.io/Simple-Crop/img/test1.jpg";
    this.setState({
      cropParams: cropParams
    });
  }

  render () {
    return (
      <div>
        <button onClick={this.setCropImg.bind(this)}>设置裁剪图片并显示</button>
        <SimpleCrop {...this.state.cropParams} />
      </div>
    );
  }
}

ReactDOM.render(<Test2 />, document.querySelector("#app"));
