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
     * @param borderWidth 裁剪区域边框宽度
     * @param positionOffset 裁剪区域偏移
     * @param size  裁剪区域实际尺寸以及相对于裁剪容器位置
     * @param cropSizePercent 裁剪区域占画布比例
     * @param times 实际尺寸/显示尺寸
     * @param maskSize 裁剪容器实际尺寸
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
     *
     * ------------------------------------
     *
     * 因为计算过程中涉及几个坐标系的转换需要注意一下：
     * 比如需要的截图的实际尺寸为400*400，但是因为容器的原因不能显示为实际尺寸，这里会保持宽高比例不变，进行一定的缩放，缩放之后也就存在逻辑尺寸和显示尺寸了；
     * 另外图片尺寸固定，但是绘制时存在缩放，比如初始化时会让裁剪框尽量填满最多的图片，那么这里也就产生了一个逻辑上的画布坐标系了。
     *
     * maskViewSize 容器的显示尺寸
     * maskSize 容器的逻辑尺寸
     * size 截图区域的逻辑尺寸
     * coverRect 遮罩坐标系
     * contentRect 画布坐标系
     * positionOffset 显示尺寸偏移
     *
     */
    function SimpleCrop(params){

        this.id = 'crop-'+new Date().getTime();
        this.title = params.title;
        this.src = params.src;
        this.size = params.size;
        this.isScaleFixed = false;

        this._multiPoint = false;//是否开始多点触控
        this._rotateScale = 1;//旋转缩放
        this._baseMoveX = 0;//刻度位置初始化偏移量
        this._borderCornerLen = 3;//裁剪框突出长度
        this._downPoint = [];//操作点坐标
        this._endTimeout = null;//结束操作定时器
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
        this.maskSize = {};
        this.maskSize.width = this.maskViewSize.width*this.times;
        this.maskSize.height = this.maskViewSize.height*this.times;

        this.scaleTimes = 1;//缩放倍数
        this.rotateAngle = 0;//旋转角度

        this.$cropCover = document.querySelector('#'+this.id+' .crop-cover');
        this.cropCoverContext = this.$cropCover.getContext('2d');
        this.$cropCover.width = this.maskSize.width;
        this.$cropCover.height = this.maskSize.height;
        this.$cropContent = document.querySelector('#'+this.id+' .crop-content');
        this.cropContentContext = this.$cropContent.getContext('2d');
        this.$cropContent.width = this.maskSize.width;
        this.$cropContent.height = this.maskSize.height;

        this.size.left = (this.maskSize.width-this.size.width)*1.0/2-this.positionOffset.left*this.times;
        this.size.top = (this.maskSize.height-this.size.height)*1.0/2-this.positionOffset.top*this.times;
        this.borderWidth = params.borderWidth!=null?params.borderWidth:2;

        /**
         * 计算画布中心
         * 裁剪框中心在画布坐标系的位置
         */
        this._contentCenter = {
            left:(0.5-this.positionOffset.left*1.0/this.maskViewSize.width),
            top:(0.5-this.positionOffset.top*1.0/this.maskViewSize.height)
        };
        this.$cropContent.style.transformOrigin = (this._contentCenter.left*100)+'% '+(this._contentCenter.top*100)+'%';

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
        document.body.appendChild(this.$target);
    };

    //默认绘制裁剪框
    SimpleCrop.prototype.defaultBorderDraw = function(){
        this.cropCoverContext.clearRect(0,0,this.$cropCover.width,this.$cropCover.height);
        this.cropCoverContext.fillStyle = 'rgba(0,0,0,.5)';
        this.cropCoverContext.fillRect(0,0,this.$cropCover.width,this.$cropCover.height);
        this.cropCoverContext.fillStyle = '#ffffff';

        //绘制边框
        var borderRectWidth = this.borderWidth*2*this.times+this.size.width;
        var borderRectHeight = this.borderWidth*2*this.times+this.size.height;
        var borderRect = {
            left:(this.maskSize.width-borderRectWidth)*1.0/2-this.positionOffset.left*this.times,
            top:(this.maskSize.height-borderRectHeight)*1.0/2-this.positionOffset.top*this.times,
            width:borderRectWidth,
            height:borderRectHeight
        }
        this.cropCoverContext.fillRect(borderRect.left,borderRect.top,borderRectWidth,borderRectHeight);

        //边框四个角加粗
        var percent = 0.05;
        var cornerRectWidth = borderRectWidth*percent;
        var cornerRectHeight = borderRectHeight*percent;
        this.cropCoverContext.fillRect(borderRect.left-this._borderCornerLen,borderRect.top-this._borderCornerLen,cornerRectWidth,cornerRectHeight);//左上角
        this.cropCoverContext.fillRect(borderRect.left+borderRectWidth-cornerRectWidth+this._borderCornerLen,borderRect.top-this._borderCornerLen,cornerRectWidth,cornerRectHeight);//右上角
        this.cropCoverContext.fillRect(borderRect.left-this._borderCornerLen,borderRect.top+borderRectHeight-cornerRectHeight+this._borderCornerLen,cornerRectWidth,cornerRectHeight);//左下角
        this.cropCoverContext.fillRect(borderRect.left+borderRectWidth-cornerRectWidth+this._borderCornerLen,borderRect.top+borderRectHeight-cornerRectHeight+this._borderCornerLen,cornerRectWidth,cornerRectHeight);//右下角

        //清空内容区域
        var innerRect = {
            left:(this.maskSize.width-this.size.width)*1.0/2-this.positionOffset.left*this.times,
            top:(this.maskSize.height-this.size.height)*1.0/2-this.positionOffset.top*this.times,
            width:this.size.width,
            height:this.size.height
        }
        this.cropCoverContext.clearRect(innerRect.left,innerRect.top,innerRect.width,innerRect.height);
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
            self.contentRect = {
                left:(self.maskSize.width-self.$image.width)*1.0/2-self.positionOffset.left*self.times,
                top:(self.maskSize.height-self.$image.height)*1.0/2-self.positionOffset.top*self.times,
                width:self.$image.width,
                height:self.$image.height
            };

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
            self.scale();
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
            },false);
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
            },false);
        }

        //整角旋转
        if(self.funcBtns.includes('around')){
            self.$cropAround = document.querySelector('#'+self.id+' .crop-around');
            self.$cropAround.addEventListener('click',function(){
                self.rotateAngle = self._baseAngle-90;
                self._baseAngle = self.rotateAngle;
                self.$lineation.setAttribute('moveX',self._baseMoveX);
                self.$lineation.style.transform = 'translateX('+self._baseMoveX+'px)';
                self.rotate();
            })
        }

        //还原
        if(self.funcBtns.includes('reset')){
            self.$cropReset = document.querySelector('#'+self.id+' .crop-reset');
            self.$cropReset.addEventListener('click',function(){
                self._rotateScale = 1;
                self._baseAngle = 0;
                self.rotateAngle = 0;
                self.$lineation.setAttribute('moveX',self._baseMoveX);
                self.$lineation.style.transform = 'translateX('+self._baseMoveX+'px)';
                self.scaleTimes = self.minScale;
                self.rotate();
                self.scale();
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
            },false);
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
            },false);
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
            },false);
            //缩放条点击
            self.$scaleBtn.addEventListener('click',function(ev){//滑动按钮点击
                ev.stopPropagation();
            },false);
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
            },false);
            //滑动按钮超出范围
            self.$scaleContainer.addEventListener('mouseleave',self.endControl.bind(self),false);
            //滑动按钮鼠标松开
            self.$scaleContainer.addEventListener('mouseup',self.endControl.bind(self),false);
            //最小缩放按钮点击
            self.$scaleOneTimes.addEventListener('click',function(ev){
                self.scaleMove(0);
                self.endControl();
            },false);
            //最大缩放按钮点击
            self.$scaleTwoTimes.addEventListener('click',function(ev){
                self.scaleMove(self.scaleWidth);
                self.endControl();
            },false);
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
                    self.rotate();
                    self._downPoint = point;
                }
            });
            //刻度触摸结束
            self.$cropRotate.addEventListener('touchend',self.endControl.bind(self),false);
            //刻度触摸取消
            self.$cropRotate.addEventListener('touchcancel',self.endControl.bind(self),false);
        }

        //画布相关事件

        /**
         * 触摸事件
         */
        if(self.controller.includes('touch')){

            //裁剪区域触摸开始
            self.$cropMask.addEventListener('touchstart',function(e){
                var touch = e.touches[0];
                self.startControl([touch.clientX,touch.clientY]);
            });
            //裁剪区域触摸移动
            self.$cropMask.addEventListener('touchmove',function(e){
                var touch = e.touches[0];
                self.move([touch.clientX,touch.clientY]);
                e.preventDefault();//阻止默认行为
            });
            //裁剪区域触摸结束
            self.$cropMask.addEventListener('touchend',self.endControl.bind(self),false);
            //裁剪区域触摸取消
            self.$cropMask.addEventListener('touchcancel',self.endControl.bind(self),false);

            //复杂手势事件
            var lastScale = 1;
            new finger(self.$cropMask, {
                multipointStart: function () {
                    self._multiPoint = true;//多点触摸开始
                },
                pinch: function (evt) {//缩放
                    var scale = evt.scale;
                    var newScale = self.scaleTimes/lastScale*scale;
                    if(newScale>=self.minScale&&newScale<=self.maxScale){
                        self.scaleTimes = newScale
                        lastScale = scale;
                        self.scale();
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
                            self.scale();
                        }
                    }
                },
                // rotate:function(evt){//旋转
                //     var angle = evt.angle;
                //     self.rotateAngle += angle;
                //     self.rotate();
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
            },false);
            //裁剪区域鼠标移动
            self.$cropMask.addEventListener('mousemove',function(ev){
                self.move([ev.clientX,ev.clientY]);
            },false);
            //裁剪区域鼠标松开
            self.$cropMask.addEventListener('mouseup',self.endControl.bind(self),false);
            //裁剪区域超出范围
            self.$cropMask.addEventListener('mouseleave',self.endControl.bind(self),false);
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
            if(this._endTimeout){
                clearTimeout(this._endTimeout);
            }
            this._endTimeout = setTimeout(function(){
                self.drawContentImage(self.bgFilter);
            },500);
        }
    };

    //操作开始
    SimpleCrop.prototype.startControl = function(point){
        if(!this._isControl){
            this._isControl = true;
            if(this._endTimeout){
                clearTimeout(this._endTimeout);
            }
            this._downPoint = point?point:[];
            this.borderDraw();
            this.coverDraw();
            this.drawContentImage();
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
        this.scale();
    };

    //缩放
    SimpleCrop.prototype.scale = function(){
        var transform = '';
        var coverTect = this.contentRectToCoverRect(this.contentRect);
        coverTect = this.rectLimit(coverTect);
        this.contentRect = this.coverRectToContentRect(coverTect);
        if(this._rotateScale){
            transform += 'scale('+this._rotateScale+') ';
        }
        transform += 'rotate('+this.rotateAngle+'deg)';
        this.$cropContent.style.transform = transform;
        this.drawContentImage();
    };

    //旋转
    SimpleCrop.prototype.rotate = function(){
        var transform = '';
        //旋转时为了保证裁剪框不出现空白，需要进行一定的缩放
        var rad = this.rotateAngle/180*Math.PI;
        var newHeight = this.size.width*Math.abs(Math.sin(rad))+this.size.height*Math.abs(Math.cos(rad));
        var newWidth = this.size.width*Math.abs(Math.cos(rad))+this.size.height*Math.abs(Math.sin(rad));
        var scaleWidth = newWidth/this.size.width;
        var scaleHeight = newHeight/this.size.height;
        var maxScale = scaleWidth>scaleHeight?scaleWidth:scaleHeight;
        this._rotateScale = maxScale;
        transform += 'rotate('+this.rotateAngle+'deg)';
        transform += 'scale('+this._rotateScale+') ';
        this.$cropContent.style.transform = transform;
    };

    //移动
    SimpleCrop.prototype.move = function(point){
        if(this._downPoint.length!=0&&!this._multiPoint){
            var moveX = point[0] - this._downPoint[0];
            var moveY = point[1] - this._downPoint[1];

            var rad = -this.rotateAngle/180*Math.PI;
            var newX = moveX*Math.cos(rad)-moveY*Math.sin(rad);
            var newY = moveX*Math.sin(rad)+moveY*Math.cos(rad);

            var newContentRect = {
                left:this.contentRect.left+newX*this.times,
                top:this.contentRect.top+newY*this.times,
                width:this.contentRect.width,
                height:this.contentRect.height
            };

            var coverRect = this.contentRectToCoverRect(newContentRect);

            var isChanged = false;
            if(coverRect.left>this.size.left||(coverRect.left+coverRect.width)<(this.size.left+this.size.width)){
                newContentRect.left = this.contentRect.left;
            }else{
                var lastMoveX = parseFloat(this.$cropContent.getAttribute('moveX'));
                if(!lastMoveX){
                    lastMoveX = 0;
                }
                var curMoveX = lastMoveX+newX;
                this.$cropContent.setAttribute('moveX',curMoveX);
                isChanged = true;
            }
            if(coverRect.top>this.size.top||(coverRect.top+coverRect.height)<(this.size.top+this.size.height)){
                newContentRect.top = this.contentRect.top;
            }else{
                var lastMoveY = parseFloat(this.$cropContent.getAttribute('moveY'));
                if(!lastMoveY){
                    lastMoveY = 0;
                }
                var curMoveY = lastMoveY+newY;
                this.$cropContent.setAttribute('moveY',curMoveY);
                isChanged = true;
            }
            if(isChanged){
                this.contentRect = newContentRect;
                this.drawContentImage()
            }
            this._downPoint = point;
        }
    };

    //绘制内容图像
    SimpleCrop.prototype.drawContentImage = function(filter){
        //假定一个坐标和画布一样，但是可视尺寸和可视容器一样的新的画布来绘制
        var $tempCanvas = document.createElement('canvas');
        $tempCanvas.width = this.maskSize.width*1.0/this.scaleTimes;
        $tempCanvas.height = this.maskSize.height*1.0/this.scaleTimes;
        var tempContext = $tempCanvas.getContext('2d');
        var tempLeft = ($tempCanvas.width-this.maskSize.width)*1.0/2+this.contentRect.left;
        var tempTop = ($tempCanvas.height-this.maskSize.height)*1.0/2+this.contentRect.top;
        tempContext.drawImage(this.$image,tempLeft,tempTop,this.contentRect.width,this.contentRect.height);
        this.cropContentContext.clearRect(0,0,this.maskSize.width,this.maskSize.height);
        this.$cropContent.style.filter = 'none';
        this.cropContentContext.drawImage($tempCanvas,0,0,this.maskSize.width,this.maskSize.height);
        if(filter||!this.$resultCanvas){
            this.$resultCanvas = this.getCropImage();
            this.$cropContent.style.filter = filter;
            this.cropCoverContext.drawImage(this.$resultCanvas,this.size.left,this.size.top,this.size.width,this.size.height);
            this.coverDraw();
        }
    };

    //坐标转换
    SimpleCrop.prototype.contentRectToCoverRect = function(contentRect){
        var coverRect = {
            left:contentRect.left*this.scaleTimes,
            top:contentRect.top*this.scaleTimes,
            width:contentRect.width*this.scaleTimes,
            height:contentRect.height*this.scaleTimes
        };
        var overLeft = this.maskSize.width*(this.scaleTimes-1)*1.0/2;
        var overTop = this.maskSize.height*(this.scaleTimes-1)*1.0/2;

        coverRect.left = coverRect.left-overLeft;
        coverRect.top = coverRect.top-overTop;

        return coverRect;
    };
    SimpleCrop.prototype.coverRectToContentRect = function(coverRect){
        var overLeft = this.maskSize.width*(this.scaleTimes-1)*1.0/2;
        var overTop = this.maskSize.height*(this.scaleTimes-1)*1.0/2;

        var contentRect = {
            left:(coverRect.left+overLeft)*1.0/this.scaleTimes,
            top:(coverRect.top+overTop)*1.0/this.scaleTimes,
            width:coverRect.width*1.0/this.scaleTimes,
            height:coverRect.height*1.0/this.scaleTimes
        }

        return contentRect;
    };

    //坐标限制
    SimpleCrop.prototype.rectLimit = function(coverRect){
        if(coverRect.left>=this.size.left){
            coverRect.left = this.size.left;
        }else if((coverRect.left+coverRect.width)<(this.size.left+this.size.width)){
            coverRect.left = this.size.left+this.size.width-coverRect.width;
        }
        if(coverRect.top>=this.size.top){
            coverRect.top = this.size.top;
        }else if((coverRect.top+coverRect.height)<(this.size.top+this.size.height)){
            coverRect.top = this.size.top+this.size.height-coverRect.height;
        }

        return coverRect;
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