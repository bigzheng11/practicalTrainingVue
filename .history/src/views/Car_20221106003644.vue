<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <p>购物车</p>
      </header>
      <!-- 主要显示部分 -->
      <div class="main">
         <div
            id="Ui"
            style="margin: 60px 0px -40px 10px"
            v-for="(item, indexOut) in listDemo"
            :key="item.businessId"
         >
            <el-card
               class="box-card"
               style="width: 95vw; border-radius: 5px; margin-bottom: 8px"
            >
               <!-- 卡片头部 -->
               <div slot="header" class="clearfix">
                  <span>
                     <!-- 商家选择框 -->
                     <span>
                        <el-checkbox
                           @change="checkedAllFun(item.businessId)"
                           style="margin-right: 6px"
                        ></el-checkbox>
                     </span>
                     <!-- 商家名 -->
                     {{ item.businessName }}
                  </span>

                  <!-- 警告提示 -->
                  <div
                     class="warning"
                     style="
                        float: right;
                        padding: 3px 0;
                        color: red;
                        cursor: pointer;
                     "
                  ></div>
               </div>

               <!-- 卡片main 食品信息 -->
               <div
                  class="text item"
                  style="margin-bottom: -12px"
                  v-for="(item2, indexIn) in item.food"
                  :key="item2.cartId"
               >
                  <!-- 食品图片 -->
                  <img
                     :src="item2.foodImg"
                     alt=""
                     style="width: 60px; height: 60px; border-radius: 20px"
                  />

                  <!-- 食品名字和数量 -->
                  <div
                     style="
                        display: inline-block;
                        width: 240px;
                        height: 60px;
                        position: relative;
                        top: -20px;
                     "
                  >
                     <!-- 食品名 -->
                     <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ item2.foodName }}</div>
                     <!-- 食品数量加+减- -->
                     <div
                        style="
                           position: absolute;
                           right: -16px;
                           top: 20px;
                           display: flex;
                        "
                     >
                        <span
                           @click="
                              minus(
                                 item.businessId,
                                 item2.foodId,
                                 item2.quantity,
                                 indexOut,
                                 indexIn
                              )
                           "
                        >
                           <i
                              class="el-icon-remove-outline"
                              v-show="item2.quantity != 0"
                           ></i>
                        </span>

                        <p>
                           <span style="margin: 0px 5px 0px 5px">{{
                              item2.quantity
                           }}</span>
                        </p>
                        <span
                           @click="
                              add(
                                 item.businessId,
                                 item2.foodId,
                                 item2.quantity,
                                 indexOut,
                                 indexIn
                              )
                           "
                        >
                           <i class="el-icon-circle-plus-outline"></i>
                        </span>
                     </div>
                  </div>
               </div>
            </el-card>
         </div>
      </div>

      <!-- 底部全选框 -->
      <div class="jiesuanAll">
         <div style="position: relative; left: 60px">
            <span id="hejiPrice"
               >合计{{ allPrice }}件商品&nbsp;&nbsp;&nbsp;</span
            >
            <el-button type="primary" round @click="toOrders"
               >结算外卖</el-button
            >
         </div>
      </div>
      <div style="height: 160px; width: 99vw"></div>
   </div>
</template>

