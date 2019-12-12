import React from "react";
import Core from "./index.js";

export class SimpleCrop extends React.Component {
  instance; //组件实例

  constructor(props) {
    super(props);
  }

  //初次渲染
  componentDidMount() {
    this.instance = new Core(this.props);
  }

  //组件属性更新是否需要重新构建组件
  shouldRebuild(prevProps) {
    //title、src、debug、zIndex、noBoldCorner、coverColor、borderColor、borderWidth、coverDraw、borderDraw、visible、cropCallback、uploadCallback、closeCallback
    let build = false;
    if (
      prevProps.maxScale != this.props.maxScale ||
      prevProps.scaleSlider != this.props.scaleSlider ||
      prevProps.cropSizePercent != this.props.cropSizePercent ||
      prevProps.rotateSlider != this.props.rotateSlider ||
      prevProps.startAngle != this.props.startAngle ||
      prevProps.endAngle != this.props.endAngle ||
      prevProps.gapAngle != this.props.gapAngle ||
      prevProps.lineationItemWidth != this.props.lineationItemWidth ||
      prevProps.funcBtns != this.props.funcBtns
    ) {
      build = true;
    }

    if (this.props.size && prevProps.size) {
      if (
        prevProps.size.width != this.props.size.width ||
        prevProps.size.height != this.props.size.height
      ) {
        build = true;
      }
    } else if (this.props.size || prevProps.size) {
      build = true;
    }

    if (this.props.positionOffset && prevProps.positionOffset) {
      if (
        prevProps.positionOffset.top != this.props.positionOffset.top ||
        prevProps.positionOffset.left != this.props.positionOffset.left
      ) {
        build = true;
      }
    } else if (this.props.positionOffset || prevProps.positionOffset) {
      build = true;
    }

    //功能按钮顺序也不能发生变化
    if (this.props.funcBtns && prevProps.funcBtns) {
      for (let i = 0; i < this.props.funcBtns.length; i++) {
        if (prevProps.funcBtns[i] != this.props.funcBtns[i]) {
          build = true;
        }
      }
    }

    return build;
  }

  //更新
  componentDidUpdate(prevProps) {
    if (this.shouldRebuild(prevProps)) {
      if (this.instance) {
        this.instance.$container.removeChild(this.instance.$target);
      }
      this.instance = new Core(this.props);
    } else {
      if (this.instance) {
        if (this.props.visible) {
          this.instance.show();
        } else {
          this.instance.hide();
        }
        if (prevProps.title != this.props.title) {
          this.instance.title = this.props.title;
          this.instance.$title.innerText = this.props.title;
        }
        if (prevProps.src != this.props.src) {
          this.instance.setImage(this.props.src);
        }
        this.instance.debug = this.props.debug;
        if (prevProps.zIndex != this.props.zIndex) {
          this.instance.zIndex = this.props.zIndex;
          this.instance.$target.style.zIndex = this.props.zIndex;
        }
        if (prevProps.borderDraw != this.props.borderDraw) {
          this.instance.borderDraw = this.props.borderDraw.bind(this.instance);
        }
        if (
          prevProps.noBoldCorner != this.props.noBoldCorner ||
          prevProps.coverColor != this.props.coverColor ||
          prevProps.borderColor != this.props.borderColor ||
          prevProps.borderWidth != this.props.borderWidth
        ) {
          this.instance.borderDraw();
        }
        if (prevProps.coverDraw != this.props.coverDraw) {
          this.instance.coverDraw = this.props.coverDraw.bind(this.instance);
          this.instance.borderDraw();
          this.instance.coverDraw();
        }
        if (prevProps.cropCallback != this.props.cropCallback) {
          this.instance.cropCallback = this.props.cropCallback.bind(
            this.instance
          );
        }
        if (prevProps.uploadCallback != this.props.uploadCallback) {
          this.instance.uploadCallback = this.props.uploadCallback.bind(
            this.instance
          );
        }
        if (prevProps.closeCallback != this.props.closeCallback) {
          this.instance.closeCallback = this.props.closeCallback.bind(
            this.instance
          );
        }
      }
    }
  }

  render() {
    return <div />;
  }
}
