(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['alloyfinger'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('alloyfinger'));
    } else {
        // Browser globals
        window.SimpleCrop = factory(window.AlloyFinger);
    }
}(function (finger) {
    /**
     * @param title 组件标题
     * @param src   初始图片路径
     * @param times 实际尺寸/显示尺寸
     * @param zIndex 样式层级
     * @param minScale 最小缩放倍数
     * @param bgFilter 背景滤镜
     * @param controller 操控方式
     * @param maxScale 最大缩放倍数
     * @param isScaleFixed 缩放倍数范围是否固定
     * @param coverDraw 裁剪框绘制辅助线
     * @param scaleSlider 缩放滑动组件
     * @param rotateSlider 旋转滑动组件
     * @param funcBtns 功能按钮数组
     * @param cropCallback 确定裁剪回调函数
     * @param uploadCallback 重新上传回调函数
     * @param closeCallback 关闭回调函数
     * @param size 截图实际宽高
     * @param cropSizePercent 裁剪区域占画布比例
     * ------------------------------------
     *
     * 为了减少计算的复杂性，所有坐标都统一为屏幕坐标及尺寸
     * borderWidth 裁剪区域边框屏幕宽度
     * positionOffset 裁剪区域屏幕
     * maskViewSize 容器的屏幕尺寸
     * cropRect 截图区域的屏幕尺寸
     * cropPoints 裁剪区域顶点坐标
     * contentPoints 图片显示区域矩形顶点坐标
     * initContentPoints 图片显示区域矩形初始顶点坐标
     */
    function SimpleCrop(params){
        var self = this;

        //判断是否支持passive
        self.passiveSupported = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function() {
                    self.passiveSupported = true
                }
            })
            window.addEventListener('test', null, options)
        } catch (err) {}

        this.id = 'crop-'+new Date().getTime();
        this.title = params.title;
        this.src = params.src;
        this.size = params.size;
        this.isScaleFixed = false;

        this._multiPoint = false;//是否开始多点触控
        this._rotateScale = 1;//旋转缩放
        this._baseMoveX = 0;//刻度位置初始化偏移量
        this._downPoint = [];//操作点坐标
        this._isControl = false;//是否正在操作
        /**
         * 旋转交互分为两种：
         * 一种是整角旋转（90度）；
         * 另一种是基于整角旋转的基础上正负45度旋转。
         */
        this._baseAngle = 0;

        this.cropSizePercent = params.cropSizePercent!=null?params.cropSizePercent:0.5;//默认0.5则表示高度或者宽度最多占50%
        this.zIndex = params.zIndex!=null?params.zIndex:9999;
        this.coverDraw = params.coverDraw!=null?params.coverDraw:this.defaultCoverDraw;
        this.borderDraw = params.borderDraw!=null?params.borderDraw:this.defaultBorderDraw;
        this.noBoldCorner = params.noBoldCorner!=null?params.noBoldCorner:false;//裁剪框边角是否不加粗
        this.coverColor = params.coverColor!=null?params.coverColor:'rgba(0,0,0,.5)';//遮罩框背景颜色
        this.$container = params.$container!=null?params.$container:document.body;//组件容器
        this.scaleSlider = params.scaleSlider!=null?params.scaleSlider:true;
        this.positionOffset = params.positionOffset!=null?params.positionOffset:{top:0,left:0};
        this.bgFilter = params.bgFilter!=null?params.bgFilter:'blur(20px)';

        /**
         * 旋转刻度盘
         * startAngle 起始度数
         * endAngle 结束度数
         * gapAngle 间隔度数
         * lineationItemWidth 单个刻度盘宽度，单位像素
         */
        this.rotateSlider = params.rotateSlider!=null?params.rotateSlider:false;
        this.startAngle = -90;
        this.endAngle = 90;
        this.gapAngle = 10;
        this.lineationItemWidth = 40.5;

        /**
         * 操控方式
         * 默认只支持鼠标操控
         * mouse 鼠标
         * touch 手指
         */
        this.controller = params.controller!=null?params.controller:['mouse'];

        /**
         * 默认功能按钮为重新上传、裁剪
         * upload 重新上传
         * crop 裁减
         * close 取消
         */
        this.funcBtns = params.funcBtns!=null?params.funcBtns:['close','upload','crop'];

        this.construct();

        this.$cropMask = document.querySelector('#'+this.id+' .crop-mask');
        var maskStyle = window.getComputedStyle(this.$cropMask);
        this.maskViewSize = {
            width:parseInt(maskStyle.getPropertyValue('width')),
            height:parseInt(maskStyle.getPropertyValue('height'))
        }
        this.times = (this.size.width/this.maskViewSize.width>this.size.height/this.maskViewSize.height)?this.size.width/this.maskViewSize.width/this.cropSizePercent:this.size.height/this.maskViewSize.height/this.cropSizePercent;

        this.scaleTimes = 1;//缩放倍数
        this.rotateAngle = 0;//旋转角度

        this.$cropCover = document.querySelector('#'+this.id+' .crop-cover');
        this.cropCoverContext = this.$cropCover.getContext('2d');
        this.$cropCover.width = this.maskViewSize.width;
        this.$cropCover.height = this.maskViewSize.height;
        this.$cropContent = document.querySelector('#'+this.id+' .crop-content');
        this.cropContentContext = this.$cropContent.getContext('2d');

        this.borderWidth = params.borderWidth!=null?params.borderWidth:2;

        //裁剪框位置相关
        this.cropRect = {
            width:this.size.width/this.times,
            height:this.size.height/this.times,
        };
        this.cropRect.left = (this.maskViewSize.width - this.cropRect.width)/2 - this.positionOffset.left;
        this.cropRect.top = (this.maskViewSize.height - this.cropRect.height)/2 - this.positionOffset.top;
        this.cropPoints = this.rectToPoints(this.cropRect);

        this.cropCallback = params.cropCallback;
        this.closeCallback = params.closeCallback;
        this.uploadCallback = params.uploadCallback;

        if(params.minScale!=null&&params.maxScale!=null){
            this.minScale = params.minScale;
            this.maxScale = params.maxScale;
            this.isScaleFixed = true;//如果缩放倍数范围是传参设置的，那么固定
        }

        this.borderDraw();
        this.coverDraw();
        this.bindEvent();
        this.load();
    }

    //html结构
    SimpleCrop.prototype.construct = function(){
        var html = '';
        html += '<div class="crop-component">';

        if(this.title){
            html += '<p class="crop-title">'+this.title+'</p>';
        }

        html += '<div class="crop-mask">'
        html += '<canvas class="crop-content"></canvas>';
        html += '<canvas class="crop-cover"></canvas>';
        html += '</div>';

        if(this.scaleSlider){
            html += '<div class="crop-scale">';
            html += '<div class="one-times-icon"></div>';
            html += '<div class="scale-container">';
            html += '<div class="scale-num"><span class="scale-value" style="width:0px;"></span><span class="scale-btn" style="left:-8px;"></span></div>';
            html += '</div>';
            html += '<div class="two-times-icon"></div>';
            html += '</div>';
        }

        if(this.rotateSlider){
            html += '<div class="crop-rotate">'
            html += '<ul class="lineation" style="width:'+this.lineationItemWidth*((this.endAngle-this.startAngle)/this.gapAngle+1)+'px;">';
            for(var i=this.startAngle;i<=this.endAngle;i+=this.gapAngle){
                html += '<li><div class="number">'+i+'</div><div class="bg"></div></li>';
            }
            html += '</ul>';
            html += '<div class="current"></div>';
            html += '</div>';
        }

        if(this.funcBtns.length>0){
            html += '<div class="crop-btns">';

            if(this.funcBtns.includes('upload')){
                html += '<div class="upload-btn-container">';
                html += '<button class="upload-btn"></button>';
                html += '<input type="file" accept="image/png,image/jpeg">';
                html += '</div>';
            }
            if(this.funcBtns.includes('close')){
                html += '<button class="crop-close"></button>';
            }
            if(this.funcBtns.includes('around')){
                html += '<button class="crop-around"></button>';
            }
            if(this.funcBtns.includes('reset')){
                html += '<button class="crop-reset"></button>';
            }
            if(this.funcBtns.includes('crop')){
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
    };

    //默认绘制裁剪框
    SimpleCrop.prototype.defaultBorderDraw = function(){
        this.cropCoverContext.clearRect(0,0,this.$cropCover.width,this.$cropCover.height);
        this.cropCoverContext.fillStyle = this.coverColor;
        this.cropCoverContext.fillRect(0,0,this.$cropCover.width,this.$cropCover.height);
        this.cropCoverContext.fillStyle = '#ffffff';

        //绘制边框
        var borderRect = {
            left:this.cropRect.left - this.borderWidth,
            top:this.cropRect.top - this.borderWidth,
            width:this.cropRect.width + this.borderWidth * 2,
            height:this.cropRect.height + this.borderWidth * 2
        }
        this.cropCoverContext.fillRect(borderRect.left,borderRect.top,borderRect.width,borderRect.height);

        if(!this.noBoldCorner){
            //边框四个角加粗
            var percent = 0.05;
            var cornerRectWidth = borderRect.width * percent;
            var cornerRectHeight = borderRect.height * percent;
            this.cropCoverContext.fillRect(borderRect.left-this.borderWidth,borderRect.top-this.borderWidth,cornerRectWidth,cornerRectHeight);//左上角
            this.cropCoverContext.fillRect(borderRect.left+borderRect.width-cornerRectWidth+this.borderWidth,borderRect.top-this.borderWidth,cornerRectWidth,cornerRectHeight);//右上角
            this.cropCoverContext.fillRect(borderRect.left-this.borderWidth,borderRect.top+borderRect.height-cornerRectHeight+this.borderWidth,cornerRectWidth,cornerRectHeight);//左下角
            this.cropCoverContext.fillRect(borderRect.left+borderRect.width-cornerRectWidth+this.borderWidth,borderRect.top+borderRect.height-cornerRectHeight+this.borderWidth,cornerRectWidth,cornerRectHeight);//右下角
        }

        //清空内容区域
        this.cropCoverContext.clearRect(this.cropRect.left,this.cropRect.top,this.cropRect.width,this.cropRect.height);
    };

    //默认绘制辅助线
    SimpleCrop.prototype.defaultCoverDraw = function(){

    };

    //加载图片
    SimpleCrop.prototype.load = function(){
        var self = this;
        if(!self.$image){
            self.$image = new Image();
        }
        self.$image.src = self.src;
        self.$image.onload = function(){

            self.$cropContent.width = self.$image.width;
            self.$cropContent.height = self.$image.height;
            self.cropContentContext.drawImage(self.$image,0,0,self.$image.width,self.$image.height);

            //初始位置垂直水平居中
            self._initTransform = 'translate(-50%,-50%)';
            self.$cropContent.style.position = 'absolute';
            self.$cropContent.style.left = '50%';
            self.$cropContent.style.top = '50%';
            self.$cropContent.style.transform = self._initTransform;

            self.initContentPoints = self.rectToPoints(self.$cropContent.getBoundingClientRect());
            self.contentPoints = self.initContentPoints.slice();

            /**
             * 默认最大缩放倍数为1；也就是显示原图；
             * 默认最小缩放倍数为图片刚好填满裁切区域。
             */
            if(!self.isScaleFixed){
                self.maxScale = 1;
                if(self.size.width*1.0/self.size.height>self.$image.width*1.0/self.$image.height){
                    self.minScale = self.size.width*1.0/self.$image.width;
                }else{
                    self.minScale = self.size.height*1.0/self.$image.height;
                }
                if(self.minScale>=self.maxScale){
                    self.maxScale = self.minScale;
                }
            }
            self.scaleTimes = self.minScale;

            self.$cropContent.setAttribute('moveX', -self.positionOffset.left);
            self.$cropContent.setAttribute('moveY',-self.positionOffset.top);

            self.transform();
        }
    };

    //显示
    SimpleCrop.prototype.show = function(src){
        if(src){
            this.src = src;
            this.load();
        }
        this.$target.style.display = 'block';
    };

    //隐藏
    SimpleCrop.prototype.hide = function(){
        this.$target.style.display = 'none';
    };

    //绑定事件
    SimpleCrop.prototype.bindEvent = function(){
        //获取事件相关dom元素
        var self = this;

        //裁剪
        if(self.funcBtns.includes('crop')){
            self.$cropBtn = document.querySelector('#'+self.id+' .crop-btn');
            self.$cropBtn.addEventListener('click',function(){
                self.cropCallback();
            });
        }

        //上传
        if(self.funcBtns.includes('upload')){
            self.$uploadBtn = document.querySelector('#'+self.id+' .upload-btn-container');
            self.$uploadInput = document.querySelector('#'+self.id+' .upload-btn-container input');
            self.$uploadBtn.addEventListener('change',function(evt){
                var files = evt.target.files;
                if(files.length>0){
                    if(self.uploadCallback){
                        self.uploadCallback(files[0]);
                    }else{
                        self.fileToSrc(files[0],function(src){
                            self.src = src;
                            self.load();
                        });
                    }
                }
                self.$uploadInput.value = '';//清空value属性，从而保证用户修改文件内容但是没有修改文件名时依然能上传成功
            });
        }

        //整角旋转
        if(self.funcBtns.includes('around')){
            self.$cropAround = document.querySelector('#'+self.id+' .crop-around');
            self.$cropAround.addEventListener('click',function(){
                self.startControl();
                self.rotateAngle = self._baseAngle-90;
                self._baseAngle = self.rotateAngle;
                self.$lineation.setAttribute('moveX',self._baseMoveX);
                self.$lineation.style.transform = 'translateX('+self._baseMoveX+'px)';
                self.transform();
                self.endControl();
            })
        }

        //还原
        if(self.funcBtns.includes('reset')){
            self.$cropReset = document.querySelector('#'+self.id+' .crop-reset');
            self.$cropReset.addEventListener('click',function(){
                self.startControl();
                self._rotateScale = 1;
                self._baseAngle = 0;
                self.rotateAngle = 0;
                self.$cropContent.setAttribute('moveX', -self.positionOffset.left);
                self.$cropContent.setAttribute('moveY',-self.positionOffset.top);
                self.$lineation.setAttribute('moveX',self._baseMoveX);
                self.$lineation.style.transform = 'translateX('+self._baseMoveX+'px)';
                self.scaleTimes = self.minScale;
                self.transform();
                self.endControl();
            })
        }

        //关闭
        if(self.funcBtns.includes('close')){
            self.$closeBtn = document.querySelector('#'+self.id+' .crop-close');
            self.$closeBtn.addEventListener('click',function(){
                self.hide();
                if(self.closeCallback){
                    self.closeCallback();
                }
            });
        }

        //滑动缩放
        if(self.scaleSlider){
            self.$scaleBtn = document.querySelector('#'+self.id+' .scale-btn');
            self.$scaleNum = document.querySelector('#'+self.id+' .scale-num');
            self.$scaleOneTimes = document.querySelector('#'+self.id+' .one-times-icon');
            self.$scaleTwoTimes = document.querySelector('#'+self.id+' .two-times-icon');
            self.$scaleContainer = document.querySelector('#'+self.id+' .scale-container');
            self.$scaleValue = document.querySelector('#'+self.id+' .scale-value');

            self.scaleDownX = 0;
            self.scaleInitLeft = self.$scaleBtn.getBoundingClientRect().left;
            self.scaleCurLeft = self.scaleInitLeft;
            self.scaleWidth = self.$scaleNum.getBoundingClientRect().width;


            //滑动按钮鼠标按下
            self.$scaleBtn.addEventListener('mousedown',function(ev){
                self.scaleDownX = ev.clientX;
            });
            //滑动按钮鼠标滑动
            self.$scaleContainer.addEventListener('mousemove',function(ev){
                var pointX = ev.clientX;
                if(self.scaleDownX>0){
                    var moveX = pointX - self.scaleDownX;
                    var newCurLeft = self.scaleCurLeft+moveX;
                    if(newCurLeft>=self.scaleInitLeft&&newCurLeft<=(self.scaleWidth+self.scaleInitLeft)){
                        var lastMoveX = parseFloat(self.$scaleBtn.getAttribute('moveX'));
                        if(!lastMoveX){
                            lastMoveX = 0;
                        }
                        var curMoveX = lastMoveX+moveX;
                        self.scaleDownX = pointX;
                        self.scaleMove(curMoveX);
                    }
                }
            });
            //缩放条点击
            self.$scaleBtn.addEventListener('click',function(ev){//滑动按钮点击
                ev.stopPropagation();
            });
            self.$scaleContainer.addEventListener('click',function(ev){
                var rect = self.$scaleBtn.getBoundingClientRect();
                if(self.scaleDownX<=0){
                    self.scaleDownX = rect.left+rect.width*1.0/2;
                }
                if(self.scaleDownX>0){
                    var pointX = ev.clientX;
                    var moveX = pointX - self.scaleDownX;
                    var newCurLeft = self.scaleCurLeft+moveX;
                    if(newCurLeft>=self.scaleInitLeft&&newCurLeft<=(self.scaleWidth+self.scaleInitLeft)){
                        var lastMoveX = parseFloat(self.$scaleBtn.getAttribute('moveX'));
                        if(!lastMoveX){
                            lastMoveX = 0;
                        }
                        var curMoveX = lastMoveX+moveX;
                        self.scaleMove(curMoveX);
                        self.scaleDownX = 0;//鼠标移动缩放只能由鼠标在缩放按钮上按下触发
                        self.endControl();
                    }
                }
            });
            //滑动按钮超出范围
            self.$scaleContainer.addEventListener('mouseleave',self.endControl.bind(self));
            //滑动按钮鼠标松开
            self.$scaleContainer.addEventListener('mouseup',self.endControl.bind(self));
            //最小缩放按钮点击
            self.$scaleOneTimes.addEventListener('click',function(ev){
                self.scaleMove(0);
                self.endControl();
            });
            //最大缩放按钮点击
            self.$scaleTwoTimes.addEventListener('click',function(ev){
                self.scaleMove(self.scaleWidth);
                self.endControl();
            });
        }

        if(self.rotateSlider){
            self.$cropRotate = document.querySelector('#'+self.id+' .crop-rotate');
            self.$lineation = document.querySelector('#'+self.id+' .lineation');
            self.$rotateCurrent = document.querySelector('#'+self.id+' .current');

            //初始化刻度位置
            var lineationStyle = window.getComputedStyle(self.$lineation);
            var lineationWidth = parseFloat(lineationStyle.getPropertyValue('width'));
            var rotateStyle = window.getComputedStyle(self.$cropRotate);
            var rotateWidth = parseFloat(rotateStyle.getPropertyValue('width'));
            self._baseMoveX = -(lineationWidth/2-rotateWidth/2);
            self.$lineation.setAttribute('moveX',self._baseMoveX);
            self.$lineation.style.transform = 'translateX('+self._baseMoveX+'px)';

            //刻度触摸开始
            self.$cropRotate.addEventListener('touchstart',function(e){
                var touch = e.touches[0];
                self.startControl([touch.clientX,touch.clientY]);
            });
            //刻度触摸移动
            self.$cropRotate.addEventListener('touchmove',function(e){
                var touch = e.touches[0];
                var point = [touch.clientX,touch.clientY];
                var moveX = point[0] - self._downPoint[0];
                var lastMoveX = self.$lineation.getAttribute('moveX');
                if(!lastMoveX){
                    lastMoveX = 0;
                }else{
                    lastMoveX = parseFloat(lastMoveX);
                }
                var curMoveX = lastMoveX+moveX;
                var angle = (curMoveX-self._baseMoveX)/lineationWidth*(self.endAngle-self.startAngle+self.gapAngle);

                if(angle<=45&&angle>=-45){
                    self.$lineation.setAttribute('moveX',curMoveX);
                    self.$lineation.style.transform = 'translateX('+curMoveX+'px)';
                    self.rotateAngle = self._baseAngle+angle;
                    self.transform(true);
                    self._downPoint = point;
                }
                e.stopPropagation();//阻止事件冒泡
            });
            //刻度触摸结束
            self.$cropRotate.addEventListener('touchend',self.endControl.bind(self));
            //刻度触摸取消
            self.$cropRotate.addEventListener('touchcancel',self.endControl.bind(self));
        }

        //画布相关事件

        /**
         * 触摸事件
         */
        if(self.controller.includes('touch')){

            //裁剪区域触摸开始
            self.$container.addEventListener('touchstart',function(e){
                var touch = e.touches[0];
                self.startControl([touch.clientX,touch.clientY]);
            });
            var options = self.passiveSupported?{passive: false,capture:false}:false;
            //裁剪区域触摸移动
            self.$container.addEventListener('touchmove',function(e){
                var touch = e.touches[0];
                self.move([touch.clientX,touch.clientY]);
                e.preventDefault();
            },options);
            //裁剪区域触摸结束
            self.$container.addEventListener('touchend',self.endControl.bind(self));
            //裁剪区域触摸取消
            self.$container.addEventListener('touchcancel',self.endControl.bind(self));

            //复杂手势事件
            var lastScale = 1;
            new finger(self.$container, {
                multipointStart: function () {
                    self._multiPoint = true;//多点触摸开始
                },
                pinch: function (evt) {//缩放
                    var scale = evt.zoom;
                    var newScale = self.scaleTimes/lastScale*scale;
                    if(newScale>=self.minScale&&newScale<=self.maxScale){
                        self.scaleTimes = newScale
                        lastScale = scale;
                        self.transform(true);
                    }else{
                        /**
                         * 浮点数计算存在误差会导致缩放时很难回到初始状态；
                         * 且手指触摸缩放和滑动缩放不一样，并不存在初始化状态按钮；
                         * 因此需要加上强制回归的逻辑
                         */
                        if(newScale!=self.scaleTimes){
                            if(Math.abs(newScale-self.minScale)>Math.abs(newScale-self.maxScale)){
                                newScale = self.maxScale;
                            }else{
                                newScale = self.minScale;
                            }
                            self.scaleTimes = newScale;
                            self.transform(true);
                        }
                    }
                },
                // rotate:function(evt){//旋转
                //     var angle = evt.angle;
                //     self.rotateAngle += angle;
                //     self.transform();
                // },
                multipointEnd: function () {
                    self._multiPoint = false;//多点触摸结束
                    lastScale = 1;
                }
            });
        }

        /**
         * 鼠标事件
         */
        if(self.controller.includes('mouse')){

            //裁剪区域鼠标按下
            self.$cropMask.addEventListener('mousedown',function(ev){
                self.startControl([ev.clientX,ev.clientY]);
            });
            //裁剪区域鼠标移动
            self.$cropMask.addEventListener('mousemove',function(ev){
                self.move([ev.clientX,ev.clientY]);
            });
            //裁剪区域鼠标松开
            self.$cropMask.addEventListener('mouseup',self.endControl.bind(self));
            //裁剪区域超出范围
            self.$cropMask.addEventListener('mouseleave',self.endControl.bind(self));
        }
    };

    //获取裁剪图片
    SimpleCrop.prototype.getCropImage = function () {
        var scaleWidth = this.$cropContent.width*this._rotateScale;
        var scaleHeight = this.$cropContent.height*this._rotateScale;

        var $scaleCanvas = document.createElement('canvas');
        $scaleCanvas.width = scaleWidth;
        $scaleCanvas.height = scaleHeight;
        var scaleContext = $scaleCanvas.getContext('2d');
        scaleContext.scale(this._rotateScale,this._rotateScale);
        scaleContext.drawImage(this.$cropContent,0,0,this.$cropContent.width,this.$cropContent.height);

        //document.body.appendChild($scaleCanvas);

        var rad = this.rotateAngle * Math.PI / 180;
        var origin = {
            x:scaleWidth*this._contentCenter.left,
            y:scaleHeight*this._contentCenter.top
        }
        var $rotateCanvas = document.createElement('canvas');
        $rotateCanvas.width = scaleWidth;
        $rotateCanvas.height = scaleHeight;
        var rotateContext = $rotateCanvas.getContext('2d');
        //图片绕画布某个点旋转
        rotateContext.translate(origin.x,origin.y);
        rotateContext.rotate(rad);
        rotateContext.translate(-origin.x,-origin.y);
        rotateContext.drawImage($scaleCanvas,0,0);

        //document.body.appendChild($rotateCanvas);

        var $newContentCanvas = document.createElement('canvas');
        $newContentCanvas.width = this.$cropContent.width;
        $newContentCanvas.height = this.$cropContent.height;
        var newContentContext = $newContentCanvas.getContext('2d');
        var offset = {
            left:(scaleWidth-this.$cropContent.width)*this._contentCenter.left,
            top:(scaleHeight-this.$cropContent.height)*this._contentCenter.top,
        }
        newContentContext.drawImage($rotateCanvas,offset.left,offset.top,this.$cropContent.width,this.$cropContent.height,0,0,this.$cropContent.width,this.$cropContent.height);

        //document.body.appendChild($newContentCanvas);

        var $cropImage = document.createElement('canvas');
        $cropImage.width = this.size.width;
        $cropImage.height = this.size.height;
        var imageContext = $cropImage.getContext('2d');
        imageContext.drawImage($newContentCanvas,this.size.left,this.size.top,this.size.width,this.size.height,0,0,this.size.width,this.size.height);

        return $cropImage;
    };

    //操作结束
    SimpleCrop.prototype.endControl = function(){
        if(this._isControl){
            this._isControl = false;
            var self = this;
            this._downPoint = [];
            this.scaleDownX = 0;
        }
    };

    //操作开始
    SimpleCrop.prototype.startControl = function(point){
        if(!this._isControl){
            this._isControl = true;
            this._downPoint = point?point:[];
        }
    };

    //滑动按钮移动
    SimpleCrop.prototype.scaleMove = function(curMoveX){
        this.startControl();
        this.$scaleBtn.style.transform = 'translateX('+curMoveX+'px)';
        this.$scaleValue.style.width = curMoveX+'px';
        this.$scaleBtn.setAttribute('moveX',curMoveX);
        this.scaleCurLeft = this.scaleInitLeft+curMoveX;
        this.scaleTimes = this.minScale+curMoveX*1.0/this.scaleWidth*(this.maxScale-this.minScale);
        this.transform();
    };

    //移动
    SimpleCrop.prototype.move = function(point){
        if(this._downPoint.length!=0&&!this._multiPoint){
            var moveX = point[0] - this._downPoint[0];
            var moveY = point[1] - this._downPoint[1];

            //先移动x轴
            var newPoints = [];
            for(var i=0;i<this.contentPoints.length;i++){
                newPoints.push({
                    x : this.contentPoints[i].x + moveX,
                    y : this.contentPoints[i].y
                });
            }
            var outPoints = [];
            for(var i=0;i<this.cropPoints.length;i++){//计算超出的裁剪框点坐标
                var pt = this.cropPoints[i];
                if(!this.isPointInRect(pt,newPoints)){
                    outPoints.push(pt);
                }
            }
            if(outPoints.length > 0){
                moveX = 0;
            }

            //再移动y轴
            newPoints = [];
            for(var i=0;i<this.contentPoints.length;i++){
                newPoints.push({
                    x : this.contentPoints[i].x + moveX,
                    y : this.contentPoints[i].y - moveY
                });
            }
            var outPoints = [];
            for(var i=0;i<this.cropPoints.length;i++){//计算超出的裁剪框点坐标
                var pt = this.cropPoints[i];
                if(!this.isPointInRect(pt,newPoints)){
                    outPoints.push(pt);
                }
            }
            if(outPoints.length > 0){
                moveY = 0;
            }

            var lastMoveX = parseFloat(this.$cropContent.getAttribute('moveX'));
            var lastMoveY = parseFloat(this.$cropContent.getAttribute('moveY'));
            var curMoveX = lastMoveX + moveX;
            var curMoveY = lastMoveY + moveY;
            this.$cropContent.setAttribute('moveX',curMoveX);
            this.$cropContent.setAttribute('moveY',curMoveY);
            this.transform();

            this._downPoint = point;
        }
    };

    //旋转、缩放、移动
    SimpleCrop.prototype.transform = function(rotateScale){
        var transform = '';
        var scaleNum = this.scaleTimes / this.times;
        var moveX = parseFloat(this.$cropContent.getAttribute('moveX'));
        var moveY = parseFloat(this.$cropContent.getAttribute('moveY'));

        if(rotateScale){//旋转时为了保证裁剪框不出现空白，需要在原有变换的基础上再进行一定的缩放，因此需要重新计算_rotateScale
            var points0 = [];
            for(var i=0;i<this.initContentPoints.length;i++){
                var item = this.initContentPoints[i];
                points0.push({
                    x:item.x,
                    y:item.y
                });
            }
            var points1 = [];
            for(var i=0;i<points0.length;i++){
                var p1 = this.scalePoint(points0[i],scaleNum);
                var p2 = this.translatePoint(p1,moveX,moveY);
                points1.push(p2);
            }
            var center1 = this.getPointsCenter(points1);
            this.contentPoints = [];
            for(var i=0;i<points1.length;i++){
                var p3 = this.rotatePoint(points1[i],center1,this.rotateAngle);
                this.contentPoints.push(p3);
            }

            //适当的放大裁剪框限制范围
            var biggerPoints = [];
            var exLen = 2;
            for(var i=0;i<this.cropPoints.length;i++){
                biggerPoints.push({
                    x : this.cropPoints[i].x,
                    y : this.cropPoints[i].y
                });
            }
            biggerPoints[0].x -= exLen;
            biggerPoints[0].y += exLen;
            biggerPoints[1].x += exLen;
            biggerPoints[1].y += exLen;
            biggerPoints[2].x += exLen;
            biggerPoints[2].y -= exLen;
            biggerPoints[3].x -= exLen;
            biggerPoints[3].y -= exLen;
            this._rotateScale = this.getCoverRectScale(this.contentPoints,biggerPoints);
        }

        scaleNum = scaleNum * this._rotateScale;

        //最终变换
        transform = '';
        transform += ' scale('+scaleNum+')';//缩放
        transform += ' translateX('+moveX/scaleNum+'px) translateY('+moveY/scaleNum+'px)';//移动
        transform += 'rotate('+this.rotateAngle+'deg)';
        this.$cropContent.style.transform = this._initTransform+' '+transform;

        //计算最终变换坐标
        var points2 = [];
        for(var i=0;i<this.initContentPoints.length;i++){
            var item = this.initContentPoints[i];
            points2.push({
                x:item.x,
                y:item.y
            });
        }
        var points3 = [];
        for(var i=0;i<points2.length;i++){
            var p1 = this.scalePoint(points2[i],scaleNum);
            var p2 = this.translatePoint(p1,moveX,moveY);
            points3.push(p2);
        }
        var center2 = this.getPointsCenter(points3);
        this.contentPoints = [];
        for(var i=0;i<points3.length;i++){
            var p3 = this.rotatePoint(points3[i],center2,this.rotateAngle);
            this.contentPoints.push(p3);
        }
    };

    //点坐标缩放
    SimpleCrop.prototype.scalePoint = function(point,num){
        point.x = point.x * num;
        point.y = point.y * num;
        return point;
    };

    //点坐标位移
    SimpleCrop.prototype.translatePoint = function(point,x,y){
        point.x = point.x + x;
        point.y = point.y - y;
        return point;
    };

    //点坐标旋转
    SimpleCrop.prototype.rotatePoint = function(p1,p0,angle){
        //任意点(x,y)，绕一个坐标点(rx0,ry0)逆时针旋转a角度后的新的坐标设为(x0, y0)
        //x0= (x - rx0)*cos(a) - (y - ry0)*sin(a) + rx0 ;
        //y0= (x - rx0)*sin(a) + (y - ry0)*cos(a) + ry0 ;

        var a = - angle / 180 * Math.PI;
        var rx0 = p0.x;
        var ry0 = p0.y;

        var x = p1.x;
        var y = p1.y;

        var p = {
            x : (x - rx0)*Math.cos(a) - (y - ry0)*Math.sin(a) + rx0,
            y : (x - rx0)*Math.sin(a) + (y - ry0)*Math.cos(a) + ry0
        }

        return p;
    };

    //获得矩形点坐标中心
    SimpleCrop.prototype.getPointsCenter = function(points){
        var center = {
            x : (points[0].x + points[2].x)/2,
            y : (points[0].y + points[2].y)/2,
        }
        return center;
    };

    //矩形位置形式转换为顶点坐标形式
    SimpleCrop.prototype.rectToPoints = function(rect){
        var points = [];
        points.push({
            x:-(this.maskViewSize.width/2 - rect.left),
            y:this.maskViewSize.height/2 - rect.top
        });
        points.push({
            x:points[0].x + rect.width,
            y:points[0].y
        });
        points.push({
            x:points[1].x,
            y:points[1].y - rect.height
        });
        points.push({
            x:points[0].x,
            y:points[2].y
        });

        return points;
    };

    //计算一个矩形刚好包含另一个矩形需要的缩放倍数
    SimpleCrop.prototype.getCoverRectScale = function(outer,inner){
        var scale = 1;
        var outPoints = [];
        //找出inner中超出outer的点坐标
        for(var i=0;i<inner.length;i++){
            var point = inner[i];
            if(!this.isPointInRect(point,outer)){
                outPoints.push(point);
            }
        }

        if(outPoints.length>0){
            for(var i=0;i<outPoints.length;i++){
                var num = this.getCoverPointScale(outPoints[i],outer);
                if(num > scale){
                    scale = num;
                }
            }
        }

        return scale;
    };

    //计算向量 a 在向量 b 上的投影向量
    SimpleCrop.prototype.getProjectionVector = function(vecA,vecB){
        var bLen = this.vecLen(vecB);
        var ab = vecA.x * vecB.x + vecA.y * vecB.y;

        var proj = {
            x : ab / Math.pow(bLen,2) * vecB.x,
            y : ab / Math.pow(bLen,2) * vecB.y,
        }

        return proj
    };

    //计算一个矩形刚好包含矩形外一点需要的缩放倍数
    SimpleCrop.prototype.getCoverPointScale = function(point,rectPoints){
        //计算矩形边框向量
        var borderVecs = [];
        for(var i=0;i<rectPoints.length;i++){
            var start = i;
            var end = i+1;
            if(end >= rectPoints.length){
                end = 0;
            }
            var vec = {
                x : rectPoints[end].x - rectPoints[start].x,
                y : rectPoints[end].y - rectPoints[start].y
            }
            borderVecs.push(vec);
        }

        //计算矩形中心点
        var center = this.getPointsCenter(rectPoints);
        var line = {
            x : point.x - center.x,
            y : point.y - center.y
        }

        //计算矩形外一点到矩形中心向量在矩形边框向量上的投影距离
        var len1 = this.vecLen(this.getProjectionVector(line,borderVecs[0]));
        var h1 = this.vecLen(borderVecs[0])/2;
        var len2 = this.vecLen(this.getProjectionVector(line,borderVecs[1]));
        var h2 = this.vecLen(borderVecs[1])/2;

        //根据投影距离计算缩放倍数
        var scale1 = 1;
        if(len1>h1){
            scale1 = scale1 + (len1 - h1)/h1;//只要是正常矩形那么 h1 和 h2 不可能为0
        }
        var scale2 = 1;
        if(len2>h2){
            scale2 = scale1 + (len2 - h2)/h2;
        }
        var scale = scale2 > scale1 ? scale2 : scale1;

        return scale;
    };

    //判断点是否在矩形内
    SimpleCrop.prototype.isPointInRect = function(point,rectPoints){
        //先计算四个向量
        var vecs = [];
        for(var i=0; i<rectPoints.length; i++){
            var p = rectPoints[i];
            vecs.push({x:(p.x - point.x),y:(p.y - point.y)});
        }

        //计算模最小向量
        var sIndex = 0;
        var sLen = 0;
        for(var i=0; i<vecs.length; i++){
            var len = this.vecLen(vecs[i]);
            if(len==0||len<sLen){
                sIndex = i;
                sLen = len;
            }
        }
        var len = vecs.length;
        var sVec = vecs.splice(sIndex,1)[0];
        var tVec = sVec;
        var eVec;

        //依次计算四个向量的夹角
        var angles = [];
        for(i=1;i<len;i++){
            var data = this.getMinAngle(tVec,vecs);
            tVec = data.vec;
            vecs.splice(data.index,1);
            angles.push(data.angle);

            if(vecs.length==1){
                eVec = vecs[0];
            }
        }
        angles.push(this.getMinAngle(eVec,[sVec]).angle);

        var sum = 0;
        for(var i=0;i<angles.length;i++){
            sum+=angles[i];
        }

        //向量之间的夹角等于360度则表示点在矩形内
        sum = sum.toPrecision(12);//取12位精度能在大部分情况下解决浮点数误差导致的精度问题
        if(sum<360){
            return false;
        }else{
            return true;
        }
    };

    //计算向量数组的中向量和目标向量的最小夹角
    SimpleCrop.prototype.getMinAngle = function(tVec, aVec){
        var minAngle = this.vecAngle(tVec,aVec[0]);
        var minIndex = 0;
        for(var i=1; i<aVec.length; i++){
            var angle = this.vecAngle(tVec,aVec[i]);
            if(angle<minAngle){
                minAngle = angle;
                minIndex = i;
            }
        }
        return {angle:minAngle,vec:aVec[minIndex],index:minIndex};
    };

    //计算向量夹角
    SimpleCrop.prototype.vecAngle = function(vec1,vec2){
        var rad = Math.acos((vec1.x * vec2.x + vec1.y * vec2.y) / (this.vecLen(vec1) * this.vecLen(vec2)));
        var angle = rad * 180 / Math.PI;
        return angle;
    };

    //计算向量的模
    SimpleCrop.prototype.vecLen = function(vec){
        var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        return len;
    };

    //file转image
    SimpleCrop.prototype.fileToSrc = function(file,callback){
        var reader = new FileReader();
        reader.onload = function (e) {
            callback(e.target.result);
        }
        reader.readAsDataURL(file)
    };

    return SimpleCrop;
}));