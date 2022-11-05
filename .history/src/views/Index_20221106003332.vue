<!-- >>>>> -->
<template>
   <div class="wrapper">
      <!-- header部分 -->
      <div class="header">
         <div class="icon-location-box">
            <div class="icon-location"></div>
         </div>
         <div class="location-text">
            <i class="el-icon-location-outline"></i>
            上海浦东蓝村路<i class="fa fa-caret-down"></i>
         </div>

         <!-- 日夜滑块 -->
         <span style="margin-left: 50px">
            <el-switch
               v-model="value1"
               active-text="夜间"
               inactive-text="白天"
               @change="handleStatusChange($event)"
            >
            </el-switch>
         </span>
      </div>

      <!-- search部分 -->
      <div class="search">
         <!-- 当滚动条超过上面的定位块时，search-fixed-top块变成固定在顶部。 -->
         <div class="search-fixed-top" ref="fixedBox">
            <!-- 搜索框部分中间的白框 -->
            <div class="search-box" @click="toSelectPage">
               <i class="fa fa-search"></i>搜索饿了么商家、商品名称
            </div>
         </div>
      </div>

      <!-- 食品分类部分 -->
      <ul class="foodtype" id="categoryElement">
         <li
            v-for="item in categoryList"
            :key="item.categoryId"
            @click="toBusinessList(item.categoryId)"
         >
            <img :src="item.categoryCover" />
            <p>{{ item.categoryName }}</p>
         </li>
      </ul>

      <!-- 横幅广告部分（注意：此处有背景图片） -->
      <div class="banner">
         <h3>品质套餐</h3>
         <p>搭配齐全吃得好</p>
         <a>立即抢购 &gt;</a>
      </div>

      <!-- 超级会员部分 -->
      <div class="supermember">
         <div class="left">
            <img src="../assets/super_member.png" />
            <h3>超级会员</h3>
            <p>&#8226; 每月享超值权益</p>
         </div>
         <div class="right">立即开通 &gt;</div>
      </div>

      <!-- 推荐商家部分 -->
      <div class="recommend">
         <div class="recommend-line"></div>
         <p>推荐商家</p>
         <div class="recommend-line"></div>
      </div>

      <!-- 推荐方式部分 -->
      <ul class="recommendtype">
         <li @click="defaultSort">综合排序</li>
         <li @click="distanceSort">距离最近</li>

         <li @click="starPriceSort">起送费低</li>
      </ul>

      <!-- 推荐商家列表部分 -->
      <ul
         v-for="(item, index) in businessListTemp"
         :key="index"
         @click="toBusinessInfo(item.businessId)"
      >
         <div id="card">
            <div id="detail">
               <h4>{{ item.businessName }}</h4>
               <div id="Explain">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {{ item.businessExplain }}
               </div>
               <div id="address">{{ item.businessAddress }}</div>
               <div id="price">
                  起送价:${{ item.deliveryPrice }},配送价:${{ item.starPrice }}
               </div>
            </div>
            <img
               :src="item.businessImg"
               class="businessImg"
               style="width: 150px; height: 150px"
            />
         </div>
      </ul>
   </div>
</template>

