# SimpleCrop

`the only` web picture cropping component that supports cropping pictures at any angle and has an `interactive experience` comparable to native clients.

[中文](README-zh.md)

## Features

Compared with the currently popular Web picture cropping components, its advantages are as follows:

- Picture supports rotation at any angle.
- Supports border judgment. When there is a blank in the crop frame, the picture is automatically absorbed to completely fill the crop frame.
- Touch scaling is based on the center of two fingers.
- Supports mobile and PC.
- Supports script, React, Vue, AngularJS (Vue, AngularJS to be implemented).
- Has an interactive experience comparable to native clients.

## Installation

```
npm install simple-crop
```

## Examples

### Mobile Example

![Mobile example](https://newbieyoung.github.io/images/simple-crop-0.jpg)

> On the left is the picture cropping example in the IOS system album, and on the right is the SimpleCrop mobile example.

Scan the QR code:

![QR code for mobile example](https://newbieyoung.github.io/images/simple-crop-1.png)

Visit the following links:

- script

[https://newbieyoung.github.io/Simple-Crop/examples/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)

- React

[https://newbieyoung.github.io/Simple-Crop/examples/react/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/react/test-2.html)

### PC Example

![PC example](https://newbieyoung.github.io/images/simple-crop-11.jpg)

- script

[https://newbieyoung.github.io/Simple-Crop/examples/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

- React

[https://newbieyoung.github.io/Simple-Crop/examples/react/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/react/test-1.html)

## Usage

### 1. import css style

Two default styles are currently provided, `./dist/template-2.css` for mobile, `./dist/template-1.css` for PC.

- script

```html
<link rel="stylesheet" href="./dist/template-2.css" />
```

- React

```javascript
import "./dist/template-2.css";
```

### 2. import component code

SimpleCrop expects to implement full framework support, but currently only supports script and React. The corresponding codes are as follows:

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
  title: "Picture is too large, please crop.",
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

## Properties and Methods

<table style="word-break: normal;">
	<tr>
		<td>Property</td>
		<td>Description</td>
	</tr>
	<tr>
		<td>debug</td>
		<td>Debug mode (Turn on debugging mode will show the automatic adsorption process of picture.) </td>
	</tr>
	<tr>
		<td>title</td>
		<td>Component title</td>
	</tr>
	<tr>
		<td>src</td>
		<td>Picture src</td>
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
		<td>Whether to enable the scale slider（Recommended for PC, Two-finger operation is activated by default on the mobile.）</td>
	</tr>
	<tr>
		<td>size</td>
		<td>Target size</td>
	</tr>
	<tr>
		<td>zIndex</td>
		<td>Component's z-index css property</td>
	</tr>
	<tr>
		<td>positionOffset</td>
		<td>Crop frame offset, the crop frame defaults to the center of the canvas.</td>
	</tr>
	<tr>
		<td>maxScale</td>
		<td>Maximum zoom factor, If the cropped picture is enlarged to the set maximum zoom factor and still cannot completely fill the crop frame, the maximum zoom factor will be forced to equal Math.ceil( Initial zoom factor to fill the crop frame ).</td>
	</tr>
	<tr>
		<td>borderWidth</td>
		<td>Crop frame border width</td>
	</tr>
	<tr>
		<td>borderColor</td>
		<td>Crop frame border color</td>
	</tr>
	<tr>
		<td>noBoldCorner</td>
		<td>Whether the corners of the crop frame are not bold.</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>The proportion of the crop frame to the crop display area, 0.9 means 90%.</td>
	</tr>
	<tr>
		<td>coverColor</td>
		<td>Cover background color</td>
	</tr>
	<tr>
		<td>funcBtns</td>
		<td>Function buttons ( Currently supported: upload, crop, close, around, reset.)</td>
	</tr>
	<tr>
		<td>rotateSlider</td>
		<td>Whether to turn the rotary dial ( On by default ).</td>
	</tr>
	<tr>
		<td>startAngle</td>
		<td>Rotating dial start angle</td>
	</tr>
	<tr>
		<td>endAngle</td>
		<td>Rotating dial end angle</td>
	</tr>
	<tr>
		<td>gapAngle</td>
		<td>Rotating dial interval angle</td>
	</tr>
	<tr>
		<td>lineationItemWidth</td>
		<td>Rotating dial interval width ( Unit px )</td>
	</tr>
	<tr>
		<td>borderDraw</td>
		<td>Crop frame custom border drawing function</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>Crop frame custom auxiliary line drawing function</td>
	</tr>
	<tr>
		<td>uploadCallback</td>
		<td>Re-upload cropped picture callback function</td>
	</tr>
	<tr>
		<td>closeCallback</td>
		<td>Close cropping component callback function</td>
	</tr>
	<tr>
		<td>cropCallback</td>
		<td>Picture cropping completion callback function ( Use `this.$resultCanvas` to get the crop result. )</td>
	</tr>
</table>

<table style="word-break: normal;">
	<tr>
		<td>Method</td>
		<td>Description</td>
	</tr>
	<tr>
		<td>setImage</td>
		<td>Set crop picture</td>
	</tr>
	<tr>
		<td>show</td>
		<td>Display component</td>
	</tr>
	<tr>
		<td>hide</td>
		<td>Hidden component</td>
	</tr>
</table>

## Dependencies

- AlloyFinger [https://github.com/AlloyTeam/AlloyFinger](https://github.com/AlloyTeam/AlloyFinger) Handle mobile touch operations.

- Exif.js [https://github.com/exif-js/exif-js](https://github.com/exif-js/exif-js) Get image metadata.

- prefix-umd [https://github.com/newbieYoung/prefix-umd](https://github.com/exif-js/exif-js) Handle css prefixes.

## More

`SimpleCrop 媲美原生体验的 Web 图片裁剪组件` [https://newbieweb.lione.me/2019/05/16/simple-crop/](https://newbieweb.lione.me/2019/05/16/simple-crop/)
