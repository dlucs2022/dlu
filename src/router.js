import Vue from "vue";
/* 引入路由插件 */
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path:'/',
    component:()=>import('@/views/layout'),
    // redirect:'/layout/system_introduce',
    redirect:'/layout/image_classification',
  },
  {
    path:'/layout',
    component:()=>import('@/views/layout'),
    redirect:'/layout/system_introduce',
    children:[
      {
        path:'/layout/system_introduce',
        component:()=>import('./views/system_introduce')
      },
      {
        path:'/layout/image_classification',
        component:()=>import('./views/image_classification')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
});

export default router;