<script>
export default {
   name: "Index",
   data() {
      return {
         categoryList: [],
         businessList: [],
         businessListTemp: [],
         //日夜滑块
         value1: this.$store.state.isNight,
      };
   },

   created() {
      //显示加载页面
      this.$showLoading();

      // ----------------------↓↓axios请求↓↓---------------------------
      //商家分类请求
      this.$axios
         .get("http://47.101.196.82:8988/elm/category/search")
         .then((response) => {
            this.categoryList = response.data.map.list;

            //隐藏加载页面
            this.$hideLoading();
         })
         .catch((error) => {
            console.log(error);
         });

      //获取所有商家信息
      this.$axios
         .get("http://47.101.196.82:8988/elm/business/search")
         .then((response) => {
            this.businessList = response.data.map.businessList;
            this.businessListTemp = JSON.parse(
               JSON.stringify(this.businessList)
            );

            //隐藏加载页面
            this.$hideLoading();
         })
         .catch((error) => {
            console.log(error);
         });
      // ----------------------↑↑axios请求↑↑---------------------------
   },

   mounted() {
      //为true,标识启用夜间模式
      if (this.$store.state.isNight) {
         console.log("启用夜间模式");
      }

      document.onscroll = () => {
         //获取滚动条位置
         let s1 = document.documentElement.scrollTop;
         let s2 = document.body.scrollTop;
         let scroll = s1 == 0 ? s2 : s1;
         //获取视口宽度
         let width = document.documentElement.clientWidth;
         //获取顶部固定块
         let search = this.$refs.fixedBox;
         //判断滚动条超过视口宽度的12%时，搜索块变固定定位
         if (scroll > width * 0.12) {
            search.style.position = "fixed";
            search.style.left = "0";
            search.style.top = "0";
         } else {
            search.style.position = "static";
         }
      };
   },

   methods: {
      // ----------------------↓↓夜间模式方法↓↓---------------------------
      //夜间模式修改样式
      nightMethod() {
         document.querySelector("body").style.backgroundColor = "#353b48";
         document.querySelector(".search-fixed-top").style.backgroundColor =
            "grey";
         document.querySelector(".header").style.backgroundColor = "grey";
         document.querySelector(".banner").style.opacity = "0.6";
         document.querySelector(".supermember").style.opacity = "0.6";
         document.querySelector("body").style.color = "white";
         document.querySelector("#categoryElement").style.color = "white";
      },

      //滑块事件,修改Vuex内部的isNight
      handleStatusChange(a) {
         // 修改Vuex
         this.$store.dispatch("changeNightActions", a);
         if (a) {
            //夜间模式启动
            this.nightMethod();
         } else {
            //点击白天模式,刷新页面
            this.$router.go(0);
         }
      },
      // ----------------------↑↑夜间模式↑↑---------------------------

      // ----------------------↓↓跳转方法↓↓---------------------------
      //推荐商家部分-点击跳转到对应商家
      toBusinessInfo(businessId) {
         this.$router.push({
            path: "/caidan",
            query: { businessId: businessId },
         });
      },

      //跳转搜索页面
      toSelectPage() {
         this.$router.push({
            path: "/SelectPage",
         });
      },

      //点击分类信息图片，跳转至 商家列表组件页面
      toBusinessList(categoryId) {
         this.$router.push({
            path: "/businessList",
            query: { categoryId: categoryId },
         });
      },
      // ----------------------↑↑跳转方法↑↑---------------------------

      // ----------------------↓↓排序方法↓↓---------------------------
      //距离最近排序
      distanceSort() {
         this.businessListTemp.sort(this.compare("deliveryPrice"));
      },

      //起送费排序
      starPriceSort() {
         this.businessListTemp.sort(this.compare("starPrice"));
      },

      //默认排序
      defaultSort() {
         this.businessListTemp = JSON.parse(JSON.stringify(this.businessList));
      },

      // 对数组的具体排序
      compare(property) {
         return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
         };
      },
      // ----------------------↑↑排序方法↑↑---------------------------
   },

   destroyed() {
      //当切换到其他组件时，就不需要document滚动条事件，所以将此事件去掉
      document.onscroll = null;
   },
};
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
   width: 100%;
   height: 100%;
}

/****************** header ******************/
.wrapper .header {
   width: 100%;
   height: 10vw;
   background-color: #1561db;

   display: flex;
   align-items: center;
}

.wrapper .header .icon-location-box {
   width: 3.5vw;
   height: 3.5vw;
   margin: 0 1vw 0 3vw;
}

.wrapper .header .location-text {
   font-size: 4.5vw;
   font-weight: 700;
   color: #fff;
}

.wrapper .header .location-text .fa-caret-down {
   margin-left: 1vw;
}

/****************** search ******************/
.wrapper .search {
   width: 100%;
   height: 15vw;
   margin-top: -2vw;
}

.wrapper .search .search-fixed-top {
   width: 100%;
   height: 15vw;
   background-color: #1561db;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 0px 0px 20px 20px;
}

.wrapper .search .search-fixed-top .search-box {
   width: 90%;
   height: 9vw;
   background-color: #fff;
   border-radius: 6px;

   display: flex;
   justify-content: center;
   align-items: center;

   font-size: 3.5vw;
   color: #aeaeae;
   font-family: "宋体";
   /*此样式是让文本选中状态无效*/
   /*user-select: none;*/
}

