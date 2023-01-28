<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <p>我的订单</p>
      </header>

      <!-- 订单列表部分 -->
      <!-- 未支付的订单信息 -->
      <h3>未支付订单信息：</h3>
      <ul class="order">
         <li
            v-for="(item, index) in orderArr"
            :key="index"
            v-show="item.orderState == 0"
         >
            <div class="order-info">
               <p>
                  {{ item.business.businessName }}
                  <i class="fa fa-caret-down" @click="detailetShow(item)"></i>
               </p>
               <div class="order-info-right">
                  <p>&#165;{{ item.orderTotal }}</p>
                  <div
                     class="order-info-right-icon"
                     @click="toPayment(item.orderId)"
                  >
                     去支付
                  </div>
               </div>
            </div>
            <!-- 订单明细 -->
            <ul class="order-detailet" v-show="item.isShowDetailet">
               <li v-for="(odItem, index) in item.odList" :key="index">
                  <p>{{ odItem.food.foodName }} x {{ odItem.quantity }}</p>
                  <p>&#165;{{ odItem.food.foodPrice * odItem.quantity }}</p>
               </li>
               <li>
                  <p>配送费</p>
                  <p>&#165; {{ item.business.deliveryPrice }}</p>
               </li>
            </ul>
         </li>
      </ul>

      <!-- 已经支付的订单信息 -->
      <h3>已支付订单信息：</h3>
      <ul class="order">
         <li
            v-for="(item, index) in orderArr"
            :key="index"
            v-show="item.orderState == 1"
         >
            <div class="order-info">
               <p>
                  {{ item.business.businessName }}
                  <i class="fa fa-caret-down" @click="detailetShow(item)"></i>
               </p>
               <div class="order-info-right">
                  <p>&#165;{{ item.orderTotal }}</p>
               </div>
            </div>
            <!-- 订单明细 -->

            <ul class="order-detailet" v-show="item.isShowDetailet">
               <li v-for="(odItem, index) in item.odList" :key="index">
                  <p>{{ odItem.food.foodName }} x {{ odItem.quantity }}</p>
                  <p>&#165;{{ odItem.food.foodPrice * odItem.quantity }}</p>
               </li>
               <li>
                  <p>配送费</p>
                  <p>&#165; {{ item.business.deliveryPrice }}</p>
               </li>
            </ul>
         </li>
      </ul>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
   name: "OrderList",
   data() {
      return {
         orderArr: [], //用户下所有订单的数组
         user: {},
      };
   },
   created() {
      //读取用户的信息：
      this.user = this.$getSessionStorage("userinfo");
      //从LocalStorage中读取默认的配送地址
      this.deliveryAddress = this.$getLocalStorage(this.user.userId);
      this.$showLoading();
      //请求服务器API:  orders/getByUserId/{userId}
      this.$axios
         .get(
            "http://4j89034j54.zicp.vip:8988/elm/orders/information/" +
               this.user.userId
         )
         .then((response) => {
            let result = response.data.map.orders;
            console.log("result", result);
            //临时给order订单对象添加一个属性：是否显示订单详细信息  默认false
            for (let order of result) {
               order.isShowDetailet = false;
            }
            this.orderArr = result;
            console.log("最终处理得到的orderArr:-->", this.orderArr);

            this.$hideLoading();
         })
         .catch((error) => {
            console.log(error);
         });

      //测试
      this.$axios
         .get("http://4j89034j54.zicp.vip:8988/elm/food/getFoodId/2021070201")
         .then((response) => {
            console.log("==============================");
            console.log(response);
            console.log("==============================");
         })
         .catch((error) => {
            console.log(error);
         });
   },
   methods: {
      detailetShow(orders) {
         orders.isShowDetailet = !orders.isShowDetailet;
      },

      toPayment(orderId) {
         if (this.deliveryAddress == null) {
            this.$message({
               type: "warning",
               message: "请选择配送的地址",
            });
            return;
         }

         //跳转到payment页面
         this.$router.push({
            path: "/Payment",
            query: { orderId: orderId },
         });
      },
   },

   mounted() {
      if (this.$store.state.isNight) {
         setTimeout(() => {
            console.log("启用夜间模式");

            let header = document.querySelector("header");
            header.style.backgroundColor = "grey";
         }, 400);
      }
   },

   components: {
      Footer,
   },
};
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
   width: 100%;
   height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
   width: 100%;
   height: 12vw;
   background-color: #1561db;
   color: #fff;
   font-size: 4.8vw;

   position: fixed;
   left: 0;
   top: 0;
   z-index: 1000;

   display: flex;
   justify-content: center;
   align-items: center;
}

/****************** 历史订单列表部分 ******************/
.wrapper h3 {
   margin-top: 12vw;
   box-sizing: border-box;
   padding: 4vw;
   font-size: 4vw;
   font-weight: 300;
   color: #999;
}

.wrapper .order {
   width: 100%;
}

.wrapper .order li {
   width: 100%;
}

.wrapper .order li .order-info {
   box-sizing: border-box;
   padding: 2vw 4vw;
   font-size: 4vw;
   color: #666;

   display: flex;
   justify-content: space-between;
   align-items: center;
}

.wrapper .order li .order-info .order-info-right {
   display: flex;
}

.wrapper .order li .order-info .order-info-right .order-info-right-icon {
   background-color: #66cc66;
   color: #fff;
   border-radius: 3px;
   margin-left: 2vw;
   user-select: none;
   cursor: pointer;
}

.wrapper .order li .order-detailet {
   width: 100%;
}

.wrapper .order li .order-detailet li {
   width: 100%;
   box-sizing: border-box;
   padding: 1vw 4vw;
   color: #666;
   font-size: 3vw;

   display: flex;
   justify-content: space-between;
   align-items: center;
}
</style>
