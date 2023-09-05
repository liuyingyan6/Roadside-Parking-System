import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/Home'
import Role from '@/views/permission/Role'

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
                path: '/Role',
                name: "Role",
                component: Role
            },
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
