(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['alloyfinger', 'prefix-umd', 'exif-js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('alloyfinger'), require('prefix-umd'), require('exif-js'));
    } else {
        // Browser globals
        window.SimpleCrop = factory(window.AlloyFinger, window.Prefix, window.EXIF);
    }
}(function (finger, Prefix, EXIF) {

    //兼容性处理
    function whichTransitionEvent() {
        var t;
        var el = document.createElement('div');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
            'MsTransition': 'msTransitionEnd'
        };
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
    var transitionEndEvent = whichTransitionEvent();
    var transformProperty = Prefix.prefix('transform');
    var transitionProperty = Prefix.prefix('transition');

    //includes方法兼容
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function (valueToFind, fromIndex) {
                var o = Object(this);
                var len = o.length >>> 0;
                if (len === 0) {
                    return false;
                }

                var n = fromIndex | 0;
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                function sameValueZero(x, y) {
                    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                }
                while (k < len) {
                    if (sameValueZero(o[k], valueToFind)) {
                        return true;
                    }
                    k++;
                }
                return false;
            }
        });
    }

    /**
     * ------------------------------------
     * 配置
     * @param title 组件标题
     * @param src   初始图片路径
     * @param maxScale 最大缩放倍数
     * @param size 截图实际宽高
     * @param debug 是否开启调试模式，开启调试模式会动态显示内容图片自动吸附填满裁剪框的过程
     * @param positionOffset 裁剪框屏幕偏移
     * @param $container 容器
     * @param scaleSlider 是否开启缩放滑动控制条（非移动端建议开启，移动端默认会启动双指操作方式）
     * @param funcBtns 功能按钮数组
     * ------------------------------------
     * 浏览器属性
     * @param isSupportTouch 是否支持 touch 事件
     * @param passiveSupported 事件是否支持 passive
     * ------------------------------------
     * 样式
     * @param zIndex 样式层级
     * @param noBoldCorner 裁剪框边角是否不加粗
     * @param coverColor 遮罩框背景颜色
     * @param cropSizePercent 裁剪区域占画布比例
     * @param borderWidth 裁剪框边框宽度
     * @param borderColor 裁剪框边框颜色
     * ------------------------------------
     * 自定义函数
     * @param coverDraw 裁剪框辅助线绘制函数
     * @param borderDraw 裁剪框边框绘制函数
     * @param cropCallback 确定裁剪回调函数
     * @param uploadCallback 重新上传回调函数
     * @param closeCallback 关闭回调函数
     * ------------------------------------
     * 旋转刻度盘
     * @param rotateSlider 是否开启旋转刻度盘（默认开启）
     * @param startAngle 开始角度
     * @param endAngle 结束角度
     * @param gapAngle 间隔角度
     * @param lineationItemWidth 单个刻度盘宽度，单位像素
     * ------------------------------------
     * 尺寸（为了减少计算的复杂性，所有坐标都统一为屏幕坐标及尺寸）
     * @param maskViewSize 容器的屏幕尺寸
     * @param cropRect 截图区域的屏幕尺寸
     * @param cropPoints 裁剪区域顶点坐标
     * @param contentPoints 图片显示区域矩形顶点坐标
     * @param _contentCurMoveX 图片 X 轴方向上的总位移
     * @param _contentCurMoveY 图片 Y 轴方向上的总位移
     * @param _orientation 图片元数据方向角
     * @param initContentPoints 图片显示区域矩形初始顶点坐标
     * ------------------------------------
     * 原始信息
     * @param originImage 原始裁剪图片
     * @param originWidth 裁剪图片原始宽度（考虑方向角）
     * @param originHeight 裁剪图片原始高度（考虑方向角）
     * ------------------------------------
     * 其它
     * @param times 实际尺寸/显示尺寸
     * @param initScale 初始缩放倍数
     * @param $resultCanvas 裁切结果
     */
    function SimpleCrop(params) {
        var self = this;

        //浏览器属性
        self.initCanvasTransform(); //初始化 canvas transform
        self.passiveSupported = false; //判断是否支持 passive
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    self.passiveSupported = true
                }
            })
            window.addEventListener('test', null, options)
        } catch (err) {
            //nothing
        }
        this.isSupportTouch = 'ontouchend' in document ? true : false; //判断是否支持 touch 事件

        //配置
        this.title = params.title;
        this.src = params.src;
        this.size = params.size;
        this.maxScale = params.maxScale ? params.maxScale : 1; //最大缩放倍数，默认为原始尺寸
        this.debug = params.debug != null ? params.debug : false;
        this.positionOffset = params.positionOffset != null ? params.positionOffset : {
            top: 0,
            left: 0
        };
        this.$container = params.$container != null ? params.$container : document.body; //容器
        this.scaleSlider = params.scaleSlider != null ? params.scaleSlider : false; //缩放滑动控制条
        this.borderWidth = params.borderWidth != null ? params.borderWidth : 1;
        this.borderColor = params.borderColor != null ? params.borderColor : '#fff';

        //操作属性
        this._multiPoint = false; //是否开始多点触控
        this._rotateScale = 1; //旋转缩放倍数
        this._baseMoveX = 0; //滑动旋转刻度盘位置初始化偏移量
        this._downPoint = []; //操作点坐标
        this._isControl = false; //是否正在操作
        /**
         * 旋转交互分为两种：
         * 一种是整角旋转（90度）；
         * 另一种是基于整角旋转的基础上正负45度旋转。
         */
        this._baseAngle = 0;
        this.scaleTimes = 1; //缩放倍数
        this.rotateAngle = 0; //旋转角度

        //样式属性
        this.id = 'crop-' + new Date().getTime();
        this.zIndex = params.zIndex != null ? params.zIndex : 9999;
        this.noBoldCorner = params.noBoldCorner != null ? params.noBoldCorner : false;
        this.coverColor = params.coverColor != null ? params.coverColor : 'rgba(0,0,0,.3)';
        this.cropSizePercent = params.cropSizePercent != null ? params.cropSizePercent : 0.5; //默认0.5则表示高度或者宽度最多占50%

        //自定义函数属性
        this.coverDraw = params.coverDraw != null ? params.coverDraw : this.defaultCoverDraw;
        this.borderDraw = params.borderDraw != null ? params.borderDraw : this.defaultBorderDraw;
        this.cropCallback = params.cropCallback || function () {};
        this.closeCallback = params.closeCallback || function () {};
        this.uploadCallback = params.uploadCallback || function () {};

        //旋转刻度盘
        this.rotateSlider = params.rotateSlider != null ? params.rotateSlider : true; //默认开启
        this.startAngle = params.startAngle != null ? params.startAngle : -90;
        this.endAngle = params.endAngle != null ? params.endAngle : 90;
        this.gapAngle = params.gapAngle != null ? params.gapAngle : 10;
        this.lineationItemWidth = params.lineationItemWidth != null ? params.lineationItemWidth : 40.5;

        /**
         * 默认功能按钮为取消、裁剪、90度旋转、重置
         * upload 重新上传
         * crop 裁剪
         * close 取消
         * around 90度旋转
         * reset 重置
         */
        this.funcBtns = params.funcBtns != null ? params.funcBtns : ['close', 'crop', 'around', 'reset'];

        this.construct();

        //相关元素
        this.$cropMask = document.querySelector('#' + this.id + ' .crop-mask');
        var maskStyle = window.getComputedStyle(this.$cropMask);
        this.maskViewSize = {
            width: parseInt(maskStyle.getPropertyValue('width')),
            height: parseInt(maskStyle.getPropertyValue('height'))
        }
        this.times = (this.size.width / this.maskViewSize.width > this.size.height / this.maskViewSize.height) ? this.size.width / this.maskViewSize.width / this.cropSizePercent : this.size.height / this.maskViewSize.height / this.cropSizePercent;
        this.$cropCover = document.querySelector('#' + this.id + ' .crop-cover');
        this.cropCoverContext = this.$cropCover.getContext('2d');
        this.$cropCover.width = this.maskViewSize.width * window.devicePixelRatio;
        this.$cropCover.height = this.maskViewSize.height * window.devicePixelRatio;

        //裁剪框位置相关
        this.cropRect = {
            width: this.size.width / this.times,
            height: this.size.height / this.times,
        };
        this.cropRect.left = (this.maskViewSize.width - this.cropRect.width) / 2 - this.positionOffset.left;
        this.cropRect.top = (this.maskViewSize.height - this.cropRect.height) / 2 - this.positionOffset.top;
        this.cropPoints = this.rectToPoints(this.cropRect);

        this.borderDraw();
        this.coverDraw();
        this.bindEvent();
        this.show(this.src);
    }

    //获取操作点
    SimpleCrop.prototype.getControlPoints = function (e) {
        if (e.touches) {
            return e.touches;
        } else {
            return [{
                clientX: e.clientX,
                clientY: e.clientY
            }]
        }
    }

    //获取操作事件名称
    SimpleCrop.prototype.getControlEvents = function () {
        if (this.isSupportTouch) {
            return {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend',
                cancel: 'touchcancel'
            }
        } else {
            return {
                start: 'mousedown',
                move: 'mousemove',
                end: 'mouseup',
                cancel: 'mouseleave'
            }
        }
    }

    //html结构
    SimpleCrop.prototype.construct = function () {
        var html = '';
        html += '<div class="crop-component">';

        if (this.title) {
            html += '<p class="crop-title">' + this.title + '</p>';
        }

        html += '<div class="crop-mask">'
        html += '<canvas class="crop-cover"></canvas>';
        html += '</div>';

        //支持触摸事件则采用双指缩放操作方式，否则采用缩放滑动控制条的操作方式
        if (this.scaleSlider || !this.isSupportTouch) {
            this.scaleSlider = true;
            html += '<div class="crop-scale">';
            html += '<div class="one-times-icon"></div>';
            html += '<div class="scale-container">';
            html += '<div class="scale-num"><span class="scale-value" style="width:0px;"></span><span class="scale-btn" style="left:-8px;"></span></div>';
            html += '</div>';
            html += '<div class="two-times-icon"></div>';
            html += '<div class="max-scale"></div>'
            html += '</div>';
        }

        if (this.rotateSlider) {
            html += '<div class="crop-rotate">'
            html += '<ul class="lineation" style="width:' + this.lineationItemWidth * ((this.endAngle - this.startAngle) / this.gapAngle + 1) + 'px;">';
            for (var i = this.startAngle; i <= this.endAngle; i += this.gapAngle) {
                html += '<li><div class="number">' + i + '</div><div class="bg"></div></li>';
            }
            html += '</ul>';
            html += '<div class="current"></div>';
            html += '</div>';
        }

        if (this.funcBtns.length > 0) {
            html += '<div class="crop-btns">';

            if (this.funcBtns.includes('upload')) {
                html += '<div class="upload-btn-container">';
                html += '<button class="upload-btn"></button>';
                html += '<input type="file" accept="image/png,image/jpeg">';
                html += '</div>';
            }
            if (this.funcBtns.includes('close')) {
                html += '<button class="crop-close"></button>';
            }
            if (this.funcBtns.includes('around')) {
                html += '<button class="crop-around"></button>';
            }
            if (this.funcBtns.includes('reset')) {
                html += '<button class="crop-reset"></button>';
            }
            if (this.funcBtns.includes('crop')) {
                html += '<button class="crop-btn"></button>';
            }

            html += '</div>';
        }

        html += '</div>';

        this.$target = document.createElement('div');
        this.$target.id = this.id;
        this.$target.classList.add('crop-whole-cover');
        this.$target.innerHTML = html;
        this.$target.style.zIndex = this.zIndex;
        this.$container.appendChild(this.$target);
        this.targetDisplay = window.getComputedStyle(this.$target).getPropertyValue('display');
    };

    //默认绘制裁剪框
    SimpleCrop.prototype.defaultBorderDraw = function () {
        this.cropCoverContext.clearRect(0, 0, this.$cropCover.width, this.$cropCover.height);
        this.cropCoverContext.fillStyle = this.coverColor;
        this.cropCoverContext.fillRect(0, 0, this.$cropCover.width, this.$cropCover.height);
        this.cropCoverContext.fillStyle = this.borderColor;

        //绘制边框（边框内嵌）
        var borderRect = {
            left: this.cropRect.left * window.devicePixelRatio,
            top: this.cropRect.top * window.devicePixelRatio,
            width: this.cropRect.width * window.devicePixelRatio,
            height: this.cropRect.height * window.devicePixelRatio
        }
        this.cropCoverContext.fillRect(borderRect.left, borderRect.top, borderRect.width, borderRect.height);

        if (!this.noBoldCorner) {
            //边框四个角加粗
            var percent = 0.05;
            var cornerRectWidth = borderRect.width * percent;
            var cornerRectHeight = borderRect.height * percent;
            this.cropCoverContext.fillRect(borderRect.left - this.borderWidth, borderRect.top - this.borderWidth, cornerRectWidth, cornerRectHeight); //左上角
            this.cropCoverContext.fillRect(borderRect.left + borderRect.width - cornerRectWidth + this.borderWidth, borderRect.top - this.borderWidth, cornerRectWidth, cornerRectHeight); //右上角
            this.cropCoverContext.fillRect(borderRect.left - this.borderWidth, borderRect.top + borderRect.height - cornerRectHeight + this.borderWidth, cornerRectWidth, cornerRectHeight); //左下角
            this.cropCoverContext.fillRect(borderRect.left + borderRect.width - cornerRectWidth + this.borderWidth, borderRect.top + borderRect.height - cornerRectHeight + this.borderWidth, cornerRectWidth, cornerRectHeight); //右下角
        }

        //清空内容区域
        this.cropCoverContext.clearRect(borderRect.left + this.borderWidth, borderRect.top + this.borderWidth, borderRect.width - 2 * this.borderWidth, borderRect.height - 2 * this.borderWidth);
    };

    //默认绘制辅助线
    SimpleCrop.prototype.defaultCoverDraw = function () {

    };

    //初始化
    SimpleCrop.prototype.init = function () {
        //初始位置垂直水平居中
        this._initTransform = 'translate3d(-50%,-50%,0)';
        this.$cropCover.classList.add('crop-content');
        this.$cropContent.style.position = 'absolute';
        this.$cropContent.style.left = '50%';
        this.$cropContent.style.top = '50%';
        this.$cropContent.style[transformProperty] = this._initTransform;
        this.$cropMask.insertBefore(this.$cropContent, this.$cropCover);

        var width = this.originWidth / 2;
        var height = this.originHeight / 2;
        this.initContentPoints = [{
            x: -width,
            y: height
        }, {
            x: width,
            y: height
        }, {
            x: width,
            y: -height
        }, {
            x: -width,
            y: -height
        }]
        this.contentPoints = this.initContentPoints.slice();

        //计算初始缩放倍数
        if (this.size.width / this.size.height > this.originWidth / this.originHeight) {
            this.initScale = this.size.width / this.originWidth;
        } else {
            this.initScale = this.size.height / this.originHeight;
        }
        this.maxScale = this.initScale < this.maxScale ? this.maxScale : Math.ceil(this.initScale);
        if (this.scaleSlider) {
            this.$maxScale = document.querySelector('#' + this.id + ' .max-scale');
            this.$maxScale.innerText = '(x' + this.maxScale + ')';
        }

        //重置动态操作变量
        this.reset();
    }

    //重置
    SimpleCrop.prototype.reset = function () {
        this.startControl();
        this._rotateScale = 1;
        this._baseAngle = 0;
        this.rotateAngle = 0;
        this._contentCurMoveX = -this.positionOffset.left;
        this._contentCurMoveY = -this.positionOffset.top;
        if (this.rotateSlider) {
            this.$lineation.setAttribute('movex', this._baseMoveX);
            this.$lineation.style[transformProperty] = 'translateX(' + this._baseMoveX + 'px)';
        }
        if (this.scaleSlider) {
            this.$scaleBtn.style[transformProperty] = 'translateX(0px)';
            this.$scaleValue.style.width = '0px';
            this.$scaleBtn.setAttribute('movex', 0);
            this.scaleCurLeft = this.scaleInitLeft;
        }
        this.scaleTimes = this.initScale;
        this.transform();
        this.endControl();
    }

    //加载图片
    SimpleCrop.prototype.load = function () {
        var self = this;
        self.$cropContent.onload = function () {
            self.originImage = self.$cropContent.cloneNode(true);
            EXIF.getData(self.$cropContent, function () {
                self._orientation = EXIF.getTag(this, 'Orientation');
                self.originWidth = self.$cropContent.width;
                self.originHeight = self.$cropContent.height;
                //方向角大于4时，宽高互换
                if (self._orientation > 4) {
                    self.originWidth = self.$cropContent.height;
                    self.originHeight = self.$cropContent.width;
                }
                self.init();
            });
        }
    };

    //显示
    SimpleCrop.prototype.show = function (image) {
        var self = this;
        if (self.$cropContent && image != null) {
            self.$cropMask.removeChild(self.$cropContent);
        }
        if (Object.prototype.toString.call(image) === '[object String]') { //字符串
            self.src = image;
            self.$cropContent = new Image();
            self.$cropContent.src = self.src;
            self.load();
            self.uploadCallback();
        } else if (Object.prototype.toString.call(image) === '[object File]') { //文件
            self.fileToSrc(image, function (src) {
                self.src = src;
                self.$cropContent = new Image();
                self.$cropContent.src = self.src;
                self.load();
                self.uploadCallback();
            });
        }
        self.$target.style.display = self.targetDisplay;
    };

    //隐藏
    SimpleCrop.prototype.hide = function () {
        this.$target.style.display = 'none';
    };

    //绑定事件
    SimpleCrop.prototype.bindEvent = function () {
        //获取事件相关dom元素
        var self = this;
        var controlEvents = this.getControlEvents();

        //裁剪
        if (self.funcBtns.includes('crop')) {
            self.$cropBtn = document.querySelector('#' + self.id + ' .crop-btn');
            self.$cropBtn.addEventListener('click', function () {
                self.getCropImage();
                self.cropCallback();
                self.hide();
            });
        }

        //上传
        if (self.funcBtns.includes('upload')) {
            self.$uploadBtn = document.querySelector('#' + self.id + ' .upload-btn-container');
            self.$uploadInput = document.querySelector('#' + self.id + ' .upload-btn-container input');
            self.$uploadBtn.addEventListener('change', function (evt) {
                var files = evt.target.files;
                if (files.length > 0) {
                    self.show(files[0]);
                }
                self.$uploadInput.value = ''; //清空value属性，从而保证用户修改文件内容但是没有修改文件名时依然能上传成功
            });
        }

        //整角旋转
        if (self.funcBtns.includes('around')) {
            self.$cropAround = document.querySelector('#' + self.id + ' .crop-around');
            self.$cropAround.addEventListener('click', function () {
                self.startControl();
                self.rotateAngle = self._baseAngle - 90;
                self._baseAngle = self.rotateAngle;
                if (self.rotateSlider) {
                    self.$lineation.setAttribute('movex', self._baseMoveX);
                    self.$lineation.style[transformProperty] = 'translateX(' + self._baseMoveX + 'px)';
                }
                self.transform();
                self.endControl();
            })
        }

        //还原
        if (self.funcBtns.includes('reset')) {
            self.$cropReset = document.querySelector('#' + self.id + ' .crop-reset');
            self.$cropReset.addEventListener('click', function () {
                self.reset();
            })
        }

        //关闭
        if (self.funcBtns.includes('close')) {
            self.$closeBtn = document.querySelector('#' + self.id + ' .crop-close');
            self.$closeBtn.addEventListener('click', function () {
                self.hide();
                self.closeCallback();
            });
        }

        //滑动缩放
        if (self.scaleSlider) {
            self.$scaleBtn = document.querySelector('#' + self.id + ' .scale-btn');
            self.$scaleNum = document.querySelector('#' + self.id + ' .scale-num');
            self.$scaleOneTimes = document.querySelector('#' + self.id + ' .one-times-icon');
            self.$scaleTwoTimes = document.querySelector('#' + self.id + ' .two-times-icon');
            self.$scaleContainer = document.querySelector('#' + self.id + ' .scale-container');
            self.$scaleValue = document.querySelector('#' + self.id + ' .scale-value');

            self.scaleDownX = 0;
            self.scaleInitLeft = self.$scaleBtn.getBoundingClientRect().left;
            self.scaleCurLeft = self.scaleInitLeft;
            self.scaleWidth = self.$scaleNum.getBoundingClientRect().width;

            self.$scaleBtn.addEventListener(controlEvents.start, function (ev) {
                self.scaleDownX = self.getControlPoints(ev)[0].clientX;
                self.startControl();
            });
            self.$scaleContainer.addEventListener(controlEvents.move, function (ev) {
                self.scaleMove(ev);
                ev.stopPropagation();
            });
            self.$scaleContainer.addEventListener(controlEvents.cancel, self.endControl.bind(self)); //结束
            self.$scaleContainer.addEventListener(controlEvents.end, self.endControl.bind(self));
            self.$scaleContainer.addEventListener('click', function (ev) {
                self.startControl();
                var rect = self.$scaleBtn.getBoundingClientRect();
                if (self.scaleDownX <= 0) {
                    self.scaleDownX = rect.left + rect.width * 1.0 / 2;
                }
                self.scaleMove(ev);
                self.endControl();
            });
            self.$scaleOneTimes.addEventListener('click', function () { //极小
                self.startControl();
                self.scaleMoveAt(0);
                self.endControl();
            });
            self.$scaleTwoTimes.addEventListener('click', function () { //极大
                self.startControl();
                self.scaleMoveAt(self.scaleWidth);
                self.endControl();
            });
        } else if (self.isSupportTouch) { // 双指缩放
            var lastScale = 1;
            new finger(self.$container, {
                multipointStart: function (evt) {
                    self._multiPoint = true; //多点触摸开始
                    var touches = evt.touches;
                    var center = {
                        clientX: (touches[0].clientX + touches[1].clientX) / 2,
                        clientY: (touches[0].clientY + touches[1].clientY) / 2
                    }
                    self.fingerCenter = { //双指操作触摸点中心
                        x: center.clientX - self.maskViewSize.width / 2,
                        y: self.maskViewSize.height / 2 - center.clientY
                    }
                },
                pinch: function (evt) { //缩放
                    if (self._multiPoint) {
                        var scale = evt.zoom;
                        self.scaleTimes = self.scaleTimes / lastScale * scale;
                        var translate = self.getFingerScaleTranslate(scale / lastScale);
                        self._contentCurMoveX -= translate.translateX;
                        self._contentCurMoveY += translate.translateY;
                        lastScale = scale;
                        self.transform(false, true);
                    }
                },
                multipointEnd: function () {
                    self._multiPoint = false; //多点触摸结束
                    lastScale = 1;
                }
            });
        }

        //滑动旋转
        if (self.rotateSlider) {
            self.$cropRotate = document.querySelector('#' + self.id + ' .crop-rotate');
            self.$lineation = document.querySelector('#' + self.id + ' .lineation');
            self.$rotateCurrent = document.querySelector('#' + self.id + ' .current');

            //初始化刻度位置
            var lineationStyle = window.getComputedStyle(self.$lineation);
            var lineationWidth = parseFloat(lineationStyle.getPropertyValue('width'));
            var rotateStyle = window.getComputedStyle(self.$cropRotate);
            var rotateWidth = parseFloat(rotateStyle.getPropertyValue('width'));
            self._baseMoveX = -(lineationWidth / 2 - rotateWidth / 2);
            self.$lineation.setAttribute('movex', self._baseMoveX);
            self.$lineation.style[transformProperty] = 'translateX(' + self._baseMoveX + 'px)';

            self.$cropRotate.addEventListener(controlEvents.start, function (e) {
                var touch = self.getControlPoints(e)[0];
                self.startControl([touch.clientX, touch.clientY]);
            });
            self.$cropRotate.addEventListener(controlEvents.move, function (e) {
                var touch = self.getControlPoints(e)[0];
                var point = [touch.clientX, touch.clientY];
                var moveX = point[0] - self._downPoint[0];
                var lastMoveX = self.$lineation.getAttribute('movex');
                if (!lastMoveX) {
                    lastMoveX = 0;
                } else {
                    lastMoveX = parseFloat(lastMoveX);
                }
                var curMoveX = lastMoveX + moveX;
                var angle = (curMoveX - self._baseMoveX) / lineationWidth * (self.endAngle - self.startAngle + self.gapAngle);

                if (angle <= self.endAngle / 2 && angle >= self.startAngle / 2) {
                    self.$lineation.setAttribute('movex', curMoveX);
                    self.$lineation.setAttribute('changedx', moveX);
                    self.$lineation.style[transformProperty] = 'translateX(' + curMoveX + 'px)';
                    self.rotateAngle = self._baseAngle + angle;
                    self.transform(true);
                    self._downPoint = point;
                }
                e.stopPropagation(); //阻止事件冒泡
                e.preventDefault();
            });
            self.$cropRotate.addEventListener(controlEvents.end, self.endControl.bind(self)); //结束
            self.$cropRotate.addEventListener(controlEvents.cancel, self.endControl.bind(self));
        }

        //移动
        var $imageListenerEle = self.isSupportTouch ? self.$container : self.$cropMask;
        $imageListenerEle.addEventListener(controlEvents.start, function (ev) {
            var points = self.getControlPoints(ev);
            self.startControl([points[0].clientX, points[0].clientY]);
        });
        var options = self.passiveSupported ? {
            passive: false,
            capture: false
        } : false;
        $imageListenerEle.addEventListener(controlEvents.move, function (ev) {
            var points = self.getControlPoints(ev);
            self.contentMove([points[0].clientX, points[0].clientY]);
            ev.preventDefault();
        }, options);
        $imageListenerEle.addEventListener(controlEvents.end, self.endControl.bind(self)); //结束
        $imageListenerEle.addEventListener(controlEvents.cancel, self.endControl.bind(self));
    };

    //双指缩放优化为以双指中心为基础点，实际变换以中心点为基准点，因此需要计算两者的偏移
    SimpleCrop.prototype.getFingerScaleTranslate = function (scale) {
        var fingerPoints = []; //以双指中心缩放的新坐标
        var center = this.getPointsCenter(this.contentPoints); //中心点不变
        for (var i = 0; i < this.contentPoints.length; i++) {
            var point = this.contentPoints[i];
            fingerPoints.push({
                x: point.x * scale - this.fingerCenter.x * (scale - 1),
                y: point.y * scale - this.fingerCenter.y * (scale - 1)
            })
        }
        var newCenter = this.getPointsCenter(fingerPoints);
        return {
            translateX: center.x - newCenter.x,
            translateY: center.y - newCenter.y
        }
    }

    //处理方向角坐标系
    SimpleCrop.prototype.transformCoordinates = function () {
        var $imageCanvas = document.createElement('canvas');
        var imageCtx = $imageCanvas.getContext('2d');
        $imageCanvas.width = this.originWidth;
        $imageCanvas.height = this.originHeight;

        var width = this.originImage.width;
        var height = this.originImage.height;

        switch (this._orientation) {
            case 2:
                // horizontal flip
                imageCtx.translate(width, 0);
                imageCtx.scale(-1, 1);
                break;
            case 3:
                // 180° rotate left
                imageCtx.translate(width, height);
                imageCtx.rotate(Math.PI);
                break;
            case 4:
                // vertical flip
                imageCtx.translate(0, height);
                imageCtx.scale(1, -1);
                break;
            case 5:
                // vertical flip + 90 rotate right
                imageCtx.rotate(0.5 * Math.PI);
                imageCtx.scale(1, -1);
                break;
            case 6:
                // 90° rotate right
                imageCtx.rotate(0.5 * Math.PI);
                imageCtx.translate(0, -height);
                break;
            case 7:
                // horizontal flip + 90 rotate right
                imageCtx.rotate(0.5 * Math.PI);
                imageCtx.translate(width, -height);
                imageCtx.scale(-1, 1);
                break;
            case 8:
                // 90° rotate left
                imageCtx.rotate(-0.5 * Math.PI);
                imageCtx.translate(-width, 0);
                break;
        }
        imageCtx.drawImage(this.originImage, 0, 0, width, height);

        return $imageCanvas;
    }

    //获取裁剪图片
    SimpleCrop.prototype.getCropImage = function () {
        //复制顶点坐标
        var points1 = [];
        for (var i = 0; i < this.cropPoints.length; i++) {
            points1.push({
                x: this.cropPoints[i].x,
                y: this.cropPoints[i].y
            });
        }
        var points2 = [];
        for (var i = 0; i < this.contentPoints.length; i++) {
            points2.push({
                x: this.contentPoints[i].x,
                y: this.contentPoints[i].y
            });
        }

        //计算原点
        var origin = {
            x: points2[0].x,
            y: points2[0].y
        };
        for (var i = 0; i < points2.length; i++) { //最大y、最小x
            if (points2[i].x < origin.x) {
                origin.x = points2[i].x;
            }
            if (points2[i].y > origin.y) {
                origin.y = points2[i].y;
            }
        }

        //转换坐标系
        var scaleNum = this.scaleTimes / this.times * this._rotateScale; //把坐标系乘以缩放倍数，转换为实际坐标系
        for (var i = 0; i < points2.length; i++) {
            points2[i].x = Math.abs(points2[i].x - origin.x) / scaleNum;
            points2[i].y = Math.abs(points2[i].y - origin.y) / scaleNum;
        }
        for (var i = 0; i < points1.length; i++) {
            points1[i].x = Math.abs(points1[i].x - origin.x) / scaleNum;
            points1[i].y = Math.abs(points1[i].y - origin.y) / scaleNum;
        }

        //计算图片旋转之前的位置（可以根据宽高校验转换是否有异常）
        var center = this.getPointsCenter(points2);
        var borderTop = {
            x: points2[1].x - points2[0].x,
            y: points2[1].y - points2[0].y
        };
        var width = this.vecLen(borderTop);
        var borderRight = {
            x: points2[2].x - points2[1].x,
            y: points2[2].y - points2[1].y,
        };
        var height = this.vecLen(borderRight);
        var imageInitRect = {
            left: center.x - width / 2,
            top: center.y - height / 2,
            width: width,
            height: height
        };

        //带有方向角度的图片绘制到 canvas 之前需要进行坐标转换
        var $coorCanvas = this.transformCoordinates();

        //绘制图片
        var imageRect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
        for (var i = 0; i < points2.length; i++) { //最大x、最大y
            if (points2[i].x > imageRect.width) {
                imageRect.width = points2[i].x;
            }
            if (points2[i].y > imageRect.height) {
                imageRect.height = points2[i].y;
            }
        }

        var $imageCanvas = document.createElement('canvas');
        $imageCanvas.width = $coorCanvas.width;
        $imageCanvas.height = $coorCanvas.height;
        var imageCtx = $imageCanvas.getContext('2d');
        imageCtx._setTransformOrigin(center.x - imageInitRect.left, center.y - imageInitRect.top); //中心点
        imageCtx._rotate(this.rotateAngle);
        imageCtx.drawImage($coorCanvas, 0, 0, $coorCanvas.width, $coorCanvas.height);

        //计算裁剪位置并截图
        var _cropRect = {
            left: points1[0].x - imageInitRect.left,
            top: points1[0].y - imageInitRect.top,
            width: points1[1].x - points1[0].x,
            height: points1[3].y - points1[0].y
        };
        var $cropCanvas = document.createElement('canvas');
        $cropCanvas.width = _cropRect.width;
        $cropCanvas.height = _cropRect.height;
        var cropCtx = $cropCanvas.getContext('2d');
        cropCtx.drawImage($imageCanvas, _cropRect.left, _cropRect.top, _cropRect.width, _cropRect.height, 0, 0, _cropRect.width, _cropRect.height);

        //缩放成最终大小
        this.$resultCanvas = document.createElement('canvas');
        this.$resultCanvas.width = this.size.width;
        this.$resultCanvas.height = this.size.height;
        var resultCtx = this.$resultCanvas.getContext('2d');
        resultCtx.drawImage($cropCanvas, 0, 0, this.size.width, this.size.height);
    };

    //操作结束
    SimpleCrop.prototype.endControl = function () {
        if (this._isControl) {
            var self = this;
            this._isControl = false;
            this._downPoint = [];
            this.scaleDownX = 0;

            if (!this.isWholeCover(this.contentPoints, this.cropPoints)) { //如果没有完全包含则需要进行适配变换
                var scaleNum = this.scaleTimes / this.times * this._rotateScale;
                var transform = '';
                transform += ' scale(' + scaleNum + ')'; //缩放
                transform += ' translateX(' + this._contentCurMoveX / scaleNum + 'px) translateY(' + this._contentCurMoveY / scaleNum + 'px)'; //移动
                transform += ' rotate(' + this.rotateAngle + 'deg) ';

                //适配变换
                var coverTr = this.getCoverTransform(transform);
                var coverMat = this.cssMatrixAnalyze(this.getTransformMatrix(coverTr));
                this._contentCurMoveX = coverMat[4];
                this._contentCurMoveY = coverMat[5];
                this.contentPoints = this.getTransformPoints('scaleY(-1)' + coverTr, this.initContentPoints);

                if (!this.debug) {
                    this.$cropContent.style[transformProperty] = this._initTransform + coverTr;
                } else {
                    this.$cropContent.style[transitionProperty] = 'transform .5s linear';
                    var start = coverTr.indexOf(transform) + transform.length;
                    var coverTrAr = coverTr.substring(start, coverTr.length).trim().split(' ');
                    var no = 0;
                    var tr = this._initTransform + transform + coverTrAr[no];
                    this.$cropContent.style[transformProperty] = tr;
                    this.$cropContent.addEventListener(transitionEndEvent, function () {
                        no++;
                        if (no < coverTr.length) {
                            tr += coverTrAr[no];
                            self.$cropContent.style[transformProperty] = tr;
                        }
                    });
                }
            }
        }
    };

    //操作开始
    SimpleCrop.prototype.startControl = function (point) {
        if (!this._isControl) {
            this._isControl = true;
            this.$cropContent.style[transitionProperty] = 'none';
            this._downPoint = point ? point : [];
        }
    };

    //缩放滑动控制条按钮移动
    SimpleCrop.prototype.scaleMove = function (ev) {
        if (this.scaleDownX > 0) {
            var pointX = this.getControlPoints(ev)[0].clientX;
            var moveX = pointX - this.scaleDownX;
            var newCurLeft = this.scaleCurLeft + moveX;
            if (newCurLeft >= this.scaleInitLeft && newCurLeft <= (this.scaleWidth + this.scaleInitLeft)) {
                var lastMoveX = parseFloat(this.$scaleBtn.getAttribute('movex'));
                if (!lastMoveX) {
                    lastMoveX = 0;
                }
                var curMoveX = lastMoveX + moveX;
                this.scaleDownX = pointX;
                this.scaleMoveAt(curMoveX);
            }
        }
    }

    //滑缩放滑动控制条按钮移动到某个位置
    SimpleCrop.prototype.scaleMoveAt = function (curMoveX) {
        this.$scaleBtn.style[transformProperty] = 'translateX(' + curMoveX + 'px)';
        this.$scaleValue.style.width = curMoveX + 'px';
        this.$scaleBtn.setAttribute('movex', curMoveX);
        this.scaleCurLeft = this.scaleInitLeft + curMoveX;
        this.scaleTimes = this.initScale + curMoveX * 1.0 / this.scaleWidth * (this.maxScale - this.initScale);
        this.transform(false, true);
    };

    //内容图片移动
    SimpleCrop.prototype.contentMove = function (point) {
        if (this._downPoint.length != 0 && !this._multiPoint) {
            var moveX = point[0] - this._downPoint[0];
            var moveY = point[1] - this._downPoint[1];

            this._contentCurMoveX += moveX;
            this._contentCurMoveY += moveY;
            this._downPoint = point;

            this.transform();
        }
    };

    //旋转、缩放、移动
    SimpleCrop.prototype.transform = function (rotateCover, scaleKeepCover) {
        var scaleNum = this.scaleTimes / this.times * this._rotateScale;
        var transform = '';
        transform += ' scale(' + scaleNum + ')'; //缩放
        transform += ' translateX(' + this._contentCurMoveX / scaleNum + 'px) translateY(' + this._contentCurMoveY / scaleNum + 'px)'; //移动
        transform += ' rotate(' + this.rotateAngle + 'deg)';

        if (scaleKeepCover) { //缩放时为了保证裁剪框不出现空白，需要在原有变换的基础上再进行一定的位移变换
            transform = this.getCoverTransform(transform, true);
            var scMat = this.cssMatrixAnalyze(this.getTransformMatrix(transform));
            this._contentCurMoveX = scMat[4];
            this._contentCurMoveY = scMat[5];
        }

        if (rotateCover) { //旋转时需要保证裁剪框不出现空白，需要在原有变换的基础上再进行一定的适配变换
            var rotatePoints = this.getTransformPoints('scaleY(-1)' + transform, this.initContentPoints);
            var coverScale = this.getCoverRectScale(rotatePoints, this.cropPoints);
            var changedX = parseFloat(this.$lineation.getAttribute('changedx'));
            var curMoveX = parseFloat(this.$lineation.getAttribute('movex'));
            var totalMoveX = curMoveX - changedX - this._baseMoveX;
            if (totalMoveX > 0 && coverScale < 1) {
                var percent = Math.abs(changedX) / Math.abs(totalMoveX);
                if (coverScale < (1 - percent)) {
                    coverScale = 1 - percent;
                }
            }
            if (this._rotateScale <= 1) {
                this.scaleTimes = this.scaleTimes * coverScale / (1 / this._rotateScale);
                this._rotateScale = 1;
            } else {
                this._rotateScale = this._rotateScale * coverScale;
            }
            console.log(this._rotateScale + ' ' + this.scaleTimes);
            scaleNum = scaleNum * coverScale;
        }

        //操作变换
        transform = '';
        transform += ' scale(' + scaleNum + ')'; //缩放
        transform += ' translateX(' + this._contentCurMoveX / scaleNum + 'px) translateY(' + this._contentCurMoveY / scaleNum + 'px)'; //移动
        transform += ' rotate(' + this.rotateAngle + 'deg)';
        this.$cropContent.style[transformProperty] = this._initTransform + transform;
        this.contentPoints = this.getTransformPoints('scaleY(-1)' + transform, this.initContentPoints);
    };

    //计算一个矩形刚好包含另一个矩形需要的缩放倍数
    SimpleCrop.prototype.getCoverRectScale = function (outer, inner) {
        var scale = 0;
        for (var i = 0; i < inner.length; i++) {
            var num = this.getCoverPointScale(inner[i], outer);
            if (num > scale) {
                scale = num;
            }
        }
        return scale;
    };

    //判断 矩形A 是否完全包含 矩形B
    SimpleCrop.prototype.isWholeCover = function (rectA, rectB) {
        for (var i = 0; i < rectB.length; i++) {
            if (!this.isPointInRectCheckByLen(rectB[i], rectA)) {
                return false;
            }
        }
        return true;
    };

    //计算一个矩形刚好包含矩形外一点需要的缩放倍数
    SimpleCrop.prototype.getCoverPointScale = function (point, rectPoints) {
        var pcv = this.getPCVectorProjOnUpAndRight(point, rectPoints);

        //计算矩形外一点到矩形中心向量在矩形边框向量上的投影距离
        var uLen = this.vecLen(pcv.uproj);
        var height = this.vecLen(pcv.up) / 2;
        var rLen = this.vecLen(pcv.rproj);
        var width = this.vecLen(pcv.right) / 2;

        //根据投影距离计算缩放倍数
        if (uLen / height > rLen / width) {
            return 1 + (uLen - height) / height;
        } else {
            return 1 + (rLen - width) / width;
        }
    };

    //计算图片内容刚好包含裁剪框的transform变换
    SimpleCrop.prototype.getCoverTransform = function (transform, onlyTranslate) {
        var cRect = this.getCoveRect(this.cropPoints, this.rotateAngle);
        onlyTranslate = onlyTranslate ? onlyTranslate : false;

        //计算放大倍数
        var uScale = 1; //水平缩放倍数和垂直缩放倍数
        var rScale = 1;
        var cup = {
            x: this.contentPoints[1].x - this.contentPoints[2].x,
            y: this.contentPoints[1].y - this.contentPoints[2].y
        }
        var cright = {
            x: this.contentPoints[1].x - this.contentPoints[0].x,
            y: this.contentPoints[1].y - this.contentPoints[0].y
        }
        var tup = {
            x: cRect[1].x - cRect[2].x,
            y: cRect[1].y - cRect[2].y
        }
        var tright = {
            x: cRect[1].x - cRect[0].x,
            y: cRect[1].y - cRect[0].y
        }
        var uAng = this.vecAngle(cup, tup);
        if (Math.abs(180 - uAng) < Math.abs(90 - uAng) || Math.abs(0 - uAng) < Math.abs(90 - uAng)) { //更接近180或者0
            uScale = this.vecLen(tup) / this.vecLen(cup);
            rScale = this.vecLen(tright) / this.vecLen(cright);
        } else {
            uScale = this.vecLen(tup) / this.vecLen(cright);
            rScale = this.vecLen(tright) / this.vecLen(cup);
        }
        uScale = uScale < 1 ? 1 : uScale;
        rScale = rScale < 1 ? 1 : rScale;

        var scale = uScale > rScale ? uScale : rScale;

        if (onlyTranslate && scale > 1) {
            return transform;
        }

        //复制坐标
        var scalePoints = [];
        for (var i = 0; i < this.contentPoints.length; i++) {
            scalePoints.push({
                x: this.contentPoints[i].x,
                y: this.contentPoints[i].y
            });
        }

        //计算放大后的新坐标
        if (scale > 1) {
            transform += 'scale(' + scale + ')';
            this._rotateScale = this._rotateScale * scale;
            scalePoints = this.getTransformPoints('scaleY(-1)' + transform, this.initContentPoints);
        }

        //位移变换
        var scaleNum = this.scaleTimes / this.times * this._rotateScale;
        var count = 0;
        var self = this;
        var outDetails = [];
        do {
            //找出裁剪框超出的顶点
            outDetails = this.getOutDetails(this.cropPoints, scalePoints);
            if (outDetails.length > 0) {
                count++;
                outDetails.sort(function (a, b) { //找出距离最远的点
                    var aLen = self.vecLen(a.iv);
                    var bLen = self.vecLen(b.iv);
                    if (aLen < bLen) {
                        return 1;
                    }
                    if (aLen > bLen) {
                        return -1;
                    }
                    return 0;
                });

                //开始移动
                var maxFarOut = outDetails[0];
                var maxFarPcv = maxFarOut.pcv;

                //计算X轴位移
                var uAng = this.vecAngle(maxFarPcv.up, maxFarPcv.uproj);
                var uLen = this.vecLen(maxFarPcv.uproj);
                var moveY = 0;

                //if(uAng == 0){ //同方向
                if (Math.abs(uAng) < 90) { //浮点数精度问题，接近0时小于90 ，接近180时大于90
                    moveY = -uLen * maxFarOut.uOver;
                } else {
                    moveY = uLen * maxFarOut.uOver;
                }
                if (moveY != 0) {
                    transform += ' translateY(' + moveY / scaleNum + 'px)';
                }

                //计算Y轴位移
                var rAng = this.vecAngle(maxFarPcv.right, maxFarPcv.rproj);
                var rLen = this.vecLen(maxFarPcv.rproj);
                var moveX = 0;

                if (Math.abs(rAng) < 90) { //同方向
                    moveX = rLen * maxFarOut.rOver;
                } else {
                    moveX = -rLen * maxFarOut.rOver;
                }
                if (moveX != 0) {
                    transform += ' translateX(' + moveX / scaleNum + 'px)';
                }

                //计算位移后的新坐标
                if (moveX != 0 || moveY != 0) {
                    for (var i = 0; i < scalePoints.length; i++) {
                        scalePoints[i].x = scalePoints[i].x + maxFarOut.iv.x,
                            scalePoints[i].y = scalePoints[i].y + maxFarOut.iv.y;
                    }
                }
            }
        } while (count < 2 && outDetails.length > 0)

        return transform;
    }

    //找出一个矩形在另一个矩形外的顶点数据
    SimpleCrop.prototype.getOutDetails = function (inner, outer) {
        var outDetails = [];
        for (var i = 0; i < inner.length; i++) {
            var pt = inner[i];
            if (!this.isPointInRectCheckByLen(pt, outer)) {
                var pcv = this.getPCVectorProjOnUpAndRight(pt, outer);
                var iv = {
                    x: 0,
                    y: 0
                };
                var uLen = this.vecLen(pcv.uproj);
                var height = this.vecLen(pcv.up) / 2;
                var rLen = this.vecLen(pcv.rproj);
                var width = this.vecLen(pcv.right) / 2;
                var uOver = 0;
                var rOver = 0;
                if (uLen > height) {
                    uOver = (uLen - height) / uLen;
                    iv.x += pcv.uproj.x * uOver;
                    iv.y += pcv.uproj.y * uOver;
                }
                if (rLen > width) {
                    rOver = (rLen - width) / rLen;
                    iv.x += pcv.rproj.x * rOver;
                    iv.y += pcv.rproj.y * rOver;
                }
                outDetails.push({
                    x: pt.x,
                    y: pt.y,
                    iv: iv,
                    uOver: uOver,
                    rOver: rOver,
                    pcv: pcv
                });
            }
        }
        return outDetails;
    }

    //获取刚好包含某个矩形的新矩形
    SimpleCrop.prototype.getCoveRect = function (rect, angle) {
        if (angle < 0) {
            angle = 90 + angle % 90;
        } else {
            angle = angle % 90;
        }
        var rad = angle / 180 * Math.PI;

        var up = {
            x: rect[1].x - rect[2].x,
            y: rect[1].y - rect[2].y
        }
        var right = {
            x: rect[1].x - rect[0].x,
            y: rect[1].y - rect[0].y
        }
        var rLen = this.vecLen(right);
        var uLen = this.vecLen(up);

        var nRect = [];
        nRect[0] = {};
        nRect[0].x = rect[0].x + rLen * Math.sin(rad) * Math.sin(rad);
        nRect[0].y = rect[0].y + rLen * Math.sin(rad) * Math.cos(rad);

        nRect[1] = {};
        nRect[1].x = rect[1].x + uLen * Math.sin(rad) * Math.cos(rad);
        nRect[1].y = rect[1].y - uLen * Math.sin(rad) * Math.sin(rad);

        nRect[2] = {};
        nRect[2].x = rect[2].x - rLen * Math.sin(rad) * Math.sin(rad);
        nRect[2].y = rect[2].y - rLen * Math.sin(rad) * Math.cos(rad);

        nRect[3] = {};
        nRect[3].x = rect[3].x - uLen * Math.sin(rad) * Math.cos(rad);
        nRect[3].y = rect[3].y + uLen * Math.sin(rad) * Math.sin(rad);

        return nRect;
    }

    //计算新的变换坐标
    SimpleCrop.prototype.getTransformPoints = function (transform, points) {
        var matrix = this.getTransformMatrix(transform);
        var nPoints = [];
        for (var i = 0; i < points.length; i++) {
            var item = {
                x: points[i].x,
                y: points[i].y
            };
            item = this.getMatrixPoints(item, matrix);
            nPoints.push(item);
        }
        nPoints.reverse(); //顶点顺序发生了变化，需要颠倒

        return nPoints;
    }

    //获得矩形点坐标中心
    SimpleCrop.prototype.getPointsCenter = function (points) {
        var center = {
            x: (points[0].x + points[2].x) / 2,
            y: (points[0].y + points[2].y) / 2,
        }
        return center;
    };

    //矩形位置形式转换为顶点坐标形式
    SimpleCrop.prototype.rectToPoints = function (rect) {
        var points = [];
        points.push({
            x: -(this.maskViewSize.width / 2 - rect.left),
            y: this.maskViewSize.height / 2 - rect.top
        });
        points.push({
            x: points[0].x + rect.width,
            y: points[0].y
        });
        points.push({
            x: points[1].x,
            y: points[1].y - rect.height
        });
        points.push({
            x: points[0].x,
            y: points[2].y
        });

        return points;
    };

    //计算矩阵变换后的坐标点
    SimpleCrop.prototype.getMatrixPoints = function (p, matrix) {
        var mat = this.cssMatrixAnalyze(matrix);

        // var mat3 = [mat[0],mat[2],mat[4],
        //             mat[1],mat[3],mat[5],
        //             0,0,1];

        // var mat3 = [a,c,e,
        //             b,d,f,
        //             0,0,1];

        // var nx = a * x + c * y + 1 * e;
        // var ny = b * x + d * y + 1 * f;
        // var nz = 0 + 0 +1;

        //计算变换后点坐标
        var nx = mat[0] * p.x + mat[2] * p.y + 1 * mat[4];
        var ny = mat[1] * p.x + mat[3] * p.y + 1 * mat[5];
        var nz = 0 + 0 + 1;

        return {
            x: nx / nz,
            y: ny / nz
        };
    };

    //css矩阵解析
    SimpleCrop.prototype.cssMatrixAnalyze = function (mat) {
        var start = mat.indexOf('matrix(');
        var end = mat.indexOf(')');
        var arr = [];
        var numbers = mat.substring(start + 7, end);
        arr = numbers.split(',');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseFloat(arr[i]);
        }
        return arr;
    };

    //获取transform属性对应的矩形形式
    SimpleCrop.prototype.getTransformMatrix = function (transform) {
        var $div = document.createElement('div');
        $div.style.visibility = 'hidden';
        $div.style.position = 'fixed';

        $div.style[transformProperty] = transform;
        document.body.appendChild($div);

        var style = window.getComputedStyle($div);
        var matrix = style[transformProperty];
        document.body.removeChild($div);

        return matrix;
    };

    //计算向量 a 在向量 b 上的投影向量
    SimpleCrop.prototype.getProjectionVector = function (vecA, vecB) {
        var bLen = this.vecLen(vecB);
        var ab = vecA.x * vecB.x + vecA.y * vecB.y;

        var proj = {
            x: ab / Math.pow(bLen, 2) * vecB.x,
            y: ab / Math.pow(bLen, 2) * vecB.y,
        }

        return proj
    };

    //计算矩形中心到某点的向量在矩形自身坐标系上方向和右方向上的投影向量
    SimpleCrop.prototype.getPCVectorProjOnUpAndRight = function (point, rectPoints) {
        //计算矩形自身坐标系的上方向向量和右方向向量
        var up = {
            x: rectPoints[1].x - rectPoints[2].x,
            y: rectPoints[1].y - rectPoints[2].y
        }
        var right = {
            x: rectPoints[1].x - rectPoints[0].x,
            y: rectPoints[1].y - rectPoints[0].y
        }

        //计算矩形中心点
        var center = this.getPointsCenter(rectPoints);
        var line = {
            x: point.x - center.x,
            y: point.y - center.y
        }

        var uproj = this.getProjectionVector(line, up);
        var rproj = this.getProjectionVector(line, right);

        return {
            up: up,
            uproj: uproj,
            right: right,
            rproj: rproj
        };
    };

    //根据矩形中心到某一点向量在矩形边框向量的投影长度判断该点是否在矩形内
    SimpleCrop.prototype.isPointInRectCheckByLen = function (point, rectPoints) {
        var pcv = this.getPCVectorProjOnUpAndRight(point, rectPoints);

        var precision = 100; //保留两位小数

        var uLen = Math.round(this.vecLen(pcv.uproj) * precision);
        var height = Math.round(this.vecLen(pcv.up) / 2 * precision);
        var rLen = Math.round(this.vecLen(pcv.rproj) * precision);
        var width = Math.round(this.vecLen(pcv.right) / 2 * precision);

        if (uLen <= height && rLen <= width) {
            return true;
        } else {
            return false;
        }
    }

    //根据角度和判断点是否在矩形内
    SimpleCrop.prototype.isPointInRectCheckByAngle = function (point, rectPoints) {
        //先计算四个向量
        var vecs = [];
        for (var i = 0; i < rectPoints.length; i++) {
            var p = rectPoints[i];
            vecs.push({
                x: (p.x - point.x),
                y: (p.y - point.y)
            });
        }

        //计算模最小向量
        var sIndex = 0;
        var sLen = 0;
        for (var i = 0; i < vecs.length; i++) {
            var len = this.vecLen(vecs[i]);
            if (len == 0 || len < sLen) {
                sIndex = i;
                sLen = len;
            }
        }
        var len = vecs.length;
        var sVec = vecs.splice(sIndex, 1)[0];
        var tVec = sVec;
        var eVec;

        //依次计算四个向量的夹角
        var angles = [];
        for (i = 1; i < len; i++) {
            var data = this.getMinAngle(tVec, vecs);
            tVec = data.vec;
            vecs.splice(data.index, 1);
            angles.push(data.angle);

            if (vecs.length == 1) {
                eVec = vecs[0];
            }
        }
        angles.push(this.getMinAngle(eVec, [sVec]).angle);

        var sum = 0;
        for (var i = 0; i < angles.length; i++) {
            sum += angles[i];
        }

        //向量之间的夹角等于360度则表示点在矩形内
        sum = sum.toPrecision(12); //取12位精度能在大部分情况下解决浮点数误差导致的精度问题
        if (sum < 360) {
            return false;
        } else {
            return true;
        }
    };

    //计算向量数组的中向量和目标向量的最小夹角
    SimpleCrop.prototype.getMinAngle = function (tVec, aVec) {
        var minAngle = this.vecAngle(tVec, aVec[0]);
        var minIndex = 0;
        for (var i = 1; i < aVec.length; i++) {
            var angle = this.vecAngle(tVec, aVec[i]);
            if (angle < minAngle) {
                minAngle = angle;
                minIndex = i;
            }
        }
        return {
            angle: minAngle,
            vec: aVec[minIndex],
            index: minIndex
        };
    };

    //计算向量夹角
    SimpleCrop.prototype.vecAngle = function (vec1, vec2) {
        var acos = (vec1.x * vec2.x + vec1.y * vec2.y) / (this.vecLen(vec1) * this.vecLen(vec2));
        if (Math.abs(acos) > 1) { //因为浮点数精度结果有可能超过1，Math.acos(1.0000001) = NaN
            acos = acos > 0 ? 1 : -1;
        }
        var rad = Math.acos(acos);
        var angle = rad * 180 / Math.PI;
        return angle;
    };

    //计算向量的模
    SimpleCrop.prototype.vecLen = function (vec) {
        var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        return len;
    };

    //file转image
    SimpleCrop.prototype.fileToSrc = function (file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            callback(e.target.result);
        }
        reader.readAsDataURL(file)
    };

    //让canvas transform类似css3 transform
    SimpleCrop.prototype.initCanvasTransform = function () {
        CanvasRenderingContext2D.prototype._setTransformOrigin = function (x, y) {
            this._transformOrigin = {
                x: x,
                y: y
            };
        }
        CanvasRenderingContext2D.prototype._scale = function (x, y) {
            if (this._transformOrigin == null) {
                this._transformOrigin = {
                    x: 0,
                    y: 0
                };
            }
            this.translate(this._transformOrigin.x, this._transformOrigin.y);
            this.scale(x, y);
            this.translate(-this._transformOrigin.x, -this._transformOrigin.y);
        }
        CanvasRenderingContext2D.prototype._rotate = function (deg) {
            if (this._transformOrigin == null) {
                this._transformOrigin = {
                    x: 0,
                    y: 0
                };
            }
            this.translate(this._transformOrigin.x, this._transformOrigin.y);
            this.rotate(deg / 180 * Math.PI);
            this.translate(-this._transformOrigin.x, -this._transformOrigin.y);
        }
        CanvasRenderingContext2D.prototype._skew = function (xDeg, yDeg) {
            if (this._transformOrigin == null) {
                this._transformOrigin = {
                    x: 0,
                    y: 0
                };
            }
            this.translate(this._transformOrigin.x, this._transformOrigin.y);
            this.transform(1, xDeg / 180 * Math.PI, yDeg / 180 * Math.PI, 1, 0, 0);
            this.translate(-this._transformOrigin.x, -this._transformOrigin.y);
        }
        CanvasRenderingContext2D.prototype._transform = function (a, b, c, d, e, f) {
            if (this._transformOrigin == null) {
                this._transformOrigin = {
                    x: 0,
                    y: 0
                };
            }
            this.translate(this._transformOrigin.x, this._transformOrigin.y);
            this.transform(a, b, c, d, e, f);
            this.translate(-this._transformOrigin.x, -this._transformOrigin.y);
        }
    };

    return SimpleCrop;
}));