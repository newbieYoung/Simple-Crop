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
     */
    function SimpleCrop(params){

        this.id = 'crop-'+new Date().getTime();
        this.title = params.title;
        this.src = params.src;
        this.size = params.size;

        if(this.size.width>this.size.height){
            this.times = this.size.width*1.0/400;
        }else{
            this.times = this.size.height*1.0/400;
        }
        this.maskSize = {};
        this.maskSize.width = 800*this.times;
        this.maskSize.height = 600*this.times;
        this.scaleTimes = 1;

        this.size.left = (this.maskSize.width-this.size.width)*1.0/2;
        this.size.top = (this.maskSize.height-this.size.height)*1.0/2;
        this.borderWidth = 2;

        this.construct();
        this.load();
        this.bindEvent();
    }

    //html结构
    SimpleCrop.prototype.construct = function(){
        var html = '';
        html += '<div class="crop-component">';
        html += '<p class="crop-title">'+this.title+'<span class="crop-close"></span></p>';
        html += '<div class="crop-mask">'
        html += '<canvas class="crop-content" width="'+this.maskSize.width+'" height="'+this.maskSize.height+'"></canvas>';
        html += '<canvas class="crop-cover" width="'+this.maskSize.width+'" height="'+this.maskSize.height+'"></canvas>';
        html += '</div>';
        html += '<div class="crop-scale">';
        html += '<div class="one-times-icon"></div>';
        html += '<div class="scale-container">';
        html += '<div class="scale-num"><span class="scale-value" style="width:0px;"></span><span class="scale-btn" style="left:-8px;"></span></div>';
        html += '</div>';
        html += '<div class="two-times-icon"></div>';
        html += '</div>';
        html += '<div class="crop-btns">';
        html += '<div class="upload-btn-container">';
        html += '<button class="upload-btn">重新上传</button>';
        html += '<input type="file" accept="image/png,image/jpeg">';
        html += '</div>';
        html += '<button class="crop-btn">确定裁剪</button>';
        html += '</div>';
        html += '</div>';

        this.$target = document.createElement('div');
        this.$target.id = this.id;
        this.$target.classList.add('crop-whole-cover');
        this.$target.innerHTML = html;
        document.body.appendChild(this.$target);

        var $cropCover = document.querySelector('#'+this.id+' .crop-cover');
        var cropCoverContext = $cropCover.getContext('2d');
        cropCoverContext.fillStyle = 'rgba(0,0,0,.3)';
        cropCoverContext.fillRect(0,0,$cropCover.width,$cropCover.height);
        cropCoverContext.fillStyle = '#0BFF00';
        var width = this.borderWidth*2*this.times+this.size.width;
        var height = this.borderWidth*2*this.times+this.size.height;
        cropCoverContext.fillRect((this.maskSize.width-width)*1.0/2,(this.maskSize.height-height)*1.0/2,width,height);
        cropCoverContext.clearRect((this.maskSize.width-this.size.width)*1.0/2,(this.maskSize.height-this.size.height)*1.0/2,this.size.width,this.size.height);
    };

    //加载图片
    SimpleCrop.prototype.load = function(callback){
        var self = this;
        if(!self.$image){
            self.$image = new Image();
        }
        self.$image.src = self.src;
        self.$image.onload = function(){
            self.contentRect = {
                left:self.size.left,
                top:self.size.top,
                width:self.$image.width,
                height:self.$image.height
            };
            self.cropContentContext.clearRect(0,0,self.maskSize.width,self.maskSize.height);
            self.cropContentContext.drawImage(self.$image,self.contentRect.left,self.contentRect.top,self.$image.width,self.$image.height);
        }
    };

    //绑定事件
    SimpleCrop.prototype.bindEvent = function(){
        //获取事件相关dom元素
        var self = this;
        self.$uploadBtn = document.querySelector('#'+self.id+' .upload-btn-container');
        self.$closeBtn = document.querySelector('#'+self.id+' .crop-close');
        self.$scaleBtn = document.querySelector('#'+self.id+' .scale-btn');
        self.$scaleNum = document.querySelector('#'+self.id+' .scale-num');
        self.$scaleOneTimes = document.querySelector('#'+self.id+' .one-times-icon');
        self.$scaleTwoTimes = document.querySelector('#'+self.id+' .two-times-icon');
        self.$scaleContainer = document.querySelector('#'+self.id+' .scale-container');
        self.$scaleValue = document.querySelector('#'+self.id+' .scale-value');
        self.$cropMask = document.querySelector('#'+self.id+' .crop-mask');
        self.$cropContent = document.querySelector('#'+self.id+' .crop-content');
        self.cropContentContext = self.$cropContent.getContext('2d');

        //事件相关属性
        self.downPoint = [];
        self.scaleDownX = 0;
        self.scaleInitLeft = self.$scaleBtn.getBoundingClientRect().left;
        self.scaleCurLeft = self.scaleInitLeft;
        self.scaleWidth = self.$scaleNum.getBoundingClientRect().width;

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
                    self.cropContentContext.clearRect(0,0,self.maskSize.width,self.maskSize.height);
                    self.cropContentContext.drawImage(self.$image,self.contentRect.left,self.contentRect.top,self.$image.width,self.$image.height);
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
        //滑动按钮超出范围
        self.$scaleContainer.addEventListener('mouseleave',function(ev){
            self.scaleDownX = 0;
        },false);
        //滑动按钮鼠标松开
        self.$scaleContainer.addEventListener('mouseup',function(ev){
            self.scaleDownX = 0;
        },false);
        //一倍图按钮点击
        self.$scaleOneTimes.addEventListener('click',function(ev){
            self.scaleMove(0);
        },false);
        //二倍图按钮点击
        self.$scaleTwoTimes.addEventListener('click',function(ev){
            self.scaleMove(self.scaleWidth);
        },false);

        //点击关闭
        self.$closeBtn.addEventListener('click',function(){
            self.$target.style.display = 'none';
        },false);

        //重新上传
        self.$uploadBtn.addEventListener('change',function(evt){
            var files = evt.target.files;
            if(files.length>0){
                self.fileToSrc(files[0],function(src){
                    self.src = src;
                    self.load();
                });
            }
        },false);
    };

    //滑动按钮移动
    SimpleCrop.prototype.scaleMove = function(curMoveX){
        this.$scaleBtn.style.transform = 'translateX('+curMoveX+'px)';
        this.$scaleValue.style.width = curMoveX+'px';
        this.$scaleBtn.setAttribute('moveX',curMoveX);
        this.scaleCurLeft = this.scaleInitLeft+curMoveX;
        this.scaleTimes = 1+curMoveX*1.0/this.scaleWidth;
        this.$cropContent.style.transform = 'scale('+this.scaleTimes+')';

        var coverTect = this.contentRectToCoverRect(this.contentRect);
        coverTect = this.rectLimit(coverTect);
        this.contentRect = this.coverRectToContentRect(coverTect);

        this.cropContentContext.clearRect(0,0,this.maskSize.width,this.maskSize.height);
        this.cropContentContext.drawImage(this.$image,this.contentRect.left,this.contentRect.top,this.$image.width,this.$image.height);
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
        var maxLen = this.maskSize.width>this.maskSize.height?this.maskSize.width:this.maskSize.height;
        if(coverRect.left>=this.size.left||Math.abs(coverRect.left-this.size.left)<=maxLen*1.0/50){
            coverRect.left = this.size.left;
        }else if((coverRect.left+coverRect.width)<(this.size.left+this.maskSize.width)){
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