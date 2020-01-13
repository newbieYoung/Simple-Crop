# SimpleCrop

`全网唯一`支持裁剪图片任意角度旋转、交互体验`媲美原生客户端`的 Web 图片裁剪组件。

[English](README.md)

## 特性及优势

和目前流行的 Web 图片裁剪组件相比，其优势在于以下几点：

- 裁剪图片支持任意角度旋转；
- 支持边界判断、当裁剪框里出现空白时，图片自动吸附至完全填满裁剪框；
- 移动端缩放以双指中心为基准点；
- 基于自定义样式、自适应事件监听等，支持移动设备和 PC；
- 支持 script 标签、React、Vue、AngularJS 等多种开发模式（Vue、AngularJS 待实现）；
- 操作体验媲美原生客户端。

## 安装

```
npm install simple-crop
```

## 示例

### 移动端示例

![移动端示例](https://newbieyoung.github.io/images/simple-crop-0.jpg)

> 左侧是 IOS 系统相册中原生的图片裁剪功能，右侧为 SimpleCrop 移动端示例。

可以扫描二维码体验：

![移动端示例二维码](https://newbieyoung.github.io/images/simple-crop-1.png)

或者访问以下链接：

- script 标签

[https://newbieyoung.github.io/Simple-Crop/examples/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)

- React

[https://newbieyoung.github.io/Simple-Crop/examples/react/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/react/test-2.html)

### PC 示例

![PC 示例](https://newbieyoung.github.io/images/simple-crop-11.jpg)

- script 标签

[https://newbieyoung.github.io/Simple-Crop/examples/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

- React

[https://newbieyoung.github.io/Simple-Crop/examples/react/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/react/test-1.html)

## 用法

### 1、引入样式

目前提供了两种默认样式 `./dist/template-2.css` 适用移动设备，`./dist/template-1.css` 适用 PC。

- link 标签

```html
<link rel="stylesheet" href="./dist/template-2.css" />
```

- React

```javascript
import "./dist/template-2.css";
```

### 2、引入组件代码

SimpleCrop 期望实现全框架支持，但是目前仅支持 script 标签和 React 两种，对应代码如下：

- script 标签

```html
<script src="./index.js"></script>
```

- React

```javascript
import { SimpleCrop } from "./index-react.jsx";
```

### 3、初始化

- 移动端初始化参数示例：

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

- PC 初始化参数示例：

```javascript
new SimpleCrop({
  title: "上传图片过大，请裁剪",
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

## 开源许可协议

[MIT](http://opensource.org/licenses/MIT) License.

## 常用属性及方法说明

<table style="word-break: normal;">
	<tr>
		<td>属性</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>debug</td>
		<td>是否开启调试模式（开启调试模式会动态显示内容图片自动吸附填满裁剪框的过程）</td>
	</tr>
	<tr>
		<td>title</td>
		<td>标题</td>
	</tr>
	<tr>
		<td>src</td>
		<td>素材图片地址</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>是否显示组件</td>
	</tr>
	<tr>
		<td>$container</td>
		<td>容器（如果不设置容器那么裁剪组件会默认添加到 body 元素中）</td>
	</tr>
	<tr>
		<td>scaleSlider</td>
		<td>是否开启缩放滑动控制条（PC建议开启，移动端默认会启动双指滑动缩放方式）</td>
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
		<td>遮罩背景颜色</td>
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
		<td>旋转刻度盘间隔角度</td>
	</tr>
	<tr>
		<td>lineationItemWidth</td>
		<td>旋转刻度盘间隔宽度（单位 px）</td>
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
		<td>显示组件</td>
	</tr>
	<tr>
		<td>hide</td>
		<td>隐藏组件</td>
	</tr>
</table>

## 依赖的第三方库

- AlloyFinger [https://github.com/AlloyTeam/AlloyFinger](https://github.com/AlloyTeam/AlloyFinger) 处理移动端触摸操作；

- Exif.js [https://github.com/exif-js/exif-js](https://github.com/exif-js/exif-js) 获取图片元数据；

- prefix-umd [https://github.com/newbieYoung/prefix-umd](https://github.com/exif-js/exif-js) 处理 css 属性前缀。

## 原理及实现

`SimpleCrop 媲美原生体验的 Web 图片裁剪组件` [https://newbieweb.lione.me/2019/05/16/simple-crop/](https://newbieweb.lione.me/2019/05/16/simple-crop/)
