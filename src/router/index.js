import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Role from '@/views/permission/Role'
import Car from "@/views/basic/Car";
import Road from "@/views/road/Road";
import User from "@/views/basic/User";
import Parking from "@/views/road/Parking";
import Magnetometer from "@/views/device/Magnetometer";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/role',
                name: "Role",
                component: Role
            },
            {
                path: '/user',
                name: "User",
                component: User
            },
            {
                path: '/car',
                name: "Car",
                component: Car
            },
            {
                path: '/magnetometer',
                name: "Magnetometer",
                component: Magnetometer
            },
            {
                path: '/road',
                name: "Road",
                component: Road
            },
            {
                path: '/parking',
                name: "Parking",
                component: Parking
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 前置守卫：运行在路由跳转之前
router.beforeEach((to, form, next) => {
    console.log("跳转路由之前，执行……………………");
    let path = to.path;
    if (path == '/' || path == '/Login') {
        next();
        return;//代码到此结束，不要继续向下执行
    }
    let id = localStorage.getItem("id");
    if (!id) {
        next("/");//没有登录，就定位到登录页面上去
    } else {
        next();//放行
    }
})
//后置守卫：运行在路由跳转之后
router.afterEach((to, form, next) => {
    console.log("跳转路由之后，执行……………………");
})


export default router
