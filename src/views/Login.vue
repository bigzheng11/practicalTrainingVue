<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <div id="itemLogo" @click="toBack">
            <i class="el-icon-back"></i>
         </div>
         <p>用户登陆</p>
      </header>

      <!-- 表单部分 -->
      <ul class="form-box">
         <li>
            <div class="title">手机号码：</div>
            <div class="content">
               <input
                  type="text"
                  v-model="user.userId"
                  placeholder="手机号码"
               />
            </div>
         </li>
         <li>
            <div class="title">密码：</div>
            <div class="content">
               <input
                  type="password"
                  v-model="user.password"
                  placeholder="密码"
               />
            </div>
         </li>
      </ul>

      <div class="button-login">
         <button @click="login">登陆</button>
      </div>
      <div class="button-register">
         <button @click="register">去注册</button><br /><br />
      </div>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
   name: "Login",
   data() {
      return {
         user: {
            userId: "",
            password: "",
         },
      };
   },

   methods: {
      //登录方法
      login() {
         //对文本框和密码框进行非空验证
         if (this.user.userId == "") {
            alert("手机号码不能为空");
            return;
         }
         if (this.user.password == "") {
            alert("密码不能为空");
            return;
         }
         this.$axios
            .post("http://47.101.196.82:8988/elm/user/login", this.user)
            .then((response) => {
               let userinfo = response.data.map.user;

               //将用户信息存入session
               this.$setSessionStorage("userinfo", userinfo);

               //返回之前的页面
               this.$router.back();
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //返回上一个页面
      toBack() {
         this.$router.go(-1);
      },

      //跳转注册页面
      register() {
         this.$router.push("/register");
      },
   },

   components: {
      Footer,
   },
};
</script>

<style>
/****************** 返回部分 ******************/
#itemLogo {
   z-index: 999;
   position: absolute;
   left: 3%;
   top: -4px;
   font-size: 40px;
   cursor: pointer;
}

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

/****************** 表单部分 ******************/
.wrapper .form-box {
   width: 100%;
   margin-top: 20vm;

   padding: 20vw 0 0 0;
}

.wrapper .form-box li {
   box-sizing: border-box;
   padding: 4vw 3vw 0 3vw;
   display: flex;
   align-items: center;
}

.wrapper .form-box li .title {
   flex: 0 0 18vw;
   font-size: 3vw;
   font-weight: 700;
   color: #666;
}

.wrapper .form-box li .content {
   flex: 1;
}

.wrapper .form-box li .content input {
   border: none;
   outline: none;
   width: 100%;
   height: 4vw;
   font-size: 3vw;
}

.wrapper .button-login {
   width: 100%;
   box-sizing: border-box;
   padding: 4vw 3vw 0 3vw;
   margin-top: 5vw;
}

.wrapper .button-login button {
   width: 100%;
   height: 10vw;
   font-size: 3.8vw;
   font-weight: 700;
   color: #4384f9;
   background-color: #c7e9fb;
   border: 1px solid #c8e2f5;
   border-radius: 4px;

   border: none;
   outline: none;
}

.wrapper .button-register {
   width: 100%;
   box-sizing: border-box;
   padding: 4vw 3vw 0 3vw;
}

.wrapper .button-register button {
   width: 100%;
   height: 10vw;
   font-size: 3.8vw;
   font-weight: 700;
   /*与上面登陆按钮不同的只有颜色、背景色、边框不同*/
   color: #fff;
   background-color: #3b99f0;
   border: solid 1px #ddd;
   border-radius: 4px;

   border: none;
   outline: none;
}

/****************** 底部菜单部分 ******************/
.wrapper .footer {
   width: 100%;
   height: 14vw;
   border-top: solid 1px #ddd;
   background-color: #fff;

   position: fixed;
   left: 0;
   bottom: 0;

   display: flex;
   justify-content: space-around;
   align-items: center;
}

.wrapper .footer li {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   color: #999;
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
