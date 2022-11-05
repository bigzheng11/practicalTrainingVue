<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <p>在线支付</p>
      </header>

      <!-- 订单信息部分 -->
      <h3>订单信息：</h3>
      <div class="order-info">
         <p>
            {{ orders.business.businessName }}
            <i class="fa fa-caret-down" @click="detailetShow"></i>
         </p>
         <p>&#165;{{ orders.orderTotal }}</p>
      </div>

      <ul class="order-detailet" v-show="isShowDetailet">
         <li>
            <img :src="orders.business.businessImg" alt="商家图片" />
         </li>
         <!-- 订单明细部分 -->
         <li v-for="(item, index) in orders.odList" :key="index">
            <p>{{ item.food.foodName }} x {{ item.quantity }}</p>
            <p>&#165; {{ item.food.foodPrice * item.quantity }}</p>
         </li>
         <li>
            <p>配送费</p>
            <p>&#165; {{ orders.business.deliveryPrice }}</p>
         </li>
      </ul>

      <!-- 支付方式部分 -->
      <ul class="payment-type">
         <li>
            <img src="../assets/alipay.png" />
            <i class="fa fa-check-circle"></i>
         </li>
         <li>
            <img src="../assets/wechat.png" />
         </li>
      </ul>
      <div class="payment-button" @click="payUpdate">
         <button>确认支付</button>
      </div>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
   name: "Payment",
   data() {
      return {
         //订单的编号
         orderId: this.$route.query.orderId,
         //订单对象
         orders: {
            //商家对象
            business: {},
         },
         //是否显示 订单明细的boolean变量
         isShowDetailet: false,
         status: 1,
      };
   },
   created() {
      console.log("订单号:-->", this.orderId);
      //请求服务器API，获取订单与商家的信息  orders/getById/orderId
      this.$axios
         .get("http://47.101.196.82:8988/elm/orders/pageNew/" + this.orderId)
         .then((response) => {
            //console.log(response.data)
            this.orders = response.data.map.order;
            console.log("this.orders--->", this.orders);
            
         })
         .catch((error) => {
            console.log(error);
         });
   },
   mounted() {
      //在挂载的生命周期方法中，显示浏览器不能返回上一页
      //项目一旦提交至 支付页面， 就不能再返回订单组件页面
      history.pushState(null, null, document.URL);
      //popstate 事件能够监控history对象的变化
      window.onpopstate = () => {
         this.$router.push({ path: "/index" });
      };
   },
   destroyed() {
      window.onpopstate = null;
   },
   methods: {
      detailetShow() {
         this.isShowDetailet = !this.isShowDetailet;
      },
      //支付--修改订单状态
      payUpdate() {
         this.$axios
            .post(  
               "http://47.101.196.82:8988/elm/orders/updateStatus",
               this.$qs.stringify({
                  orderId: this.orderId,
                  orderState: this.status,
               })
            )
            .then((response) => {
               let ans = response.data.map.count;
               if (ans > 0) {
                  this.$message({
                     type: "success",
                     message: "支付成功",
                  });
                  this.$router.push("/orderList");
               } else {
                  this.$message({
                     type: "error",
                     message: "支付失败！",
                  });
               }
            })
            .catch((error) => {
               console.log(error);
            });
      },
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

/****************** 订单信息部分 ******************/
.wrapper h3 {
   margin-top: 12vw;
   box-sizing: border-box;
   padding: 4vw 4vw 0;

   font-size: 4vw;
   font-weight: 300;
   color: #999;
}

.wrapper .order-info {
   box-sizing: border-box;
   padding: 4vw;
   font-size: 4vw;
   color: #666;

   display: flex;
   justify-content: space-between;
   align-items: center;
}

.wrapper .order-info p:last-child {
   color: orangered;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailet {
   width: 100%;
}

.wrapper .order-detailet li {
   width: 100%;
   box-sizing: border-box;
   padding: 1vw 4vw;

   display: flex;
   justify-content: space-between;
   align-items: center;
}

.wrapper .order-detailet li img {
   width: 100px;
   height: 100px;
   border-radius: 5px;
}

.wrapper .order-detailet li p {
   font-size: 3vw;
   color: #666;
}

/****************** 支付方式部分 ******************/
.wrapper .payment-type {
   width: 100%;
}

.wrapper .payment-type li {
   width: 100%;
   box-sizing: border-box;
   padding: 4vw;

   display: flex;
   justify-content: space-between;
   align-items: center;
}

.wrapper .payment-type li img {
   width: 33vw;
   height: 8.9vw;
}

.wrapper .payment-type li .fa-check-circle {
   font-size: 5vw;
   color: #38ca73;
}

.wrapper .payment-button {
   width: 100%;
   box-sizing: border-box;
   padding: 4vw;
}

.wrapper .payment-button button {
   width: 100%;
   height: 10vw;
   border: none;
   /*去掉外轮廓线*/
   outline: none;
   border-radius: 4px;
   background-color: #38ca73;
   color: #fff;
}
</style>