.wrapper .search .search-fixed-top .search-box .fa-search {
   margin-right: 1vw;
}

/****************** 点餐分类部分 ******************/
.wrapper .foodtype {
   width: 100%;
   height: 48vw;

   display: flex;
   flex-wrap: wrap;
   justify-content: space-around;
   /*要使用align-content。10个子元素将自动换行为两行，而且两行作为一个整体垂直居中*/
   align-content: center;
   /* background-color: black; */
}

.wrapper .foodtype li {
   /*一共10个子元素，通过计算，子元素宽度在16.7 ~ 20 之间，才能保证换两行*/
   width: 18vw;
   height: 20vw;

   display: flex;
   /*弹性盒子主轴方向设为column，然后仍然是垂直水平方向居中*/
   flex-direction: column;
   justify-content: center;
   align-items: center;

   user-select: none;
   cursor: pointer;
}

.wrapper .foodtype li img {
   width: 12vw;
   /*视频讲解时高度设置为12vw，实际上设置为10.3vw更佳*/
   height: 10.3vw;
}

.wrapper .foodtype li p {
   font-size: 3.2vw;
   color: #666;
}

/****************** 横幅广告部分 ******************/
.wrapper .banner {
   /**
   * 设置容器宽度95%，然后水平居中，这样两边留白; 
   * 这里不能用padding，因为背景图片也会覆盖padding
   */
   width: 95%;
   margin: 0 auto;
   height: 29vw;
   /*此三个样式组合，可以保证背景图片充满整个容器*/
   background-image: url(../assets/index_banner.png);
   background-repeat: no-repeat;
   background-size: cover;

   box-sizing: border-box;
   padding: 2vw 6vw;
}

.wrapper .banner h3 {
   font-size: 4.2vw;
   margin-bottom: 1.2vw;
}

.wrapper .banner p {
   font-size: 3.4vw;
   color: #666;
   margin-bottom: 2.4vw;
}

.wrapper .banner a {
   font-size: 3vw;
   color: #c79060;
   font-weight: 700;
}

/****************** 超级会员部分 ******************/
.wrapper .supermember {
   /*这里也设置容器宽度95%，不能用padding，因为背景色也会充满padding*/
   width: 95%;
   margin: 0 auto;
   height: 11.5vw;
   background-color: #feedc1;
   margin-top: 1.3vw;
   border-radius: 2px;
   color: #644f1b;

   display: flex;
   justify-content: space-between;
   align-items: center;
}

.wrapper .supermember .left {
   display: flex;
   align-items: center;
   margin-left: 4vw;
   user-select: none;
}

.wrapper .supermember .left img {
   width: 6vw;
   height: 6vw;
   margin-right: 2vw;
}

.wrapper .supermember .left h3 {
   font-size: 4vw;
   margin-right: 2vw;
}

.wrapper .supermember .left p {
   font-size: 3vw;
}

.wrapper .supermember .right {
   font-size: 3vw;
   margin-right: 4vw;
   cursor: pointer;
}

/****************** 推荐商家部分 ******************/
.wrapper .recommend {
   /* background-color: grey; */

   width: 100%;
   height: 14vw;
   display: flex;
   justify-content: center;
   align-items: center;
}

.wrapper .recommend .recommend-line {
   width: 6vw;
   height: 0.2vw;
   background-color: #888;
}

.wrapper .recommend p {
   font-size: 4vw;
   margin: 0 4vw;
}

/****************** 推荐方式部分 ******************/
.wrapper .recommendtype {
   width: 100%;
   height: 5vw;
   margin-bottom: 5vw;

   display: flex;
   justify-content: space-around;
   align-items: center;
}

.wrapper .recommendtype li {
   font-size: 3.5vw;
   color: #555;
}

/****************** 推荐商家列表部分 ******************/
.wrapper .business {
   width: 100%;
   margin-bottom: 14vw;
}

.wrapper .business li {
   width: 100%;
   box-sizing: border-box;
   padding: 2.5vw;
   user-select: none;
   border-bottom: solid 1px #ddd;

   display: flex;
}

.wrapper .business li img {
   width: 18vw;
   height: 18vw;
}

.wrapper .business li .business-info {
   width: 100%;
   box-sizing: border-box;
   padding-left: 3vw;
}

.wrapper .business li .business-info .business-info-h {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2vw;
}

