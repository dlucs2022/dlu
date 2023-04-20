import Vue from "vue";
/* 引入路由插件 */
import VueRouter from "vue-router";


Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout'),
      // redirect:'/layout/system_introduce',
      redirect: '/layout/system_introduce',
    },
    {
      path: '/home',
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
          path: 'system_introduce',
          component: () => import('./views/system_introduce')
        },
        {
          path: 'image_classification',
          component: () => import('./views/image_classification')
        },
        {
          path: 'person_center',
          meta: { isAuth: true, },
          component: () => import('./views/personal_center/'),
          children: [
            {
              path: 'check_list',
              component: () => import('./views/personal_center/check_list')
            },
            {
              path: 'update_info',
              component: () => import('./views/personal_center/update_info')
            },
            {
              path: 'userInfo',
              component: () => import('./views/personal_center/userInfo')
            },
          ]
        },
      ]
    },
  ]
})


export default router