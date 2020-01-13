# SimpleCrop

`the only` web picture cropping component that supports cropping pictures at any angle and has an `interactive experience` comparable to native clients.

[中文](README-zh.md)

## Features

Compared with the currently popular Web image cropping components, its advantages are as follows:

- Image supports rotation at any angle;
- Supports border judgment. When there is a blank in the crop frame, the picture is automatically absorbed to completely fill the crop frame;
- Mobile terminal zoom is based on the center of two fingers;
- Supports Mobile and PC;
- Supports script, React, Vue, AngularJS (Vue, AngularJS to be implemented);
- Has an interactive experience comparable to native clients.

## Install

```
npm install simple-crop
```

## Examples

### Mobile Example

![Mobile Example](https://newbieyoung.github.io/images/simple-crop-0.jpg)

> On the left is the picture cropping example in the IOS system album, and on the right is the SimpleCrop mobile example.

Scan the QR code:

![QR code for mobile example](https://newbieyoung.github.io/images/simple-crop-1.png)

Visit the following links:

- script

[https://newbieyoung.github.io/Simple-Crop/examples/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)

- React

[https://newbieyoung.github.io/Simple-Crop/examples/react/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/react/test-2.html)

### PC Example

![PC Example](https://newbieyoung.github.io/images/simple-crop-11.jpg)

- script

[https://newbieyoung.github.io/Simple-Crop/examples/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

- React

[https://newbieyoung.github.io/Simple-Crop/examples/react/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/react/test-1.html)

## Usage

### 1. import css style

Two default styles are currently provided; `./dist/template-2.css` for Mobile, `./dist/template-1.css` for PC.

- script

```html
<link rel="stylesheet" href="./dist/template-2.css" />
```

- React

```javascript
import "./dist/template-2.css";
```

### 2. import component code

SimpleCrop expects to implement full framework support, but currently only supports script and React. The corresponding code is as follows:

- script

```html
<script src="./index.js"></script>
```

- React

```javascript
import { SimpleCrop } from "./index-react.jsx";
```

### 3. initialization

- Mobile initialization parameters example:

```javascript
new SimpleCrop({
  src: "./img/test2.jpg",
  size: {
    width: 1000,
    height: 600
  },
  cropSizePercent: 0.9,
  cropCallback: function() {
    this.$resultCanvas.style.marginRight = "10px";
    this.$resultCanvas.style.width = "50%";
    document.body.appendChild(this.$resultCanvas);
  }
});
```

- PC initialization parameters example:

```javascript
new SimpleCrop({
  title: "Image is too large, please crop.",
  src: "./img/test1.jpg",
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
  startAngle: -180,
  endAngle: 180,
  gapAngle: 10,
  cropCallback: function() {
    this.$resultCanvas.style.marginRight = "10px";
    this.$resultCanvas.style.width = "50%";
    document.body.appendChild(this.$resultCanvas);
  },
  coverDraw: function() {
    //...
  }
});
```

## License

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.

## Properties And Methods

<table style="word-break: normal;">
	<tr>
		<td>property</td>
		<td>description</td>
	</tr>
	<tr>
		<td>debug</td>
		<td>Debug mode (Turn on debugging mode will show the automatic adsorption process of image.) </td>
	</tr>
	<tr>
		<td>title</td>
		<td>Component title</td>
	</tr>
	<tr>
		<td>src</td>
		<td>Image src</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>Whether to show component</td>
	</tr>
	<tr>
		<td>$container</td>
		<td>Component container (If no container is set, the component will be added to the body element by default.)</td>
	</tr>
	<tr>
		<td>scaleSlider</td>
		<td>Whether to enable the scale slider（Recommended for PC, 移动端默认会启动双指操作方式）</td>
	</tr>
	<tr>
		<td>size</td>
		<td>裁剪图片尺寸</td>
	</tr>
	<tr>
		<td>zIndex</td>
		<td>组件层级</td>
	</tr>
	<tr>
		<td>positionOffset</td>
		<td>裁剪框偏移，一般默认裁剪框在画布中心，如果不想在中心则需要设置这个属性来对其位置进行一定的偏移</td>
	</tr>
	<tr>
		<td>maxScale</td>
		<td>最大缩放倍数，如果裁剪图片放大至设置的最大缩放倍数仍然不能完全填满裁剪框，则最大缩放倍数会强制等于 Math.ceil(填满裁剪框的初始化缩放倍数)</td>
	</tr>
	<tr>
		<td>borderWidth</td>
		<td>裁剪框边框宽度</td>
	</tr>
	<tr>
		<td>borderColor</td>
		<td>裁剪框边框颜色</td>
	</tr>
	<tr>
		<td>noBoldCorner</td>
		<td>裁剪框边角是否不加粗</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>裁剪框占裁剪显示区域的比例，0.9表示所占比例为90%</td>
	</tr>
	<tr>
		<td>coverColor</td>
		<td>遮罩框背景颜色</td>
	</tr>
	<tr>
		<td>funcBtns</td>
		<td>默认功能按钮（目前支持 upload 重新上传、crop 裁剪图片、close 取消、around 90度旋转、reset 重置）</td>
	</tr>
	<tr>
		<td>rotateSlider</td>
		<td>是否开启旋转刻度盘（默认开启）</td>
	</tr>
	<tr>
		<td>startAngle</td>
		<td>旋转刻度盘开始角度</td>
	</tr>
	<tr>
		<td>endAngle</td>
		<td>旋转刻度盘结束角度</td>
	</tr>
	<tr>
		<td>gapAngle</td>
		<td>旋转刻度盘刻度间隔角度</td>
	</tr>
	<tr>
		<td>lineationItemWidth</td>
		<td>旋转刻度盘单刻度盘宽度（单位 px）</td>
	</tr>
	<tr>
		<td>borderDraw</td>
		<td>裁剪框自定义边框绘制函数</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>裁剪框自定义辅助线绘制函数</td>
	</tr>
	<tr>
		<td>uploadCallback</td>
		<td>重新上传裁剪图片回调函数</td>
	</tr>
	<tr>
		<td>closeCallback</td>
		<td>关闭裁剪组件回调函数</td>
	</tr>
	<tr>
		<td>cropCallback</td>
		<td>图片裁剪完成回调函数（在函数中通过 this.$resultCanvas 来获取裁剪结果）</td>
	</tr>
</table>

<table style="word-break: normal;">
	<tr>
		<td>方法</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>setImage</td>
		<td>设置裁剪图片</td>
	</tr>
	<tr>
		<td>show</td>
		<td>显示</td>
	</tr>
	<tr>
		<td>hide</td>
		<td>隐藏</td>
	</tr>
</table>

## 依赖的第三方库

- AlloyFinger [https://github.com/AlloyTeam/AlloyFinger](https://github.com/AlloyTeam/AlloyFinger) 处理移动端触摸操作；

- Exif.js [https://github.com/exif-js/exif-js](https://github.com/exif-js/exif-js) 获取图片元数据；

- prefix-umd [https://github.com/newbieYoung/prefix-umd](https://github.com/exif-js/exif-js) 处理 css 属性前缀。

## 原理及实现

`SimpleCrop 媲美原生体验的 Web 图片裁剪组件` [https://newbieweb.lione.me/2019/05/16/simple-crop/](https://newbieweb.lione.me/2019/05/16/simple-crop/)
