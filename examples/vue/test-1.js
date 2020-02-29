import Vue from 'vue'
import '../../dist/template-1.css'
import SimpleCrop from '../../index.vue';

new Vue({
  el: '#app',
  data: {
    cropParams: {
      title: "上传图片过大，请裁剪",
      src: "../../img/test2.jpg",
      size: {
        width: 800,
        height: 600
      },
      cropSizePercent: 0.65,
      scaleSlider: true,
      maxScale: 3,
      borderWidth: 1,
      funcBtns: ["close", "crop", "upload"],
      borderColor: "#fff",
      coverColor: "rgba(0,0,0,.5)",
      startAngle: -360,
      endAngle: 360,
    }
  },
  components: {
    'simple-crop': SimpleCrop
  },
  methods: {
    //组件更新
    updateComponent() {
      this.cropParams = JSON.parse(JSON.stringify(this.cropParams)); //改变对象引用
      this.cropParams.borderColor = '#0BFF00'; //更新值
      this.cropParams.cropSizePercent = 0.5;
      this.cropParams.size = {
        width: 600,
        height: 600
      };
    },

    //设置裁剪图片
    setCropImage(evt) {
      var files = evt.target.files;
      if (files.length > 0) {
        this.cropParams = JSON.parse(JSON.stringify(this.cropParams)); //改变对象引用
        this.cropParams.src = files[0];
      }
      evt.target.value = '';
    },

    //关闭回调
    closeCallback() {
      console.log('closeCallback');
    },

    //图片裁剪回调函数
    cropCallback($resultCanvas) {
      console.log('cropCallback');
      $resultCanvas.style.marginRight = "10px";
      $resultCanvas.style.width = "50%";
      document.body.appendChild($resultCanvas);
    },

    //上传图片回调函数
    uploadCallback(src) {
      console.log('uploadCallback ' + src);
    }
  }
});