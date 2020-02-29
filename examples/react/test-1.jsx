import React from "react";
import ReactDOM from "react-dom";
import { SimpleCrop } from "../../index.jsx";
import "../../dist/template-1.css";

class Test1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      cropParams: {
        title: "上传图片过大，请裁剪",
        src: "../../img/test2.jpg",
        size: {
          width: 800,
          height: 600
        },
        cropSizePercent: 0.65,
        scaleSlider: true,
        maxScale: 3,
        borderWidth: 1,
        funcBtns: ["close", "crop", "upload"],
        borderColor: "#fff",
        coverColor: "rgba(0,0,0,.5)",
        startAngle: -360,
        endAngle: 360,
        cropCallback: this.cropCallback,
        uploadCallback: this.uploadCallback,
        closeCallback: this.closeCallback
      }
    };
  }

  //组件更新
  updateComponent () {
    let cropParams = this.state.cropParams;
    cropParams.borderColor = "#0BFF00";
    cropParams.cropSizePercent = 0.5;
    cropParams.size = {
      width: 600,
      height: 600
    };
    this.setState({
      cropParams: cropParams
    })
  }

  //设置裁剪图片
  setCropImage (evt) {
    let files = evt.target.files;
    if (files.length > 0) {
      let cropParams = this.state.cropParams;
      cropParams.src = files[0];
      this.setState({
        cropParams: cropParams,
        inputValue: '' // 清空 input value 属性
      });
    }
  }

  //图片裁剪回调函数
  cropCallback ($resultCanvas) {
    console.log('cropCallback');
    $resultCanvas.style.marginRight = "10px";
    $resultCanvas.style.width = "50%";
    document.body.appendChild($resultCanvas);
  }

  //关闭组件回调
  closeCallback () {
    console.log('closeCallback');
  }

  //选取裁剪图片成功回调
  uploadCallback (src) {
    console.log('uploadCallback ' + src);
  }

  render () {
    return (
      <div>
        <input onChange={this.setCropImage.bind(this)} type="file" accept="image/png,image/jpeg" value={this.state.inputValue}></input>
        <button onClick={this.updateComponent.bind(this)}>组件更新</button>
        <SimpleCrop {...this.state.cropParams} />
      </div>
    );
  }
}

ReactDOM.render(<Test1 />, document.querySelector("#app"));
