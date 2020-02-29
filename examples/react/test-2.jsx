import React from "react";
import ReactDOM from "react-dom";
import { SimpleCrop } from "../../index.jsx";
import "../../dist/template-2.css";

class Test2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cropParams: {
        src: "../../img/test2.jpg",
        size: {
          width: 1000,
          height: 600
        },
        cropSizePercent: 0.9,
        cropCallback: this.cropCallback
      }
    };
  }

  //组件更新
  updateComponent () {
    let cropParams = this.state.cropParams;
    cropParams.borderColor = "#0BFF00";
    cropParams.cropSizePercent = 0.8;
    cropParams.size = {
      width: 600,
      height: 600
    };
    cropParams.positionOffset = {
      left: 0,
      top: 20,
    };
    this.setState({
      cropParams: cropParams
    })
  }

  //设置裁剪图片
  setCropImage () {
    let cropParams = this.state.cropParams;
    cropParams.src = "../../img/test1.jpg";
    this.setState({
      cropParams: cropParams
    });
  }

  //图片裁剪回调函数
  cropCallback () {
    this.$resultCanvas.style.marginRight = "10px";
    this.$resultCanvas.style.width = "50%";
    document.body.appendChild(this.$resultCanvas);
  }

  render () {
    return (
      <div>
        <input onChange={this.setCropImage.bind(this)} type="file" accept="image/png,image/jpeg"></input>
        <button onClick={this.updateComponent.bind(this)}>组件更新</button>
        <SimpleCrop {...this.state.cropParams} />
      </div>
    );
  }
}

ReactDOM.render(<Test2 />, document.querySelector("#app"));
