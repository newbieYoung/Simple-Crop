import Vue from 'vue'
import SimpleCrop from '../../index.vue';
new Vue({
  el: '#app',
  data: {
    name: 'liy'
  },
  components: {
    'simple-crop': SimpleCrop
  }
});