# SimpleCrop

> &copy; Young 2018-07-28 11:27
> Welcome to My [GitHub](https://github.com/newbieYoung "GitHub")

从前有座山，山里有个程序员，他造了一个裁剪图片的轮子，最近又丰富了这个轮子的功能；

[SimpleCrop](https://github.com/newbieYoung/Simple-Crop)

至于为什么要造这个轮子，主要是因为已知的图片裁剪组件不能完全满足自己的要求，比如：

[Croppie](https://github.com/foliotek/croppie)

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-2.jpg">

> 只支持旋转固定角度；

[AlloyCrop ](https://github.com/AlloyTeam/AlloyCrop)

> 完全不支持旋转；

[cropperjs](https://github.com/fengyuanchen/cropperjs)

> 这个组件功能倒是挺全，但是交互和预想的差别挺大，另外代码偏多（不想用别人的总得找点理由不是）。

> 顺便吐槽一句，那些个支持圆形裁剪框的组件，怕不是开发没有做过重构吧，就目前来说要在网页里边展示圆形等各种非矩形图片，还真的需要图片一定是圆形或者其它形状吗...

还有一些需要依赖`jQuery`，直接就PASS了，不要问我为什么...

`SimpleCrop`在功能和交互上完全参考了IOS的原生图片裁剪功能；

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-0.jpg">

> 左侧是IOS系统自带的图片裁剪功能，右侧为组件的示例二；

可以扫描二维码体验：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-1.png">

或者访问以下链接：

[https://newbieyoung.github.io/Simple-Crop/test-2.html](https://newbieyoung.github.io/Simple-Crop/test-2.html)

### 示例二

相关配置参数以及样式适用于移动端，代码如下：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-3.jpg">

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
		<td>裁剪区域实际尺寸</td>
	</tr>
	<tr>
		<td>borderWidth</td>
		<td>裁剪区域边框宽度</td>
	</tr>
	<tr>
		<td>cropSizePercent</td>
		<td>裁剪区域占画布比例，0.9表示所占比例为90%，示例二实际尺寸宽高相等，但是移动端一般宽度小于高度，因此表现为裁剪区域的显示尺寸为宽度等于屏幕宽度的90%</td>
	</tr>
	<tr>
		<td>controller</td>
		<td>控制方式，取值有两种，分别为<b>touch</b>表示触摸操作适用于移动端；<b>mouse</b>表示鼠标操作适用于PC</td>
	</tr>
	<tr>
		<td>positionOffset</td>
		<td>裁剪框偏移，一般默认裁剪框在画布中心，如果不想在中心则需要设置这个属性来对其位置进行一定的偏移</td>
	</tr>
	<tr>
		<td>funcBtns</td>
		<td>功能按钮设置，取值有四种，分别为<b>close</b>表示关闭功能按钮、<b>reset</b>表示还原功能按钮、<b>around</b>表示整角90度旋转按钮、<b>crop</b>表示裁剪按钮；属性中的顺序决定其DOM元素的层级顺序</td>
	</tr>
	<tr>
		<td>scaleSlider</td>
		<td>是否开启滑动缩放组件，因为在PC端不支持双指触摸，因此需要设置这个属性为true，来启动控制缩放的滑动组件，移动端没必要则设置为false</td>
	</tr>
	<tr>
		<td>rotateSlider</td>
		<td>是否开启旋转滑动组件，本来双指触摸既可以用来控制缩放也可以用来控制旋转，但是实际体验时感觉不能使用一种操作控制两种功能，因此最终只使用双指触摸控制缩放，旋转使用额外组件来控制</td>
	</tr>
	<tr>
		<td>cropCallback</td>
		<td>图片裁剪回调函数，在函数中通过<b>this.$resultCanvas</b>来获取裁剪结果</td>
	</tr>
</table>

### 示例一

如图：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-5.jpg">

请访问以下链接[https://newbieyoung.github.io/Simple-Crop/test-1.html](https://newbieyoung.github.io/Simple-Crop/test-1.html)

相关配置参数以及样式适用于PC端，代码如下：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/simple-crop-4.jpg">

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
		<td>borderDraw</td>
		<td>裁剪区域边框绘制函数，默认的边框绘制函数会绘制出<b>示例二</b>的样子，同时支持自定义，不过需要注意的是必需在第一行执行<b>this.cropCoverContext.clearRect(0,0,this.$cropCover.width,this.$cropCover.height);</b>来清空遮罩层（设计略不合理，待改进）</td>
	</tr>
	<tr>
		<td>coverDraw</td>
		<td>辅助线绘制函数</td>
	</tr>
</table>

### 小结

整个组件并没有什么所谓的技术难点，可能是因为毕业太久的原因，三个坐标系之间的转换弄的我略微有点头晕，至于为什么会有三个坐标系？

举例来说：

比如需要的截图的实际尺寸为680*680，但是因为容器的原因不能显示为实际尺寸，这里会保持宽高比例不变，进行一定的缩放，缩放之后也就存在逻辑尺寸和显示尺寸了；

另外图片尺寸固定，但是绘制时存在缩放，比如初始化时会让裁剪框尽量填满最多的图片，那么这里也就产生了一个逻辑上的画布坐标系；

再有移动、缩放、旋转素材图片时不能让裁剪框出现空白，这里的判断需要在一个坐标系中进行。
