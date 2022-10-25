//配置路由规则
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Index from "@/views/Index.vue";
import BusinessList from "@/views/BusinessList.vue";
import Orders from "@/views/Orders.vue";
import AddUserAddress from "@/views/AddUserAddress.vue";
import EditUserAddress from "@/views/EditUserAddress.vue";
import UserAddress from "@/views/UserAddress.vue";
import Payment from "@/views/Payment.vue";
import OrderList from "@/views/OrderList.vue";
import SelectPage from "@/views/SelectPage.vue";
import UserCenter from "@/views/UserCenter.vue";
import Compass from "@/views/Compass.vue";
import CaiDan from "@/views/CaiDan.vue";
import Car from "@/views/Car.vue";

Vue.use(VueRouter);

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch((err) => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch((err) => err);
};

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            name: "Car",
            path: "/car",
            component: Car,
            meta: {
                isShow: true,
                index: 3,
            },
        },

        {
            name: "CaiDan",
            path: "/caidan",
            component: CaiDan,
            meta: {
                isShow: false,
            },
        },
        {
            name: "UserCenter",
            path: "/usercenter",
            component: UserCenter,
            meta: {
                isShow: true,
                index: 2,
            },
        },
        {
            name: "Compass",
            path: "/compass",
            component: Compass,
            meta: {
                isShow: true,
                index: 2,
            },
        },
        {
            name: "SelectPage",
            path: "/selectpage",
            component: SelectPage,
            meta: {
                isShow: true,
            },
        },
        {
            name: "AddUserAddress",
            path: "/adduseraddress",
            component: AddUserAddress,
            meta: {
                isShow: true,
            },
        },
        {
            name: "EditUserAddress",
            path: "/edituseraddress",
            component: EditUserAddress,
            meta: {
                isShow: true,
            },
        },
        {
            name: "UserAddress",
            path: "/useraddress",
            component: UserAddress,
            meta: {
                isShow: true,
            },
        },
        {
            name: "Orders",
            path: "/orders",
            component: Orders,
            meta: {
                isShow: false,
                index: 4,
            },
        },
        {
            name: "OrderList",
            path: "/OrderList",
            component: OrderList,
            meta: {
                isShow: true,
            },
        },
        {
            name: "Payment",
            path: "/Payment",
            component: Payment,
            meta: {
                isShow: true,
            },
        },

        {
            name: "BusinessList",
            path: "/businessList",
            component: BusinessList,
            meta: {
                isShow: true,
            },
        },
        {
            name: "Index",
            path: "/",
            component: Index,
            meta: {
                isShow: true,
                index: 1,
            },
        },
        {
            name: "Login",
            path: "/login",
            component: Login,
            meta: {
                isShow: false,
            },
        },
        {
            name: "Register",
            path: "/register",
            component: Register,
            meta: {
                isShow: false,
            },
        },
    ],
});
export default router;
