import Vue from 'vue'
import '../../dist/template-2.css'
import SimpleCrop from '../../index.vue';

new Vue({
  el: '#app',
  data: {
    cropParams: {
      src: "../../img/test2.jpg",
      size: {
        width: 800,
        height: 600
      },
      borderColor: '#fff',
      cropSizePercent: 0.9
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
      this.cropParams.cropSizePercent = 0.8;
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