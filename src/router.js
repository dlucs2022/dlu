import Vue from "vue";
/* 引入路由插件 */
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    // redirect:'/layout/system_introduce',
    redirect: '/layout/system_introduce',
  },
  {
    path: "/register",
    name: "register",
    hidden: true,
    component: () => import("@/views/register/register"),
  },
  {
    path: "/info",
    name: "info",
    hidden: true,
    component: () => import("@/views/info_manager/index"),
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    // component: Login,
    // Vue异步组件 懒加载
    component: (resolve) => require(["@/views/login/Login"], resolve),
  },
  {
    path: '/layout',
    component: () => import('@/views/layout'),
    redirect: '/layout/system_introduce',
    children: [
      {
        path: '/layout/system_introduce',
        component: () => import('./views/system_introduce')
      },
      {
        path: '/layout/image_classification',
        component: () => import('./views/image_classification')
      },
      {
        path:'/layout/person_center/check_list',
        component:() => import('./views/personal_center/check_list')
      }
    ]
  },

]

const router = new VueRouter({
  routes,
});

export default router;
