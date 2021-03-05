# Document

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
		<td>Crop box offset, the crop box defaults to the center of the container.</td>
		<td>All</td>
	</tr>
	<tr>
		<td>borderWidth</td>
		<td>Crop box border width</td>
		<td>All</td>
	</tr>
	<tr>
		<td>borderColor</td>
		<td>Crop box border color</td>
		<td>All</td>
	</tr>
	<tr>
		<td>boldCornerLen</td>
		<td>The bold length of the crop box corners.</td>
		<td>All</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>The proportion of the crop box to the crop display area, 0.9 means 90%.</td>
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
		<td>Crop box custom border drawing function</td>
		<td>All</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>Crop box custom auxiliary line drawing function</td>
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
		<td>No Wechat</td>
	</tr>
	<tr>
		<td>title</td>
		<td>Component title</td>
		<td>No Wechat</td>
	</tr>
	<tr>
		<td>$container</td>
		<td>Component container (If no container is set, the component will be added to the body element by default.)</td>
		<td>No Wechat</td>
	</tr>
</table>

## Methods

<table style="word-break: normal;">
	<tr>
		<td>Method</td>
		<td>Description</td>
		<td>Platform</td>
	</tr>
	<tr>
		<td>setImage</td>
		<td>Set crop picture</td>
		<td>All</td>
	</tr>
	<tr>
		<td>initRotateSlider</td>
		<td>Set rotary slider</td>
		<td>All</td>
	</tr>
	<tr>
		<td>initFuncBtns</td>
		<td>Set function buttons</td>
		<td>All</td>
	</tr>
	<tr>
		<td>updateBox</td>
		<td>Set crop box</td>
		<td>All</td>
	</tr>
	<tr>
		<td>initBoxBorder</td>
		<td>Set crop box border</td>
		<td>All</td>
	</tr>
	<tr>
		<td>show</td>
		<td>Show component</td>
		<td>No Wechat</td>
	</tr>
	<tr>
		<td>hide</td>
		<td>Hide component</td>
		<td>No Wechat</td>
	</tr>
	<tr>
		<td>initTitle</td>
		<td>Set title</td>
		<td>No Wechat</td>
	</tr>
</table>

## Dependencies

- transformation-matrix [https://github.com/chrvadala/transformation-matrix](https://github.com/chrvadala/transformation-matrix) Handle the displacement transformation matrix.

- Exif.js [https://github.com/exif-js/exif-js](https://github.com/exif-js/exif-js) Get image metadata.

- prefix-umd [https://github.com/newbieYoung/prefix-umd](https://github.com/exif-js/exif-js) Handle css prefixes.

## More

`全平台（Vue、React、微信小程序）任意角度旋转 图片裁剪组件` [https://newbieweb.lione.me/2019/05/16/simple-crop/](https://newbieweb.lione.me/2019/05/16/simple-crop/)
