# SimpleCrop

一个在`功能`和`交互`上复刻移动设备原生图片裁剪功能的 Web 图片裁剪组件。

之所以会做这个项目主要是因为已知的图片裁剪组件并不能完全满足自己的要求，比如：

- `Croppie`：[https://github.com/foliotek/croppie](https://github.com/foliotek/croppie)

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-2.jpg">
 
只支持旋转固定角度。

- `AlloyCrop`：[https://github.com/AlloyTeam/AlloyCrop](https://github.com/AlloyTeam/AlloyCrop)

完全不支持旋转。

因此和目前流行的 Web 图片裁剪组件相比，其优势在于以下几点：

- 1、裁剪图片支持任意角度旋转；
- 2、支持边界判断、当裁剪框里出现空白时，图片自动吸附至完全填满裁剪框；
- 3、裁剪框位置支持偏移（可以不用固定在页面中心）。

### 安装

```
npm install simple-crop
```

### 移动端示例

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-0.jpg">

> 左侧是 IOS 系统自带的图片裁剪功能，右侧为组件的示例一；

可以扫描二维码体验：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-1.png">

或者访问以下链接：

[https://newbieyoung.github.io/Simple-Crop/test-2.html](https://newbieyoung.github.io/Simple-Crop/test-2.html)

首先引入移动端样式；

```html
<link rel="stylesheet" href="./dist/template-2.css" />
```

然后配置如下参数初始化；

```javascript
var offsetTop = document.documentElement.clientHeight * 0.04
var offsetLeft = document.documentElement.clientWidth * 0.02

var simpleCrop = new SimpleCrop({
  src: './img/test3.jpg',
  size: {
    width: 1000,
    height: 600
  },
  cropSizePercent: 0.9,
  positionOffset: {
    left: offsetLeft,
    top: offsetTop
  },
  cropCallback: function() {
    this.$resultCanvas.style.marginRight = '10px'
    this.$resultCanvas.style.width = '50%'
    document.body.appendChild(this.$resultCanvas)
  }
})
```

当需要重新换张图片裁剪时，调用`show`方法即可，其参数可以是`图片路径`或者`图片文件`；

```javascript
simpleCrop.show('./img/test3.jpg')
```

因为需要用到多指触摸操作，目前使用[AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

<table style="word-break: normal;">
	<tr>
		<td>参数</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>src</td>
		<td>素材图片地址</td>
	</tr>
	<tr>
		<td>size</td>
		<td>裁剪图片尺寸</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>裁剪框占裁剪显示区域的比例，0.9表示所占比例为90%</td>
	</tr>
	<tr>
		<td>positionOffset</td>
		<td>裁剪框偏移，一般默认裁剪框在画布中心，如果不想在中心则需要设置这个属性来对其位置进行一定的偏移</td>
	</tr>
	<tr>
		<td>cropCallback</td>
		<td>图片裁剪回调函数，在函数中通过<b>this.$resultCanvas</b>来获取裁剪结果</td>
	</tr>
</table>

### PC 端示例

如图：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-11.jpg">

请访问以下链接[https://newbieyoung.github.io/Simple-Crop/test-1.html](https://newbieyoung.github.io/Simple-Crop/test-1.html)

首先引入 PC 端样式；

```
<link rel="stylesheet" href="./dist/template-1.css">
```

然后配置如下参数初始化；

```javascript
var simpleCrop = new SimpleCrop({
  title: '上传图片过大，请裁剪',
  src: './img/test1.jpg',
  size: {
    width: 800,
    height: 900
  },
  maxScale: 2,
  controller: ['mouse'],
  borderWidth: 2,
  funcBtns: ['close', 'crop', 'upload'],
  borderColor: '#0BFF00',
  coverColor: 'rgba(0,0,0,.5)',
  scaleSlider: true,
  startAngle: 0,
  endAngle: 360,
  gapAngle: 10,
  cropCallback: function() {
    this.$resultCanvas.style.marginRight = '10px'
    this.$resultCanvas.style.width = '50%'
    document.body.appendChild(this.$resultCanvas)
  },
  coverDraw: function() {
    //
  }
})
```

<table style="word-break: normal;">
	<tr>
		<td>参数</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>title</td>
		<td>标题</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>辅助线绘制函数</td>
	</tr>
</table>

### 其它

相关原理以及实现请查看[SimpleCrop 媲美原生体验的 Web 图片裁剪组件](https://newbieweb.lione.me/2019/05/16/simple-crop/)
