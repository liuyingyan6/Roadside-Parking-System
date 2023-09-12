import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Head from '@/views/sys/Head'
import Role from '@/views/permission/Role'
import Car from "@/views/permission/Car";
import User from "@/views/permission/User";
import LoginLog from "@/views/log/LoginLog.vue";
import OperationLog from "@/views/log/OperationLog.vue";
import Magnetometer from "@/views/device/Magnetometer.vue";
import MagnetometerLog from "@/views/device/MagnetometerLog.vue";
import ManagerAccount from "@/views/permission/ManagerAccount";
import Order from "@/views/permission/Order.vue";
import OrderDetails from "@/views/secondaryMenu/OrderDetails.vue";
import Cashflow from "@/views/finance/Cashflow";
import Information from "@/views/sys/Information";
import UserDetails from "@/views/secondaryMenu/UserDetails";
import CarOrder from "@/views/permission/CarOrder";
import Road from "@/views/road/Road";
import Parking from "@/views/road/Parking";
import ThirdParty from "@/views/permission/ThirdParty.vue";

import UserFeedback from "@/views/feedback/UserFeedback";
import InspectorFeedback from "@/views/feedback/InspectorFeedback";
import InspectorFeedbackDetail from "@/views/feedback/InspectorFeedbackDetail";
import Operator from "@/views/employee/Operator";
import PdaLog from "@/views/device/PdaLog.vue";
import Pda from "@/views/device/Pda.vue";
import Revenue from "@/views/statistics/Revenue.vue";
import Attendance from "@/views/statistics/Attendance.vue";
import Payment from "@/views/statistics/Payment";
import Home from "@/views/sys/Home";

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
        path: '/head',
        name: 'Head',
        component: Head,
        children: [

            {
                path: '/home',
                name: 'Home',
                component: Home
            },
            {
                path: '/role',
                name: "Role",
                component: Role
            },
            {
                path: '/manager',
                name: "ManagerAccount",
                component: ManagerAccount
            },
            {
                path: '/car',
                name: "Car",
                component: Car
            },
            {
                path: '/manager',
                name: "ManagerAccount",
                component: () => import('@/views/permission/ManagerAccount'),
            },
            {
                path: '/inspector',
                name: "Inspector",
                component: () => import('@/views/staffSys/Inspector'),
                meta: { title: 'Inspector.vue页面', icon: 'table' },
                // hidden: true
            },
            {
                path: '/inspectorDetails',
                name: 'InspectorDetails',
                component: () => import('@/views/staffSys/InspectorDetails'),
            },
            {
                path: '/user',
                name: "User",
                component: User
            },
            {
                path: '/loginLog',
                name: "LoginLog",
                component: LoginLog
            },
            {
                path: '/operationLog',
                name: "OperationLog",
                component: OperationLog
            },
            {
                path: '/magnetometer',
                name: "Magnetometer",
                component: Magnetometer
            },
            {
                path: '/magnetometerLog/:id',
                name: "MagnetometerLog",
                component: MagnetometerLog
            },
            {
                path: '/pda',
                name: "Pda",
                component: Pda
            },
            {
                path: '/pdaLog/:id',
                name: "PdaLog",
                component: PdaLog
            },
            {
                path: '/revenue',
                name: "Revenue",
                component: Revenue
            },
            {
              path: '/attendance',
              name: "Attendance",
                component: Attendance
            },
            {
                path: '/order',
                name: "Order",
                component: Order,
            },
                path: '/order/:id', // Dynamic route parameter ":status"
                name: 'OrderDetails',
                component: ()=> import('../views/secondaryMenu/OrderDetails.vue')

            },{
                path: '/thirdParty',
                name: ThirdParty,
                component: ThirdParty
            },
            {
                path:'/cashflow',
                    name: "Cashflow",
                component: Cashflow
            },
            {
                path:'/information',
                name: "Information",
                component: Information
            },
            {
                path:`/userDetails/:id`,
                name: "UserDetails",
                component: UserDetails
            },
            {
                path:'/carOrder',
                name: "CarOrder",
                component: CarOrder
            },
            {
                path:'/road',
                name: "Road",
                component: Road
            },
            {
                path:'/parking',
                name: "Parking",
                component: Parking
            },
            {
                path:'/userFeedback',
                name: "UserFeedback",
                component: UserFeedback
            },
            {
                path:'/inspectorFeedback',
                name: "InspectorFeedback",
                component: InspectorFeedback
            },
            {
                path:'/inspectorFeedbackDetail',
                name: "InspectorFeedbackDetail",
                component: InspectorFeedbackDetail
            },
            {
                path:'/operator',
                name: "Operator",
                component: Operator
            },
            {
                path:'/payment',
                name: "Payment",
                component: Payment
            },
            {
                path: '/information',
                name: 'Information',
                component: () => import('@/views/sys/Information'),
            },

            {
                path: '/userFeedback',
                name: 'UserFeedback',
                component: () => import('@/views/feedback/UserFeedback'),
            },
            {
                path: '/userFeedbackDetails',
                name: 'UserFeedbackDetails',
                component: () => import('@/views/feedback/UserFeedbackDetails'),
            }

        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// // 前置守卫：运行在路由跳转之前
// router.beforeEach((to, form, next) => {
//     console.log("跳转路由之前，执行……………………");
//     let path = to.path;
//     if (path == '/' || path == '/Login') {
//         next();
//         return;//代码到此结束，不要继续向下执行
//     }
//     let id = localStorage.getItem("id");
//     if (!id) {
//         next("/");//没有登录，就定位到登录页面上去
//     } else {
//         next();//放行
//     }
// })
// //后置守卫：运行在路由跳转之后
// router.afterEach((to, form, next) => {
//     console.log("跳转路由之后，执行……………………");
// })


export default router
