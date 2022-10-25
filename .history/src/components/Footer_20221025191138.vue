<template>
   <!-- 底部菜单部分 -->
   <ul class="footer">
      <li>
         <i class="el-icon-eleme" ref="toHome" @click="toHome()"></i>
         <p>首页</p>
      </li>
      <li>
         <i
            class="el-icon-phone-outline"
            ref="toCompass"
            @click="toCompass()"
         ></i>
         <p>消息</p>
      </li>
      <li>
         <i class="el-icon-goods" ref="toCar" @click="toCar()"></i>
         <p>购物车</p>
      </li>
      <li @click="toOrderList">
         <i class="el-icon-date" ref="toOrderList" @click="toOrderList()"></i>
         <p>订单</p>
      </li>
      <li @click="toUserCenter">
         <i class="el-icon-user" ref="toUserCenter" @click="toUserCenter()"></i>
         <p>我的</p>
      </li>
   </ul>
</template>

<script>
export default {
   name: "Footer",
   data() {
      return {
         iconColor: "",
      };
   },
   methods: {
      changeIcon() {
         let toHomeLogo = this.$refs.toHome;
         let toCompassLogo = this.$refs.toCompass;
         let toCarLogo = this.$refs.toCar;
         let toOrderListLogo = this.$refs.toOrderList;
         let toUserCenterLogo = this.$refs.toUserCenter;

         toHomeLogo.setAttribute("class", "el-icon-eleme");
         toHomeLogo.style.fontSize = "5vw";
         toCompassLogo.setAttribute("class", "el-icon-phone-outline");
         toCompassLogo.style.fontSize = "5vw";
         toCarLogo.setAttribute("class", "el-icon-goods");
         toCarLogo.style.fontSize = "5vw";
         toOrderListLogo.setAttribute("class", "el-icon-date");
         toOrderListLogo.style.fontSize = "5vw";
         toUserCenterLogo.setAttribute("class", "el-icon-user");
         toUserCenterLogo.style.fontSize = "5vw";
      },

      toCompass() {
         this.changeIcon();

         let toCompassLogo = this.$refs.toCompass;
         toCompassLogo.setAttribute("class", "el-icon-phone");
         // toCompassLogo.style.fontSize = "6vw";

         if (this.$route.path == "/compass") {
            return;
         }
         this.$router.push("/compass");
      },

      toCar() {
         this.changeIcon();

         let toCarLogo = this.$refs.toCar;
         toCarLogo.setAttribute("class", "el-icon-s-goods");
         // toCarLogo.style.fontSize = "6vw";

         if (this.$route.path === "/car") {
            return;
         }
         this.$router.push("/car");
      },
      toHome() {
         this.changeIcon();

         let toHomeLogo = this.$refs.toHome;
         toHomeLogo.setAttribute("class", "el-icon-platform-eleme");
         // toHomeLogo.style.fontSize = "30px";

         if (this.$route.path == "/index" || this.$route.path == "/") {
            return;
         }
         console.log("跳转首页");
         this.$router.push("/");
      },
      toOrderList() {
         this.changeIcon();

         let toOrderListLogo = this.$refs.toOrderList;
         toOrderListLogo.setAttribute("class", "el-icon-s-order");
         // toOrderListLogo.style.fontSize = "30px";

         if (this.$route.path == "/orderList") {
            return;
         }
         this.$router.push("/orderList");
      },
      toUserCenter() {
         this.changeIcon();

         let toUserCenterLogo = this.$refs.toUserCenter;
         toUserCenterLogo.setAttribute("class", "el-icon-user-solid");
         // toUserCenterLogo.style.fontSize = "30px";

         if (this.$route.path == "/UserCenter") {
            return;
         }
         this.$router.push("/UserCenter");
      },
   },    
   mounted() {
      //为true,标识启用夜间模式
      if (this.$store.state.isNight) {
         console.log("启用夜间模式");
         
         document.querySelector(".footer").style.backgroundColor = "black";

      }
   }


};
</script>

<style scoped>
/****************** 底部菜单部分 ******************/
.wrapper .footer {
   width: 100%;
   height: 14vw;
   border-top: solid 1px #ddd;
   background-color: #fff;
   position: fixed;
   left: 0;
   bottom: 0%;
   display: flex;
   justify-content: space-around;
   align-items: center;
   z-index: 999;
}
.wrapper .footer li {
   /*li本身的尺寸完全由内容撑起*/
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   color: #1561db;
   user-select: none;
   cursor: pointer;
}
.wrapper .footer li p {
   font-size: 2.8vw;
}
.wrapper .footer li i {
   font-size: 5vw;
}
</style>
