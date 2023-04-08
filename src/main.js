import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router";
import SlideVerify from 'vue-monoplasty-slide-verify'

/* 引入导航守卫 */
// import './permission'
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(SlideVerify)

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
