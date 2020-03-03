# SimpleCrop

`全网唯一`支持裁剪图片任意角度旋转、交互体验`媲美原生客户端`的`全平台`图片裁剪组件。

[English](README-en.md)

## 特性及优势

和目前流行的图片裁剪组件相比，其优势在于以下几点：

- 裁剪图片支持任意角度旋转；
- 支持 Script 标签、微信小程序、React、Vue；
- 支持移动和 PC 设备；
- 支持边界判断、当裁剪框里出现空白时，图片自动吸附至完全填满裁剪框；
- 移动端缩放以双指中心为基准点；
- 交互体验媲美原生客户端。

## 安装

```bash
npm install simple-crop
```

## 示例

### 微信小程序示例

![微信小程序示例](https://newbieyoung.github.io/images/simple-crop-16.jpg)

### 移动端示例

![移动端示例](https://newbieyoung.github.io/images/simple-crop-0.jpg)

> 左侧是 IOS 系统相册中原生的图片裁剪功能，右侧为 SimpleCrop 移动端示例。

可以扫描二维码体验：

![移动端示例二维码](https://newbieyoung.github.io/images/simple-crop-1.png)

或者访问以下链接：

[https://newbieyoung.github.io/Simple-Crop/examples/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)

### PC 示例

![PC 示例](https://newbieyoung.github.io/images/simple-crop-11.jpg)

链接如下：

[https://newbieyoung.github.io/Simple-Crop/examples/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

## 用法

- [Script 用法](USAGE-script.md)
- [微信小程序用法](USAGE-wechat.md)
- [React 用法](USAGE-react.md)
- [Vue 用法](USAGE-vue.md)

## 开源许可协议

[MIT](http://opensource.org/licenses/MIT) License.

## 属性说明

<table style="word-break: normal;">
	<tr>
		<td>名称</td>
		<td>说明</td>
		<td>平台</td>
	</tr>
	<tr>
		<td>src</td>
		<td>图片地址</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>组件是否可见</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>size</td>
		<td>裁剪尺寸</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>positionOffset</td>
		<td>裁剪框偏移，一般默认裁剪框在画布中心，如果不想在中心则需要设置这个属性来对其位置进行一定的偏移</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>borderWidth</td>
		<td>裁剪框边框宽度</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>borderColor</td>
		<td>裁剪框边框颜色</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>boldCornerLen</td>
		<td>裁剪框边角加粗长度</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>裁剪框占裁剪显示区域的比例，0.9 表示所占比例为 90%</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>coverColor</td>
		<td>遮罩背景颜色</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>funcBtns</td>
		<td>默认功能按钮（目前支持 upload 重新上传、crop 裁剪图片、close 取消、around 90度旋转、reset 重置）</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>rotateSlider</td>
		<td>是否开启旋转刻度盘（默认开启）</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>startAngle</td>
		<td>旋转刻度盘开始角度</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>endAngle</td>
		<td>旋转刻度盘结束角度</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>gapAngle</td>
		<td>旋转刻度盘间隔角度</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>lineationItemWidth</td>
		<td>旋转刻度盘间隔宽度（单位 px）</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>borderDraw</td>
		<td>裁剪框自定义边框绘制函数</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>裁剪框自定义辅助线绘制函数</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>uploadCallback</td>
		<td>重新上传裁剪图片回调函数</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>closeCallback</td>
		<td>关闭裁剪组件回调函数</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>cropCallback</td>
		<td>图片裁剪完成回调函数</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>debug</td>
		<td>是否开启调试模式（开启调试模式会动态显示内容图片自动吸附填满裁剪框的过程）</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>title</td>
		<td>标题</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>$container</td>
		<td>容器（如果不设置容器那么裁剪组件会默认添加到 body 元素中）</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>scaleSlider</td>
		<td>是否开启缩放滑动控制条（PC建议开启，移动端默认会启动双指滑动缩放方式）</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>maxScale</td>
		<td>最大缩放倍数，如果裁剪图片放大至设置的最大缩放倍数仍然不能完全填满裁剪框，则最大缩放倍数会强制等于 Math.ceil(填满裁剪框的初始化缩放倍数)</td>
		<td>非微信小程序</td>
	</tr>
</table>

## 方法说明

<table style="word-break: normal;">
	<tr>
		<td>方法</td>
		<td>说明</td>
		<td>平台</td>
	</tr>
	<tr>
		<td>setImage</td>
		<td>设置裁剪图片</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>initRotateSlider</td>
		<td>初始化旋转刻度盘</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>initFuncBtns</td>
		<td>初始化功能按钮</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>updateBox</td>
		<td>初始化裁剪框</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>initBoxBorder</td>
		<td>初始化裁剪框边框以及遮罩</td>
		<td>全部</td>
	</tr>
	<tr>
		<td>initScaleSlider</td>
		<td>初始化滑动控制条</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>show</td>
		<td>显示组件</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>hide</td>
		<td>隐藏组件</td>
		<td>非微信小程序</td>
	</tr>
	<tr>
		<td>initTitle</td>
		<td>初始化标题</td>
		<td>非微信小程序</td>
	</tr>
</table>

## 依赖

- transformation-matrix [https://github.com/chrvadala/transformation-matrix](https://github.com/chrvadala/transformation-matrix) 处理位移变换矩阵；

- exif-js [https://github.com/exif-js/exif-js](https://github.com/exif-js/exif-js) 获取图片元数据；

- prefix-umd [https://github.com/newbieYoung/prefix-umd](https://github.com/exif-js/exif-js) 处理 css 属性前缀。

## 原理及实现

`全平台（Vue、React、微信小程序）任意角度旋转 图片裁剪组件` [https://newbieweb.lione.me/2019/05/16/simple-crop/](https://newbieweb.lione.me/2019/05/16/simple-crop/)
