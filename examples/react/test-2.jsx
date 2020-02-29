import React from "react";
import ReactDOM from "react-dom";
import { SimpleCrop } from "../../index.jsx";
import "../../dist/template-2.css";

class Test2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      cropParams: {
        src: "../../img/test2.jpg",
        size: {
          width: 800,
          height: 600
        },
        cropSizePercent: 0.9,
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

ReactDOM.render(<Test2 />, document.querySelector("#app"));
