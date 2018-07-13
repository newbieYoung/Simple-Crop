(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require());
    } else {
        // Browser globals
        window.SimpleCrop = factory();
    }
}(function () {
    /**
     *
     * @param title 组件标题
     * @param src   初始图片路径
     * @param size  裁剪区域实际尺寸以及相对于裁剪容器位置
     * @param times 实际尺寸/显示尺寸
     * @param maskSize 裁剪容器实际尺寸
     * @param zIndex 样式层级
     * @param minScale 最小缩放倍数
     * @param maxScale 最大缩放倍数
     * @param isScaleFixed 缩放倍数范围是否固定
     * @param coverDraw 裁剪框绘制辅助线
     * @param scaleSlider 缩放滑动组件
     * @param funcBtns 功能按钮数组
     * @param cropCallback 确定裁剪回调函数
     * @param uploadCallback 重新上传回调函数
     * @param closeCallback 关闭回调函数
     */
    function SimpleCrop(params){

        this.id = 'crop-'+new Date().getTime();
        this.title = params.title;
        this.src = params.src;
        this.size = params.size;
        this.isScaleFixed = false;

        this.times = this.size.width>this.size.height?this.size.width*1.0/400:this.size.height*1.0/400;
        this.maskSize = {};
        this.maskSize.width = 800*this.times;
        this.maskSize.height = 600*this.times;
        this.scaleTimes = 1;

        this.size.left = (this.maskSize.width-this.size.width)*1.0/2;
        this.size.top = (this.maskSize.height-this.size.height)*1.0/2;
        this.borderWidth = 2;
        this.cropCallback = params.cropCallback;
        this.closeCallback = params.closeCallback;
        this.uploadCallback = params.uploadCallback;

        if(params.minScale&&params.maxScale){
            this.minScale = params.minScale;
            this.maxScale = params.maxScale;
            this.isScaleFixed = true;//如果缩放倍数范围是传参设置的，那么固定
        }

        this.zIndex = params.zIndex?params.zIndex:9999;
        this.coverDraw = params.coverDraw?params.coverDraw:this.defaultCoverDraw;
        this.scaleSlider = params.scaleSlider?params.scaleSlider:true;

        /**
         * 默认功能按钮为重新上传、裁剪
         * upload 重新上传
         * crop 裁减
         * close 取消
         */
        this.funcBtns = params.funcBtns?params.funcBtns:['close','upload','crop'];

        this.construct();
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
        html += '<canvas class="crop-content" width="'+this.maskSize.width+'" height="'+this.maskSize.height+'"></canvas>';
        html += '<canvas class="crop-cover" width="'+this.maskSize.width+'" height="'+this.maskSize.height+'"></canvas>';
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

        if(this.funcBtns.length>0){
            html += '<div class="crop-btns">';

            if(this.funcBtns.includes('upload')){
                html += '<div class="upload-btn-container">';
                html += '<button class="upload-btn"></button>';
                html += '<input type="file" accept="image/png,image/jpeg">';
                html += '</div>';
            }
            if(this.funcBtns.includes('crop')){
                html += '<button class="crop-btn"></button>';
            }
            if(this.funcBtns.includes('close')){
                html += '<button class="crop-close"></button>';
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

        //绘制裁剪框
        this.$cropCover = document.querySelector('#'+this.id+' .crop-cover');
        this.cropCoverContext = this.$cropCover.getContext('2d');
        this.cropCoverContext.fillStyle = 'rgba(0,0,0,.3)';
        this.cropCoverContext.fillRect(0,0,this.$cropCover.width,this.$cropCover.height);
        this.cropCoverContext.fillStyle = '#0BFF00';
        var width = this.borderWidth*2*this.times+this.size.width;
        var height = this.borderWidth*2*this.times+this.size.height;
        this.cropCoverContext.fillRect((this.maskSize.width-width)*1.0/2,(this.maskSize.height-height)*1.0/2,width,height);
        this.cropCoverContext.clearRect((this.maskSize.width-this.size.width)*1.0/2,(this.maskSize.height-this.size.height)*1.0/2,this.size.width,this.size.height);
        //绘制辅助线
        this.coverDraw();
    };

    //默认绘制辅助线
    SimpleCrop.prototype.defaultCoverDraw = function(){
        this.cropCoverContext.setLineDash([15, 20]);
        var maxSize = this.size.width>this.size.height?this.size.width:this.size.height;
        this.cropCoverContext.lineWidth = maxSize/200;

        this.cropCoverContext.beginPath();
        var rect1 = {
            left:(this.maskSize.width-this.size.width)*1.0/2,
            top:(this.maskSize.height-this.size.height)*1.0/2+this.size.height*0.125,
            right:(this.maskSize.width-this.size.width)*1.0/2+this.size.width,
            bottom:(this.maskSize.height-this.size.height)*1.0/2+this.size.height-this.size.height*0.125
        }
        this.cropCoverContext.moveTo(rect1.left,rect1.top);
        this.cropCoverContext.lineTo(rect1.right,rect1.top);
        this.cropCoverContext.moveTo(rect1.left,rect1.bottom);
        this.cropCoverContext.lineTo(rect1.right,rect1.bottom);
        this.cropCoverContext.strokeStyle = '#ffffff';
        this.cropCoverContext.stroke();

        this.cropCoverContext.beginPath();
        var rect2 = {
            left:(this.maskSize.width-this.size.width)*1.0/2+this.size.width*0.2,
            top:(this.maskSize.height-this.size.height)*1.0/2+this.size.height*0.2,
            right:(this.maskSize.width-this.size.width)*1.0/2+this.size.width-this.size.width*0.2 ,
            bottom:(this.maskSize.height-this.size.height)*1.0/2+this.size.height-this.size.height*0.2
        }
        this.cropCoverContext.moveTo(rect2.left,rect2.top);
        this.cropCoverContext.lineTo(rect2.right,rect2.top);
        this.cropCoverContext.lineTo(rect2.right,rect2.bottom);
        this.cropCoverContext.lineTo(rect2.left,rect2.bottom);
        this.cropCoverContext.lineTo(rect2.left,rect2.top);
        this.cropCoverContext.strokeStyle = '#ffeb3b';
        this.cropCoverContext.stroke();
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
                left:(self.maskSize.width-self.$image.width)*1.0/2,
                top:(self.maskSize.height-self.$image.height)*1.0/2,
                width:self.$image.width,
                height:self.$image.height
            };

            if(!self.isScaleFixed){//默认最大缩放倍数为2，最小缩放倍数为图片刚好填满裁切区域
                self.maxScale = 2;
                if(self.size.width*1.0/self.size.height>self.$image.width*1.0/self.$image.height){
                    self.minScale = self.size.width*1.0/self.$image.width;
                }else{
                    self.minScale = self.size.height*1.0/self.$image.height;
                }
                if(self.minScale>=self.maxScale){
                    self.maxScale = self.minScale;
                }
            }

            self.cropContentContext.clearRect(0,0,self.maskSize.width,self.maskSize.height);
            self.cropContentContext.drawImage(self.$image,self.contentRect.left,self.contentRect.top,self.$image.width,self.$image.height);
            //缩放滑动条回归初始状态
            var evt = new MouseEvent('click');
            self.$scaleOneTimes.dispatchEvent(evt);
        }
    };

    //显示
    SimpleCrop.prototype.show = function(src){
        if(src){
            this.src = src;
            this.load();
        }
        this.$target.style.display = 'block';
    },

    //隐藏
    SimpleCrop.prototype.hide = function(){
        this.$target.style.display = 'none';
    },

    //绑定事件
    SimpleCrop.prototype.bindEvent = function(){
        //获取事件相关dom元素
        var self = this;

        //裁剪
        if(self.funcBtns.includes('crop')){
            self.$cropBtn = document.querySelector('#'+self.id+' .crop-btn');
            self.$cropBtn.addEventListener('click',function(){
                self.$resultCanvas = document.createElement('canvas');
                self.$resultCanvas.width = self.size.width;
                self.$resultCanvas.height = self.size.height;
                self.resultContext = self.$resultCanvas.getContext('2d');
                if(self.scaleTimes>=1){
                    var rect = self.coverRectToContentRect(self.size);
                    self.resultContext.drawImage(self.$cropContent,rect.left,rect.top,rect.width,rect.height,0,0,self.size.width,self.size.height);
                }else{
                    self.resultContext.drawImage(self.$cropContent,self.size.left,self.size.top,self.size.width,self.size.height,0,0,self.size.width,self.size.height);
                }
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
                    }
                }
            },false);
            //滑动按钮超出范围
            self.$scaleContainer.addEventListener('mouseleave',function(ev){
                self.scaleDownX = 0;
            },false);
            //滑动按钮鼠标松开
            self.$scaleContainer.addEventListener('mouseup',function(ev){
                self.scaleDownX = 0;
            },false);
            //最小缩放按钮点击
            self.$scaleOneTimes.addEventListener('click',function(ev){
                self.scaleMove(0);
            },false);
            //最大缩放按钮点击
            self.$scaleTwoTimes.addEventListener('click',function(ev){
                self.scaleMove(self.scaleWidth);
            },false);
        }

        //画布相关事件
        self.$cropMask = document.querySelector('#'+self.id+' .crop-mask');
        self.$cropContent = document.querySelector('#'+self.id+' .crop-content');
        self.cropContentContext = self.$cropContent.getContext('2d');
        self.downPoint = [];

        //裁剪区域鼠标按下
        self.$cropMask.addEventListener('mousedown',function(ev){
            self.downPoint = [ev.clientX,ev.clientY];
        },false);
        //裁剪区域鼠标移动
        self.$cropMask.addEventListener('mousemove',function(ev){
            var point = [ev.clientX,ev.clientY];
            if(self.downPoint.length==2){
                var moveX = point[0] - self.downPoint[0];
                var moveY = point[1] - self.downPoint[1];

                var newContentRect = {
                    left:self.contentRect.left+moveX*self.times,
                    top:self.contentRect.top+moveY*self.times,
                    width:self.contentRect.width,
                    height:self.contentRect.height
                };

                var coverRect = self.contentRectToCoverRect(newContentRect);

                var isChanged = false;
                if(coverRect.left>self.size.left||(coverRect.left+coverRect.width)<(self.size.left+self.size.width)){
                    newContentRect.left = self.contentRect.left;
                }else{
                    var lastMoveX = parseFloat(self.$cropContent.getAttribute('moveX'));
                    if(!lastMoveX){
                        lastMoveX = 0;
                    }
                    var curMoveX = lastMoveX+moveX;
                    self.$cropContent.setAttribute('moveX',curMoveX);
                    isChanged = true;
                }
                if(coverRect.top>self.size.top||(coverRect.top+coverRect.height)<(self.size.top+self.size.height)){
                    newContentRect.top = self.contentRect.top;
                }else{
                    var lastMoveY = parseFloat(self.$cropContent.getAttribute('moveY'));
                    if(!lastMoveY){
                        lastMoveY = 0;
                    }
                    var curMoveY = lastMoveY+moveY;
                    self.$cropContent.setAttribute('moveY',curMoveY);
                    isChanged = true;
                }
                if(isChanged){
                    self.contentRect = newContentRect;
                    self.drawContentImage()
                }
                self.downPoint = point;
            }
        },false);
        //裁剪区域鼠标松开
        self.$cropMask.addEventListener('mouseup',function(ev){
            self.downPoint = [];
        },false);
        //裁剪区域超出范围
        self.$cropMask.addEventListener('mouseleave',function(ev){
            self.downPoint = [];
        },false);
    };

    //滑动按钮移动
    SimpleCrop.prototype.scaleMove = function(curMoveX){
        this.$scaleBtn.style.transform = 'translateX('+curMoveX+'px)';
        this.$scaleValue.style.width = curMoveX+'px';
        this.$scaleBtn.setAttribute('moveX',curMoveX);
        this.scaleCurLeft = this.scaleInitLeft+curMoveX;
        this.scaleTimes = this.minScale+curMoveX*1.0/this.scaleWidth*(this.maxScale-this.minScale);

        var coverTect = this.contentRectToCoverRect(this.contentRect);
        coverTect = this.rectLimit(coverTect);
        this.contentRect = this.coverRectToContentRect(coverTect);

        if(this.scaleTimes>=1){
            this.$cropContent.style.transform = 'scale('+this.scaleTimes+')';
        }
        this.drawContentImage();
    };

    //绘制内容图像
    SimpleCrop.prototype.drawContentImage = function(){
        if(this.scaleTimes>=1){
            this.cropContentContext.clearRect(0,0,this.maskSize.width,this.maskSize.height);
            this.cropContentContext.drawImage(this.$image,this.contentRect.left,this.contentRect.top,this.$image.width,this.$image.height);
        }else{
            /**
             * 缩小和放大的坐标转换规律一样，但是绘制方法有区别；
             * 主要是因为放大时画布超出可视容器，画布中不显示的，可视容器同样也不需要显示，正常绘制即可；
             * 但是缩小时画布尺寸小于可视容器，画布中不显示，可视容器不一定不显示，此时就需要假定一个坐标和画布一样，但是可视尺寸和可视容器一样的新的画布来绘制。
             * @type {Element}
             */
            var $tempCanvas = document.createElement('canvas');
            $tempCanvas.width = this.maskSize.width*1.0/this.scaleTimes;
            $tempCanvas.height = this.maskSize.height*1.0/this.scaleTimes;
            var tempContext = $tempCanvas.getContext('2d');
            var tempLeft = ($tempCanvas.width-this.maskSize.width)*1.0/2+this.contentRect.left;
            var tempTop = ($tempCanvas.height-this.maskSize.height)*1.0/2+this.contentRect.top;
            tempContext.drawImage(this.$image,tempLeft,tempTop,this.$image.width,this.$image.height);
            this.cropContentContext.clearRect(0,0,this.maskSize.width,this.maskSize.height);
            this.cropContentContext.drawImage($tempCanvas,0,0,this.maskSize.width,this.maskSize.height);
        }
    },

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
        var maxLen = this.maskSize.width>this.maskSize.height?this.maskSize.width:this.maskSize.height;
        if(coverRect.left>=this.size.left||Math.abs(coverRect.left-this.size.left)<=maxLen*1.0/50){
            coverRect.left = this.size.left;
        }else if((coverRect.left+coverRect.width)<(this.size.left+this.size.width)){
            coverRect.left = this.size.left+this.size.width-coverRect.width;
        }
        if(coverRect.top>=this.size.top||Math.abs(coverRect.top-this.size.top)<=maxLen*1.0/50){
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