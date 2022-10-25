0<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <div id="itemLogo" @click="toBack">
            <i class="el-icon-back"></i>
         </div>
         <p>确认订单</p>
      </header>

      <!-- 订单信息部分 -->
      <div class="order-info">
         <h5>订单配送至：</h5>
         <div class="order-info-address" @click="toUserAddress">
            <p>
               {{
                  deliveryAddress != null
                     ? deliveryAddress.address
                     : "请选择配送的地址"
               }}
            </p>
            <i class="fa fa-angle-right"></i>
         </div>
         <p v-if="deliveryAddress != null">
            {{ deliveryAddress.contactName }}
            {{ deliveryAddress.contactSex | sexFmt }}
            {{ deliveryAddress.contactTel }}
         </p>
      </div>

      <h3>{{ business.businessName }}</h3>

      <!-- 订单明细部分 -->
      <ul class="order-detailed">
         <li v-for="(item, index) in cartArr" :key="index">
            <div class="order-detailed-left">
               <img :src="item.food.foodImage" />
               <p>{{ item.food.foodName }} x {{ item.quantity }}</p>
            </div>
            <p>&#165; {{ item.food.foodPrice * item.quantity }}</p>
         </li>
      </ul>
      <div class="order-deliveryfee">
         <p>配送费</p>
         <p>&#165; {{ business.deliveryPrice }}</p>
      </div>

      <!-- 合计部分 -->
      <div class="total">
         <div class="total-left">
            总价： &#165; {{ parseFloat(totalPrice).toFixed(2) }}
         </div>
         <div class="total-right" @click="toPayment">去支付</div>
      </div>
   </div>
</template>

<script>
export default {
   name: "Orders",
   data() {
      return {
         //配送地址的对象
         deliveryAddress: {},
         //声明用户对象
         user: {},
         //商家对象
         business: {},
         //购物车信息对象
         cartArr: [],
         //商家编号:从路由参数中获取数据
         businessId: this.$route.query.businessId,
      };
   },

   created() {
      this.user = this.$getSessionStorage("userinfo");
      //从LocalStorage中读取默认的配送地址
      this.deliveryAddress = this.$getLocalStorage(this.user.userId);
      //请求服务端API: 根据商家编号businessId查询当前商家信息：business/getBusinessId/{businessId}
      this.$axios
         .get(
            "http://47.101.196.82:8988/elm/business/searchBusinessFood/" +
               this.businessId
         )
         .then((response) => {
            this.business = response.data.map.business;
            console.log(this.business);
         })
         .catch((error) => {
            console.log(error);
         });

      console.log("this.user.userId:--->", this.user.userId);
      console.log("this.businessId:--->", this.businessId);
      //查询当前用户 购物车信息
      this.$axios
         .get("http://47.101.196.82:8988/elm/cart/listCart", {
            params: {
               userId: this.user.userId,
               businessId: this.businessId,
            },
         })
         .then((response) => {
            this.cartArr = response.data.map.listCart;
            console.log("订单购物车--->", this.cartArr);
         })
         .catch((error) => {
            console.log(error);
         });
   },
   computed: {
      //计算属性，求购物车所有餐品的总价
      totalPrice() {
         let s = 0;
         for (let cartItem of this.cartArr) {
            s += cartItem.food.foodPrice * cartItem.quantity;
         }

         s += this.business.deliveryPrice; //餐品的累加总价 + 配送费
         return s;
      },
   },
   methods: {
      //返回上一个页面
      toBack() {
         this.$router.go(-1);
      },

      toUserAddress() {
         this.$router.push({
            path: "/userAddress",
            query: { businessId: this.businessId },
         });
      },
      toPayment() {
         if (this.deliveryAddress == null) {
            this.$message({
               type: "warning",
               message: "请选择配送的地址",
            });
            return;
         }

         //生成订单
         this.$axios
            .post(
               "http://47.101.196.82:8988/elm/orders/create",
               this.$qs.stringify({
                  userId: this.user.userId,
                  businessId: this.businessId,
                  orderDate: "",
                  orderTotal: this.totalPrice,
                  daId: this.deliveryAddress.daId,
               })
            )
            .then((response) => {
               console.log(response.data.map);
               let orderId = response.data.map.orderId;
               this.$router.push({
                  path: "/Payment",
                  query: { orderId: orderId },
               });
            })
            .catch((error) => {
               console.log(error);
            });
      },
   },
};
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
   width: 100%;
   height: 100%;
}

/****************** 返回部分 ******************/
#itemLogo {
   z-index: 999;
   position: absolute;
   left: 3%;
   top: -4px;
   font-size: 40px;
   cursor: pointer;
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
.wrapper .order-info {
   /*注意这里，不设置高，靠内容撑开。因为地址有可能折行*/
   width: 100%;
   margin-top: 12vw;
   background-color: #ecf5ff;
   box-sizing: border-box;
   padding: 2vw;
   color: #0066cc;
}

.wrapper .order-info h5 {
   font-size: 3vw;
   font-weight: 300;
}

.wrapper .order-info .order-info-address {
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;

   font-weight: 700;
   user-select: none;
   cursor: pointer;
   margin: 1vw 0;
}

.wrapper .order-info .order-info-address p {
   width: 90%;
   font-size: 5vw;
}

.wrapper .order-info .order-info-address i {
   font-size: 6vw;
}

.wrapper .order-info p {
   font-size: 3vw;
}

.wrapper h3 {
   box-sizing: border-box;
   padding: 3vw;
   font-size: 4vw;
   color: #66717d;
   border-bottom: solid 1px #ddd;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailed {
   width: 100%;
}

.wrapper .order-detailed li {
   width: 100%;
   height: 16vw;
   box-sizing: border-box;
   padding: 10vw 3vw;
   color: #666;

   display: flex;
   justify-content: space-between;
   align-items: center;
}

.wrapper .order-detailed li .order-detailed-left {
   display: flex;
   align-items: center;
}

.wrapper .order-detailed li .order-detailed-left img {
   width: 16vw;
   height: 16vw;
}

.wrapper .order-detailed li .order-detailed-left p {
   font-size: 3.5vw;
   margin-left: 3vw;
   color: #191919;
}

.wrapper .order-detailed li p {
   font-size: 3.5vw;
   color: #ff0033;
   font-weight: 700;
}

.wrapper .order-deliveryfee {
   width: 100%;
   height: 16vw;
   box-sizing: border-box;
   padding: 3vw;
   color: #666;
   display: flex;
   justify-content: space-between;
   align-items: center;
   font-size: 3.5vw;
}

/****************** 订单合计部分 ******************/
.wrapper .total {
   width: 100%;
   height: 14vw;

   position: fixed;
   left: 0;
   bottom: 0;

   display: flex;
}

.wrapper .total .total-left {
   flex: 2;
   background-color: #66717d;
   color: #fff;
   font-size: 4.5vw;
   font-weight: 700;
   user-select: none;

   display: flex;
   justify-content: center;
   align-items: center;
}

.wrapper .total .total-right {
   flex: 1;
   background-color: #38ca73;
   color: #fff;
   font-size: 4.5vw;
   font-weight: 700;
   user-select: none;
   cursor: pointer;

   display: flex;
   justify-content: center;
   align-items: center;
}
</style>
