<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <p>用户注册</p>
      </header>

      <!-- 表单部分 -->
      <ul class="form-box">
         <li>
            <div class="title">手机号码：</div>
            <div class="content">
               <input
                  type="text"
                  @blur="checkUserId"
                  v-model="user.userId"
                  placeholder="输入手机号码"
               />
            </div>
         </li>
         <li>
            <div class="title">密码：</div>
            <div class="content">
               <input
                  type="password"
                  v-model="user.password"
                  placeholder="输入密码"
               />
            </div>
         </li>
         <li>
            <div class="title">确认密码：</div>
            <div class="content">
               <input
                  type="password"
                  v-model="confirmPassword"
                  placeholder="输入确认密码"
               />
            </div>
         </li>
         <li>
            <div class="title">用户名称：</div>
            <div class="content">
               <input
                  type="text"
                  v-model="user.username"
                  placeholder="输入用户昵称"
               />
            </div>
         </li>
         <li>
            <div class="title">性别：</div>
            <div class="content" style="font-size: 3vw">
               <input
                  type="radio"
                  name="sex"
                  v-model="user.userSex"
                  value="1"
                  style="width: 6vw; height: 3.2vw"
               />男
               <input
                  type="radio"
                  name="sex"
                  v-model="user.userSex"
                  value="0"
                  style="width: 6vw; height: 3.2vw"
               />女
            </div>
         </li>
      </ul>

      <div class="button-login">
         <button @click="register">注册</button>
      </div>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
   name: "Register",
   data() {
      return {
         //定义JSON用户对象user，注册请求直接发送至 服务器端
         user: {
            userId: "",
            password: "",
            username: "",
            userSex: 1,
         },
         confirmPassword: "", //确认密码无需录入数据库，不需要传递给服务器端，独立定义一个变量
      };
   },
   methods: {
      checkUserId() {
         //检查用户userID是否已经注册过。  userId就是手机号
         this.$axios
            .get(
               "http://101.43.132.60:8988/elm/user/checkId/" + this.user.userId
            )
            .then((response) => {
               console.log(response.data);
               if (response.data.code == 20005) {
                  this.user.userId = ""; //清空userId数据，双向绑定文本框中的内容也会清空
                  alert(response.data.message);
               }
            })
            .catch((error) => {
               console.log(error);
            });
      },
      register() {
         //提交user信息，请求服务器端API，实现注册功能
         if (this.user.userId == "") {
            alert("手机号码不能为空");
            return;
         }
         if (this.user.password == "") {
            alert("密码不能为空");
            return;
         }
         if (this.confirmPassword == "") {
            alert("确认密码不能为空");
            return;
         }
         if (this.confirmPassword != this.user.password) {
            alert("两次密码输入不一致");
            return;
         }
         if (this.user.username == "") {
            alert("用户名不能为空");
            return;
         }
         //注册：服务器API:user/saveUser
         // this.$qs.stringify(this.user) 将JSON对象形式 转为  参数形式   key=value&key=value
         this.$axios
            .post("http://101.43.132.60:8988/elm/user/addUser", this.user)
            .then((response) => {
               console.log(response.data);
               if (response.data.code == 1) {
                  alert("注册成功");
                  this.$router.back();
               } else {
                  alert(response.data.message);
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

/****************** 表单部分 ******************/
.wrapper .form-box {
   width: 100%;
   margin-top: 0;
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
}

.wrapper .button-login button {
   width: 100%;
   height: 10vw;
   font-size: 3.8vw;
   font-weight: 700;
   color: #6895d4;
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
   color: #666;
   background-color: #eee;
   border-radius: 4px;

   border: none;
   outline: none;
   border: solid 1px #ddd;
}
</style>
