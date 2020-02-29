import React from "react";
import Core from "./index.js";

export class SimpleCrop extends React.Component {
  _instance; //组件实例

  constructor(props) {
    super(props);
  }

  //初次渲染
  componentDidMount () {
    let cropParams = JSON.parse(JSON.stringify(this.props))
    cropParams.cropCallback = () => {
      this.cropCallback();
    }
    cropParams.closeCallback = () => {
      this.closeCallback();
    }
    cropParams.uploadCallback = () => {
      this.uploadCallback();
    }
    this._instance = new Core(cropParams);
  }

  //选取裁剪图片成功回调
  uploadCallback () {
    if (this.props.uploadCallback) {
      let src = this._instance ? this._instance.src : this.props.src;
      this.props.uploadCallback(src);
    }
  }

  //关闭回调
  closeCallback () {
    if (this.props.closeCallback) {
      this.props.closeCallback();
    }
  }

  //裁剪回调
  cropCallback () {
    if (this.props.cropCallback) {
      let $resultCanvas = this._instance ? this._instance.$resultCanvas : null;
      this.props.cropCallback($resultCanvas)
    }
  }

  //更新
  componentDidUpdate (prevProps) {
    if (this._instance) {
      if (this.hasChanged(['src'], prevProps)) {
        this._instance.setImage(this.props.src);
      }

      if (this.hasChanged(['rotateSlider', 'startAngle', 'endAngle', 'gapAngle', 'lineationItemWidth'], prevProps)) {
        this._instance.initRotateSlider(this.props);
      }

      if (this.hasChanged(['cropSizePercent'], prevProps)
        || !this.isEquivalent(this.props.positionOffset, prevProps.positionOffset, ['top', 'left'])
        || !this.isEquivalent(this.props.size, prevProps.size, ['width', 'height'])) {
        this._instance.updateBox(this.props);
      }

      if (this.hasChanged(['borderWidth', 'borderColor', 'boldCornerLen', 'coverColor', 'borderDraw', 'coverDraw'], prevProps)) {
        this._instance.initBoxBorder(this.props)
      }

      if (!this.isEquivalent(this.props.funcBtns, prevProps.funcBtns, /^[0-9]*$/)) {
        this._instance.initFuncBtns(this.props);
      }

      if (this.hasChanged(['scaleSlider', 'maxScale'], prevProps)) {
        this._instance.initScaleSlider(this.props)
      }

      if (this.hasChanged(['title'], prevProps)) {
        this._instance.initTitle(this.props);
      }

      if (this.props.visible == false) {
        this._instance.hide();
      } else {
        this._instance.show();
      }
    }
  }

  //属性是否发生变化
  hasChanged (names, props) {
    let cur = {};
    let prev = {};
    for (let i = 0; i < names.length; i++) {
      let item = names[i];
      cur[item] = this.props[item];
      prev[item] = props[item];
    }
    return !this.isEquivalent(cur, prev, names);
  }

  //根据两个简单对象的值比较它们是否相同
  isEquivalent (a, b, include) {
    if (a != null && b != null) {
      let aProps = [];
      let aTemps = Object.getOwnPropertyNames(a);
      let bProps = [];
      let bTemps = Object.getOwnPropertyNames(b);

      //只考虑 include
      if (include instanceof Array) {
        // 数组
        for (let i = 0; i < include.length; i++) {
          let item = include[i];
          if (aTemps.includes(item)) {
            aProps.push(item);
          }
          if (bTemps.includes(item)) {
            bProps.push(item);
          }
        }
      } else if (include instanceof RegExp) {
        //正则
        for (let i = 0; i < aTemps.length; i++) {
          let item = aTemps[i];
          if (include.test(item)) {
            aProps.push(item);
          }
        }
        for (let i = 0; i < bTemps.length; i++) {
          let item = bTemps[i];
          if (include.test(item)) {
            bProps.push(item);
          }
        }
      } else {
        aProps = aTemps;
        bTemps = bTemps;
      }

      if (aProps.length != bProps.length) {
        return false;
      }

      for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];
        if (a[propName] !== b[propName]) {
          return false;
        }
      }

      return true;
    } else if (a === b) {
      return true;
    } else {
      return false;
    }
  }

  render () {
    return <div />;
  }
}
