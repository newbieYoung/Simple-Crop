import React from "react";
import ReactDOM from "react-dom";
import { SimpleCrop } from "../index-react.jsx";
import "../dist/template-1.css";

class Test1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cropParams: {
        visible: true, //是否显示
        title: "上传图片过大，请裁剪",
        src: "https://newbieyoung.github.io/Simple-Crop/img/test2.jpg",
        size: {
          width: 800,
          height: 900
        },
        positionOffset: {
          left: 0,
          top: 50
        },
        maxScale: 2,
        borderWidth: 2,
        funcBtns: ["close", "crop", "upload"],
        borderColor: "#0BFF00",
        coverColor: "rgba(0,0,0,.5)",
        startAngle: -360,
        endAngle: 360,
        cropCallback: this.cropCallback,
        coverDraw: this.coverDraw
      }
    };
  }

  //图片裁剪回调函数
  cropCallback(canvas) {
    canvas.style.marginRight = "10px";
    canvas.style.width = "50%";
    document.body.appendChild(canvas);
  }

  //自定义辅助线
  coverDraw() {
    this.cropCoverContext.setLineDash([15, 20]);
    this.cropCoverContext.lineWidth = 2;

    this.cropCoverContext.beginPath();
    let rect1 = {
      left: this.cropRect.left * window.devicePixelRatio,
      top:
        (this.cropRect.top + this.cropRect.height * 0.125) *
        window.devicePixelRatio,
      right:
        (this.cropRect.left + this.cropRect.width) * window.devicePixelRatio,
      bottom:
        (this.cropRect.top +
          this.cropRect.height -
          this.cropRect.height * 0.125) *
        window.devicePixelRatio
    };
    this.cropCoverContext.moveTo(rect1.left, rect1.top);
    this.cropCoverContext.lineTo(rect1.right, rect1.top);
    this.cropCoverContext.moveTo(rect1.left, rect1.bottom);
    this.cropCoverContext.lineTo(rect1.right, rect1.bottom);
    this.cropCoverContext.strokeStyle = "#ffffff";
    this.cropCoverContext.stroke();

    this.cropCoverContext.beginPath();
    let rect2 = {
      left:
        (this.cropRect.left + this.cropRect.width * 0.2) *
        window.devicePixelRatio,
      top:
        (this.cropRect.top + this.cropRect.height * 0.2) *
        window.devicePixelRatio,
      right:
        (this.cropRect.left + this.cropRect.width - this.cropRect.width * 0.2) *
        window.devicePixelRatio,
      bottom:
        (this.cropRect.top +
          this.cropRect.height -
          this.cropRect.height * 0.2) *
        window.devicePixelRatio
    };
    this.cropCoverContext.moveTo(rect2.left, rect2.top);
    this.cropCoverContext.lineTo(rect2.right, rect2.top);
    this.cropCoverContext.lineTo(rect2.right, rect2.bottom);
    this.cropCoverContext.lineTo(rect2.left, rect2.bottom);
    this.cropCoverContext.lineTo(rect2.left, rect2.top);
    this.cropCoverContext.strokeStyle = "#ffeb3b";
    this.cropCoverContext.stroke();
  }

  render() {
    return (
      <div>
        <SimpleCrop {...this.state.cropParams} />
      </div>
    );
  }
}

ReactDOM.render(<Test1 />, document.querySelector("#app"));