.wrapper .business li .business-info .business-info-h h3 {
   font-size: 4vw;
   color: #333;
}

.wrapper .business li .business-info .business-info-h .business-info-like {
   width: 1.6vw;
   height: 3.4vw;
   background-color: #666;
   color: #fff;
   font-size: 4vw;
   margin-right: 4vw;

   display: flex;
   justify-content: center;
   align-items: center;
}

.wrapper .business li .business-info .business-info-star {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2vw;
   font-size: 3.1vw;
}

.wrapper
   .business
   li
   .business-info
   .business-info-star
   .business-info-star-left {
   display: flex;
   align-items: center;
}

.wrapper
   .business
   li
   .business-info
   .business-info-star
   .business-info-star-left
   .fa-star {
   color: #fec80e;
   margin-right: 0.5vw;
}

.wrapper
   .business
   li
   .business-info
   .business-info-star
   .business-info-star-left
   p {
   color: #666;
   margin-left: 1vw;
}

.wrapper
   .business
   li
   .business-info
   .business-info-star
   .business-info-star-right {
   background-color: #ff8800;
   color: #fff;
   font-size: 2.4vw;
   border-radius: 2px;
   padding: 0 0.6vw;
}

.wrapper .business li .business-info .business-info-delivery {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2vw;

   color: #666;
   font-size: 3.1vw;
}

.wrapper .business li .business-info .business-info-explain {
   display: flex;
   align-items: center;
   margin-bottom: 3vw;
}

.wrapper .business li .business-info .business-info-explain div {
   border: solid 1px #ddd;
   font-size: 2.8vw;
   color: #666;
   border-radius: 3px;
   padding: 0 0.1vw;
}

.wrapper .business li .business-info .business-info-promotion {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 1.8vw;
}

.wrapper
   .business
   li
   .business-info
   .business-info-promotion
   .business-info-promotion-left {
   display: flex;
   align-items: center;
}

.wrapper
   .business
   li
   .business-info
   .business-info-promotion
   .business-info-promotion-left
   .business-info-promotion-left-incon {
   width: 4vw;
   height: 4vw;
   background-color: #ff8800;
   border-radius: 3px;
   font-size: 3vw;
   color: #fff;
   display: flex;
   justify-content: center;
   align-items: center;
}

.wrapper
   .business
   li
   .business-info
   .business-info-promotion
   .business-info-promotion-left
   p {
   color: #666;
   font-size: 3vw;
   margin-left: 2vw;
}

.wrapper
   .business
   li
   .business-info
   .business-info-promotion
   .business-info-promotion-right {
   display: flex;
   align-items: center;
   font-size: 2.5vw;
   color: #999;
}

.wrapper
   .business
   li
   .business-info
   .business-info-promotion
   .business-info-promotion-right
   p {
   margin-right: 2vw;
}

.wrapper .button-search button {
   width: 100%;
   height: 10vw;
   font-size: 3.8vw;
   font-weight: 700;
   color: #fff;
   background-color: #ffd700;
   border-radius: 50px;
   border: none;
   outline: none;
}

/* -----------------------------推荐商家部分--------------------- */
#card {
   width: 335px;
   border-radius: 30px;
   height: 200px;
   /* background-color: white; */
   box-shadow: 7px 6px 5px #888888;
   margin: 0px 0px 15px 25px;
   position: relative;
   z-index: -999;
}
.businessImg {
   position: relative;
   border-radius: 30px;
   left: -14px;
   top: 20px;
   box-shadow: 3px 3px 2px #888888;
}
#detail {
   position: absolute;
   top: 22px;
   left: 160px;
}
#number {
   position: absolute;
   top: 170px;
   left: 41px;
}
#Explain {
   width: 150px;
   height: 70px;
   font-size: 13px;
   font-style: italic;
   margin-left: 8px;
   color: slategray;
   margin-top: 9px;
}
#address {
   overflow: hidden;
   width: 150px;
   height: 24px;
   white-space: nowrap; /*一行显示*/
   overflow: hidden; /*超出部分隐藏*/
   text-overflow: ellipsis; /*用...代替超出部分*/
   margin-top: 9px;
}
#price {
   position: relative;
   bottom: -10px;
   right: -29px;
   color: slategray;
   font-style: italic;
   font-size: 10px;
}
</style>
