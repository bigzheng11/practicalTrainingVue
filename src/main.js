import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import qs from "qs";
import store from './store/index.js'
import filters from "./filters/index.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { showLoading, hideLoading } from "./element/index.js";

/*导入 common.js工具类  */
import {
    getCurDate,
    setSessionStorage,
    getSessionStorage,
    removeSessionStorage,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
} from "./common.js";

//在Vue.filter方法中需要注册 所有的全局的过滤器
/* Object.keys(要遍历的对象).forEach(key,index)=>{ 循环的代码 }  */
Object.keys(filters).forEach((key, index) => {
    console.log(index);
    Vue.filter(key, filters[key]); //将index.js中的方法取出，循环定义成过滤器
});

//使用ElementUI
Vue.use(ElementUI);

Vue.config.productionTip = false;
//设置axios基础url路径
// axios.defaults.baseURL = 'http://localhost:8088/'
//设置 全局请求，带上token 的请求头
axios.interceptors.request.use(function (config) {
    //获取token，从LoaclStorage
    //let token = getLocalStorage('token')
    let token =
        getSessionStorage("userinfo") == null
            ? ""
            : getSessionStorage("userinfo").token;
    if (token) {
        config.headers.token = `${token}`; //将token加入到请求头
    }
    return config;
});

//将axios挂载vue上
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$hideLoading = hideLoading;
Vue.prototype.$getCurDate = getCurDate;
Vue.prototype.$setSessionStorage = setSessionStorage;
Vue.prototype.$getSessionStorage = getSessionStorage;
Vue.prototype.$removeSessionStorage = removeSessionStorage;
Vue.prototype.$setLocalStorage = setLocalStorage;
Vue.prototype.$getLocalStorage = getLocalStorage;
Vue.prototype.$removeLocalStorage = removeLocalStorage;

/**路由守卫  进行路由之前进行登录身份验证，验证通过可以访问一些组件：Orders.vue等，或者只有登录才可以进行相关数据提交的操作：例如添加购物车等等 */
router.beforeEach(function (to, from, next) {
    //获得session中存储的 登录后的用户信息：
    let userinfo = getSessionStorage("userinfo");
    //判断请求的路径：除了登录、注册、首页、商家列表（食品）、商家信息页面,剩下所有的组件信息都需要进行登录
    if (
        //放行部分
        !(
            to.path == "/" ||
            to.path == "/index" ||
            to.path == "/businessList" ||
            to.path == "/businessInfo" ||
            to.path == "/login" ||
            to.path == "/register" ||
            to.path == "/SelectPage"
        )
    ) {
        if (userinfo == null) {
            //如果从session中获得用户信息是null，代表没有登录
            router.push("/login"); //路由跳转至 登录组件
        }
    }
    next(); //放行
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
