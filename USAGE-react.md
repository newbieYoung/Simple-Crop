# script 标签用法

- [PC 示例](examples/react/test-1.html)
- [Mobile 示例](examples/react/test-2.html)

## 1、引入样式

目前提供了两种默认样式 `./dist/template-2.css` 适用移动设备，`./dist/template-1.css` 适用 PC。

```javascript
import "./dist/template-2.css";
```

## 2、引入组件代码

```javascript
import { SimpleCrop } from "./index-react.jsx";
```

## 3、初始化

```jsx
<SimpleCrop {...this.state.cropParams} />
```

- 移动端初始化参数示例：

```jsx
cropParams: {
  src: "https://newbieyoung.github.io/Simple-Crop/img/test2.jpg", // 裁剪图片地址
  size: { // 裁剪尺寸
    width: 1000,
    height: 600
  },
  cropSizePercent: 0.9, //裁剪框显示比例
  cropCallback: this.cropCallback //图片裁剪完成回调函数
}
```

- PC 初始化参数示例：

```jsx
cropParams: {
  title: "上传图片过大，请裁剪", //标题
  src: "https://newbieyoung.github.io/Simple-Crop/img/test2.jpg", // 裁剪图片地址
  size: { // 裁剪尺寸
    width: 1000,
    height: 600
  },
  cropSizePercent: 0.65, //裁剪框显示比例
  scaleSlider: true, //是否显示滑动控制条
  maxScale: 3, //最大缩放倍数
  borderWidth: 1, //裁剪框边框宽度
  funcBtns: ["close", "crop", "upload"], //功能按钮配置
  borderColor: "#fff", //裁剪框边框颜色
  coverColor: "rgba(0,0,0,.5)", //裁剪框遮罩颜色
  startAngle: -360, //旋转刻度盘开始角度
  endAngle: 360, //旋转刻度盘结束角度
  cropCallback: this.cropCallback //图片裁剪完成回调函数
}
```
