<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <ComeBack></ComeBack>
         <p>商家列表</p>
      </header>

      <ul class="business">
         <!--TODO: 循环迭代 商家列表部分 Begin -->
         <li
            v-for="item in businessList"
            :key="item.businessId"
            @click="toBusinessInfo(item.businessId)"
         >
            <div class="business-img">
               <img :src="item.businessImg" />
               <div class="business-img-quantity" v-show="item.quantity > 0">
                  {{ item.quantity }}
               </div>
            </div>
            <div class="business-info">
               <h3>{{ item.businessName }}</h3>
               <p>
                  &#165; {{ item.starPrice }} 起送 | &#165;
                  {{ item.deliveryPrice }} 配送
               </p>
               <p>{{ item.businessExplain }}</p>
            </div>
         </li>
         <!--TODO: 循环迭代 商家列表部分 End -->
      </ul>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import ComeBack from "../components/ComeBack.vue";

export default {
   name: "BusinessList",
   data() {
      return {
         //参数的值，从路由 http://localhost:8080/#/businessList?categoryId=10
         categoryId: this.$route.query.categoryId,
         //商家的数组信息，从服务器API调用获得该分类下的所有商家信息
         businessList: [],
         user: {},
      };
   },
   created() {
      this.user = this.$getSessionStorage("userinfo");
      //生命周期的方法：
      this.$axios
         .get(
            "http://4j89034j54.zicp.vip:8988/elm/business/categoryBusiness/" +
               this.categoryId
         )
         .then((response) => {
            if (response.data.code == 1) {
               this.businessList = response.data.map.businessList;
            } else if (response.data.code == 50004) {
               alert(response.data.message);
            }

            //调用listCart获取购物车数据的方法，加载商品已经购买的餐品数量（显示为角标）
            if (this.user != null) {
               this.listCart();
            }
         })
         .catch((error) => {
            console.log(error);
         });
   },
   components: {
      Footer,
      ComeBack,
   },
   methods: {
      listCart() {
         //读取购物车中的数据
         this.$axios
            .get("http://4j89034j54.zicp.vip:8988/elm/cart/listCart", {
               params: {
                  userId: this.user.userId,
                  // businessId: this.business.businessId,   //商家的id在businessList页面不存在，不传递参数
               },
            })
            .then((response) => {
               let cartArr = response.data.map.listCart;
               console.log("商家列表的购物车数组:", cartArr);
               for (let i in this.businessList) {
                  this.businessList[i].quantity = 0; //给商家添加属性，该商家已购买的餐品数量
                  for (let j in cartArr) {
                     if (
                        cartArr[j].businessId == this.businessList[i].businessId
                     ) {
                        //购物车中有该商家的餐品信息。
                        this.businessList[i].quantity += cartArr[j].quantity;
                     }
                  }
               }
               this.businessList.sort();
            })
            .catch((error) => {
               console.log(error);
            });
      },
      toBusinessInfo(businessId) {
         this.$router.push({
            path: "/caidan",
            query: { businessId: businessId },
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

/****************** 商家列表部分 ******************/
.wrapper .business {
   width: 100%;
   margin-top: 12vw;
   margin-bottom: 14vw;
}

.wrapper .business li {
   width: 100%;
   box-sizing: border-box;
   padding: 2.5vw;
   border-bottom: solid 1px #ddd;
   user-select: none;
   cursor: pointer;

   display: flex;
   align-items: center;
}

.wrapper .business li .business-img {
   /*这里设置为相当定位，成为business-img-quantity元素的父元素*/
   position: relative;
}

.wrapper .business li .business-img img {
   width: 20vw;
   height: 20vw;
}

.wrapper .business li .business-img .business-img-quantity {
   width: 5vw;
   height: 5vw;
   background-color: red;
   color: #fff;
   font-size: 3.6vw;
   border-radius: 2.5vw;

   display: flex;
   justify-content: center;
   align-items: center;

   /*设置成绝对定位，不占文档流空间*/
   position: absolute;
   right: -1.5vw;
   top: -1.5vw;
}

.wrapper .business li .business-info {
   margin-left: 3vw;
}

.wrapper .business li .business-info h3 {
   font-size: 3.8vw;
   color: #555;
}

.wrapper .business li .business-info p {
   font-size: 3vw;
   color: #888;
   margin-top: 2vw;
}
</style>
