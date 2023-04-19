import Vue from "vue";
import App from "./App.vue";
//引入element-ui的全部组件
import ElementUI from 'element-ui'
//引入element-ui的css
import 'element-ui/lib/theme-chalk/index.css'
import router from "./router";
import SlideVerify from 'vue-monoplasty-slide-verify'
import qs from 'qs'

/* 引入导航守卫 */
// import './permission'
Vue.config.productionTip = false;
//使用elementUI
Vue.use(ElementUI)
Vue.use(SlideVerify)

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