<script>
export default {
   data() {
      return {
         multipleSelection: [],
         num: 1,
         user: {},
         allList: [],
         listDemo: [],
         businessId: 0,
         allPrice: 0,
         temp: 0,
      };
   },

   methods: {
      checkedAllFun(businessId) {
         this.businessId = businessId;
         this.allPrice = 0;
         if (this.temp != businessId) {
            for (let i = 0; i < this.listDemo.length; i++) {
               if (this.listDemo[i].businessId == businessId) {
                  for (let j = 0; j < this.listDemo[i].food.length; j++) {
                     this.allPrice += this.listDemo[i].food[j].quantity;
                  }
               }
            }
         }
         this.temp == businessId;
      },

      //数量 -- 方法
      minus(businessIdArgs, foodIdArgs, indexOutArgs, indexInArgs) {
         this.$axios
            .put(
               "http://4j89034j54.zicp.vip:8988/elm/cart/updateCart",
               this.$qs.stringify({
                  businessId: businessIdArgs,
                  foodId: foodIdArgs,
                  userId: this.user.userId,
                  quantity:
                     this.listDemo[indexOutArgs].food[indexInArgs].quantity - 1,
                  //当前quantity + num需要添加或删减的数量。
               })
            )
            .then((response) => {
               if (response.data.code == 1) {
                  this.listDemo[indexOutArgs].food[indexInArgs].quantity -= 1;
                  //更新数量成功，食物的数组中数量同步数据库
               } else {
                  alert(response.data.message);
               }
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //数量++ 方法
      add(businessIdArgs, foodIdArgs, indexOutArgs, indexInArgs) {
         this.$axios
            .put(
               "http://4j89034j54.zicp.vip:8988/elm/cart/updateCart",
               this.$qs.stringify({
                  businessId: businessIdArgs,
                  foodId: foodIdArgs,
                  userId: this.user.userId,
                  quantity:
                     this.listDemo[indexOutArgs].food[indexInArgs].quantity + 1, //当前quantity + num需要添加或删减的数量。
               })
            )
            .then((response) => {
               if (response.data.code == 1) {
                  this.listDemo[indexOutArgs].food[indexInArgs].quantity += 1; //更新数量成功，食物的数组中数量同步数据库
               } else {
                  alert(response.data.message);
               }
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //跳转方法
      toOrders() {
         this.$router.push({
            path: "/orders",
            query: { businessId: this.businessId },
         });
      },
   },

   created() {
      //获取信息用户信息
      this.user = this.$getSessionStorage("userinfo");

      //获取用户userId,所有购物车
      this.$axios
         .get(
            "http://4j89034j54.zicp.vip:8988/elm/cart/getUserId/" +
               this.user.userId
         )
         .then((response) => {
            this.allList = response.data.map.getUserId;
            let lastList = [];
            let checkBusiness = [];
            for (let i = 0; i < this.allList.length; i++) {
               //新商店
               if (checkBusiness.indexOf(this.allList[i].businessId) === -1) {
                  checkBusiness.push(this.allList[i].businessId);
                  let item = {};
                  item.businessId = this.allList[i].businessId;
                  item.businessName = this.allList[i].business.businessName;
                  item.food = [];
                  let foodDetail = {};
                  foodDetail.quantity = this.allList[i].quantity;
                  foodDetail.foodId = this.allList[i].foodId;

                  foodDetail.foodName = this.allList[i].food.foodName;
                  foodDetail.foodImg = this.allList[i].food.foodImage;

                  foodDetail.cartId = this.allList[i].cartId;
                  item.food.push(foodDetail);
                  lastList.push(item);
               } else {
                  //老产品,放进原先的商店中
                  for (let j = 0; j < lastList.length; j++) {
                     if (
                        this.allList[i].businessId === lastList[j].businessId
                     ) {
                        let foodDetail = {};
                        foodDetail.quantity = this.allList[i].quantity;
                        foodDetail.foodId = this.allList[i].foodId;
                        foodDetail.cartId = this.allList[i].cartId;
                        foodDetail.foodName = this.allList[i].food.foodName;
                        foodDetail.foodImg = this.allList[i].food.foodImage;
                        lastList[j].food.push(foodDetail);
                     }
                  }
               }
            }
            //最终结果
            this.listDemo = lastList;
         })
         .catch((error) => {
            console.log(error);
         });
   },

   mounted() {
      if (this.$store.state.isNight) {
         setTimeout(() => {
            console.log("启用夜间模式");
            let comment = document.querySelector(".main");
            let header = document.querySelector("header");
            let jiesuanAll = document.querySelector(".jiesuanAll");

            jiesuanAll.style.backgroundColor = "black";
            header.style.backgroundColor = "grey";
            comment.style.opacity = 0.5;
         }, 400);
      }
   },
};
</script>

<style scoped>
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

/* 底部结算 */
.jiesuanAll {
   background-color: #ffffff;
   z-index: 999;
   width: 99vw;
   height: 10vh;
   position: fixed;
   bottom: 55px;
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-content: center;
   align-items: center;
   box-shadow: -10px -12px 5px -10px rgba(0, 0, 0, 0.2),
      0 0 4px 0 rgba(0, 0, 0, 0.1);
   border-radius: 15px;
}
</style>
