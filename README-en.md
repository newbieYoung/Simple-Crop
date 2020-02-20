# SimpleCrop

The only `full-platform` picture cropping component that `supports cropping pictures at any angle` and interacts with the interaction experience comparable to that of native clients.

[中文](README.md)

## Features

Compared with the currently popular Web picture cropping components, its advantages are as follows:

- Picture supports rotation at any angle.
- Supports script, React, Vue, Wechat.
- Supports mobile and PC.
- Supports border judgment. When there is a blank in the crop frame, the picture is automatically absorbed to completely fill the crop frame.
- Touch scaling is based on the center of two fingers.
- Has an interactive experience comparable to native clients.

## Installation

```bash
npm install simple-crop
```

## Examples

### Mobile Example

![Mobile example](https://newbieyoung.github.io/images/simple-crop-0.jpg)

> On the left is the picture cropping example in the IOS system album, and on the right is the SimpleCrop mobile example.

Scan the QR code:

![QR code for mobile example](https://newbieyoung.github.io/images/simple-crop-1.png)

Visit the following links:

[https://newbieyoung.github.io/Simple-Crop/examples/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)

### PC Example

![PC example](https://newbieyoung.github.io/images/simple-crop-11.jpg)

[https://newbieyoung.github.io/Simple-Crop/examples/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

### Wechat Example

## Usage

- [script usage](USAGE-script.md)
- [wechat usage](USAGE-wechat.md)
- [React usage](USAGE-react.md)

## License

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.

## Properties

<table style="word-break: normal;">
	<tr>
		<td>Property</td>
		<td>Description</td>
		<td>Platform</td>
	</tr>
	<tr>
		<td>src</td>
		<td>Picture src</td>
		<td>All</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>Whether the component is visible</td>
		<td>All</td>
	</tr>
	<tr>
		<td>size</td>
		<td>Target size</td>
		<td>All</td>
	</tr>
	<tr>
		<td>positionOffset</td>
		<td>Crop frame offset, the crop frame defaults to the center of the container.</td>
		<td>All</td>
	</tr>
	<tr>
		<td>borderWidth</td>
		<td>Crop frame border width</td>
		<td>All</td>
	</tr>
	<tr>
		<td>borderColor</td>
		<td>Crop frame border color</td>
		<td>All</td>
	</tr>
	<tr>
		<td>boldCornerLen</td>
		<td>The bold length of the crop frame corners.</td>
		<td>All</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>The proportion of the crop frame to the crop display area, 0.9 means 90%.</td>
		<td>All</td>
	</tr>
	<tr>
		<td>coverColor</td>
		<td>Cover background color</td>
		<td>All</td>
	</tr>
	<tr>
		<td>funcBtns</td>
		<td>Function buttons ( Currently supports: upload, crop, close, around, reset.)</td>
		<td>All</td>
	</tr>
	<tr>
		<td>rotateSlider</td>
		<td>Whether to turn rotary slider ( On by default ).</td>
		<td>All</td>
	</tr>
	<tr>
		<td>startAngle</td>
		<td>Start angle of rotary slider</td>
		<td>All</td>
	</tr>
	<tr>
		<td>endAngle</td>
		<td>End angle of rotary slider</td>
		<td>All</td>
	</tr>
	<tr>
		<td>gapAngle</td>
		<td>Interval angle of rotary slider</td>
		<td>All</td>
	</tr>
	<tr>
		<td>lineationItemWidth</td>
		<td>Interval width of rotary slider ( Unit px )</td>
		<td>All</td>
	</tr>
	<tr>
		<td>borderDraw</td>
		<td>Crop frame custom border drawing function</td>
		<td>All</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>Crop frame custom auxiliary line drawing function</td>
		<td>All</td>
	</tr>
	<tr>
		<td>uploadCallback</td>
		<td>Re-upload cropped picture callback function</td>
		<td>All</td>
	</tr>
	<tr>
		<td>closeCallback</td>
		<td>Close cropping component callback function</td>
		<td>All</td>
	</tr>
	<tr>
		<td>cropCallback</td>
		<td>Picture cropping completion callback function</td>
	</tr>
	<tr>
		<td>debug</td>
		<td>Debug mode (Turn on debugging mode will show the automatic adsorption process of picture.) </td>
		<td>Not Wechat</td>
	</tr>
	<tr>
		<td>title</td>
		<td>Component title</td>
		<td>Not Wechat</td>
	</tr>
	<tr>
		<td>$container</td>
		<td>Component container (If no container is set, the component will be added to the body element by default.)</td>
		<td>Not Wechat</td>
	</tr>
	<tr>
		<td>scaleSlider</td>
		<td>Whether to enable the scalable slider（Recommended for PC, Two-finger operation is activated by default on the mobile.）</td>
		<td>Not Wechat</td>
	</tr>
	<tr>
		<td>maxScale</td>
		<td>Maximum zoom factor, If the cropped picture is enlarged to the set maximum zoom factor and still cannot completely fill the crop frame, the maximum zoom factor will be forced to equal Math.ceil( Initial zoom factor to fill the crop frame ).</td>
		<td>Not Wechat</td>
	</tr>
</table>

## Methods

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
		<td>Show component</td>
	</tr>
	<tr>
		<td>hide</td>
		<td>Hide component</td>
	</tr>
	<tr>
		<td>initRotateSlider</td>
		<td>Set rotary slider</td>
	</tr>
	<tr>
		<td>initFuncBtns</td>
		<td>Set function buttons</td>
	</tr>
	<tr>
		<td>initTitle</td>
		<td>Set title</td>
	</tr>
	<tr>
		<td>updateFrame</td>
		<td>Set crop frame</td>
	</tr>
	<tr>
		<td>initFrameBorder</td>
		<td>Set crop frame border</td>
	</tr>
	<tr>
		<td>initScaleSlider</td>
		<td>Set scalable slider</td>
	</tr>
</table>

## Dependencies

- transformation-matrix [https://github.com/chrvadala/transformation-matrix](https://github.com/chrvadala/transformation-matrix) Handle the displacement transformation matrix.

- Exif.js [https://github.com/exif-js/exif-js](https://github.com/exif-js/exif-js) Get image metadata.

- prefix-umd [https://github.com/newbieYoung/prefix-umd](https://github.com/exif-js/exif-js) Handle css prefixes.

## More

`SimpleCrop 媲美原生体验的 Web 图片裁剪组件` [https://newbieweb.lione.me/2019/05/16/simple-crop/](https://newbieweb.lione.me/2019/05/16/simple-crop/)
