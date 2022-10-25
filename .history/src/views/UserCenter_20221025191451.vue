<template>
   <div class="wrapper">
      <!-- 顶部-用户信息展示 -->
      <div class="topDiv" ref="topDiv" @touchmove.prevent>
         <span
            title="注销"
            v-show="isShowDelete"
            @click="deleteUser"
            style="
               position: absolute;
               margin: 10px 0px 0px 20px;
               cursor: pointer;
            "
            ><i
               class="el-icon-warning-outline"
               style="font-size: 37px; color: red"
            ></i>
         </span>

         <div class="userImg">
            <el-upload
               class="avatar-uploader"
               action="http://47.101.196.82:8988/elm/user/update"
               :data="{ userId: user.userId }"
               :show-file-list="false"
               :on-success="handleAvatarSuccess"
               :before-upload="beforeAvatarUpload"
            >
               <img
                  v-if="user.userImg"
                  :src="user.userImg"
                  class="avatar"
                  style="border-radius: 60px"
               />
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
         </div>

         <div class="userDetail">
            <h2>{{ user.username }}</h2>
            <br />
            <h5 @click="toAddAddress()">
               {{
                  deliveryAddress.address == null
                     ? "没有设置默认地址"
                     : deliveryAddress.address
               }}
            </h5>
         </div>

         <div class="toDown" title="点击修改信息">
            <i
               class="el-icon-edit"
               ref="toDownLogo"
               @click="toDown"
               style="font-size: 200%; color: azure"
            ></i>
         </div>
      </div>

      <!-- --------------修改用户信息-------------- -->
      <!-- 表单提交 -->
      <div class="updataDetail">
         <div class="changeDetailPointOut">
            <el-button-group>
               <el-button type="primary"
                  >修改个人信息<i class="el-icon-arrow-right el-icon--right"></i
               ></el-button>
            </el-button-group>
         </div>
         <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            style="margin: 30px 0px 0px 0px"
         >
            <!-- 修改密码 -->
            <el-form-item label="原密码" prop="password">
               <el-input
                  type="password"
                  v-model="ruleForm.password"
                  autocomplete="off"
                  style="width: 230px"
               ></el-input>
            </el-form-item>

            <!-- 确认修改密码 -->
            <el-form-item label="新密码" prop="checkPass">
               <el-input
                  type="password"
                  v-model="ruleForm.checkPass"
                  autocomplete="off"
                  style="width: 230px"
               ></el-input>
            </el-form-item>

            <!-- 修改用户名 -->
            <el-form-item label="用户名" prop="name">
               <el-input
                  v-model.number="ruleForm.name"
                  style="width: 230px"
               ></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="submitForm('ruleForm')"
                  >确认修改</el-button
               >
               <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
         </el-form>
      </div>

      <div class="fenGeXian" style="position: relative; top: 93px">
         <el-divider>历史评论</el-divider>
      </div>
      <!-- -----------------评论------------ -->
      <div
         class="comment"
         v-for="item in commentList"
         :key="item.commentId"
         style="margin-bottom: -105px; border-radius: 10px"
      >
         <el-card shadow="never" style="border-radius: 10px">
            <span class="pingFen">
               <el-rate v-model="item.commentScore"></el-rate>
            </span>
            <!-- 用户评价   -   用户评价 -->
            <div class="userComment">
               {{ item.commentText }}
            </div>
            <!-- 用户评价   -   用户头像 -->
            <img :src="item.imagePath" alt="" style="height: 74px" />
            <span class="commentTime">
               {{ item.createTime.slice(0, 10) }}
            </span>
         </el-card>
      </div>
   </div>
</template>
  
<script>
export default {
   data() {
      //修改信息,的检查规则----------Element-Ui自带---------
      var checkAge = (rule, value, callback) => {
         if (!value) {
            return callback(new Error("用户名不能为空"));
         }
      };
      var validatePass = (rule, value, callback) => {
         if (value === "") {
            callback(new Error("请输入原密码"));
         } else {
            if (this.ruleForm.checkPass !== "") {
               this.$refs.ruleForm.validateField("checkPass");
            }

            this.$axios
               .post(
                  "http://47.101.196.82:8988/elm/user/checkPassword",
                  this.$qs.stringify({
                     userId: this.user.userId,
                     checkPassword: this.ruleForm.password,
                  })
               )

               .then((response) => {
                  if (response.data.code != 1) {
                     this.open3();
                     this.ruleForm.password == " ";
                     this.resetForm("ruleForm");
                  }
               })
               .catch((error) => {
                  console.log(error);
               });
            callback();
         }
      };
      var validatePass2 = (rule, value, callback) => {
         if (value === "") {
            callback(new Error("请输入新密码"));
         } else {
            callback();
         }
      };

      return {
         //修改信息
         ruleForm: {
            password: "",
            checkPass: "",
            age: "",
         },
         rules: {
            password: [{ validator: validatePass, trigger: "blur" }],
            checkPass: [{ validator: validatePass2, trigger: "blur" }],
            age: [{ validator: checkAge, trigger: "blur" }],
         },

         //用户评论列表
         commentList: [],
         user: {},
         //默认地址
         deliveryAddress: [],
         //注销图标是否显示
         isShowDelete: true,
      };
   },

   methods: {
      //用户注销事件
      deleteUser() {
         if (confirm("确定要注销吗")) {
            localStorage.clear();
            sessionStorage.clear();
            this.$router.go(0);
            alert("用户已经注销");
         } else {
            return;
         }
      },

      //跳转添加地址
      toAddAddress() {
         this.$router.push({
            path: "/userAddress",
         });
      },

      //用户信息下滑动画
      toDown() {
         //获取DOM元素
         let topDivRef = this.$refs.topDiv;
         let toDownLogoRef = this.$refs.toDownLogo;
         // 给他添加过度动画,all全部添加,1s动画持续1s
         topDivRef.style.transition = "all 1s";

         //在上方时:
         if (toDownLogoRef.getAttribute("class") === "el-icon-edit") {
            // 根据clss名判断位置
            this.isShowDelete = false;
            topDivRef.style.transform = "translateY(80%)";
            topDivRef.style.borderRadius = "60px 60px 0px 0px";
            toDownLogoRef.setAttribute("class", "el-icon-caret-top");
            topDivRef.style.height = "52vh";
            topDivRef.style.backgroundPosition = "40% 60%";
         } else {
            this.isShowDelete = true;
            //在下方时,
            topDivRef.style.transform = "translateY(0%)";
            topDivRef.style.borderRadius = "0px 0px 60px 60px";
            toDownLogoRef.setAttribute("class", "el-icon-edit");
            topDivRef.style.backgroundPosition = "20% 20%";
            topDivRef.style.height = "46vh";
         }
      },

      //检测页面滑动到底的方法
      scrollBottom() {
         // 变量scrollTop为当前页面的滚动条纵坐标位置
         let scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
         // 变量 windowHeight 是可视区的高度
         let windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
         // 变量 scrollHeight 是滚动条的总高度
         let scrollHeight =
            document.documentElement.scrollHeight || document.body.scrollHeight;
         // 到底的条件
         if (scrollTop + windowHeight == scrollHeight) {
            //到底后要进行的操作
            this.openCenter();
         }
      },

      // ----------------------↓↓Element-Ui的方法↓↓---------------------------
      //修改个人信息
      submitForm(formName) {
         this.$refs[formName].validate((valid) => {
            if (valid) {
               //删除elementui中form表单自带的对象属性
               delete this.ruleForm.age;
               delete this.ruleForm.checkPass;

               this.$axios({
                  url: "http://47.101.196.82:8988/elm/user/update",
                  method: "POST",
                  headers: {
                     "content-type": "application/x-www-form-urlencoded",
                  }, //修改请求头,成为form表单提交
                  data: this.$qs.stringify({
                     userId: this.user.userId,
                     password: this.ruleForm.password,
                     username: this.ruleForm.name,
                  }),
               })
                  .then((response) => {
                     if (response.data.map.count === 1) {
                        if (this.ruleForm.name != 0) {
                           //更新信息
                           this.user.username = this.ruleForm.name;
                           this.$setSessionStorage("userinfo", this.user);
                           this.user = this.$getSessionStorage("userinfo");
                        }
                        //清空输入框
                        this.ruleForm.name == 0;
                        this.ruleForm.password == 0;
                        //弹窗 和 动画效果
                        this.open1();
                        this.toDown();
                     }
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            } else {
               console.log("error submit!!");
               return false;
            }
         });
      },

      resetForm(formName) {
         this.$refs[formName].resetFields();
      },

      handleAvatarSuccess(res, file) {
         this.user.userImg = URL.createObjectURL(file.raw);
      },

      beforeAvatarUpload(file) {
         const isJPG = file.type === "image/jpeg";
         const isLt2M = file.size / 1024 / 1024 < 2;

         if (!isJPG) {
            this.$message.error("上传头像图片只能是 JPG 格式!");
         }
         if (!isLt2M) {
            this.$message.error("上传头像图片大小不能超过 2MB!");
         }
         return isJPG && isLt2M;
      },
      // ----------------------↑↑Element-Ui的方法↑↑---------------------------

      // ----------------------↓↓Element-Ui的提醒框↓↓---------------------------
      //警告提示
      open3() {
         this.$message({
            message: "您的密码不正确",
            type: "warning",
         });
      },

      //弹窗提示
      open1() {
         this.$notify({
            title: "修改成功",
            message: "您的用户信息已更新",
            type: "success",
         });
      },

      //到底提示
      openCenter() {
         this.$message({
            message: "到底了",
            center: true,
         });
      },

      //未添加地址提示
      open4() {
         this.$message.error("您尚未添加默认地址");
      },
      // ----------------------↑↑Element-Ui的提醒框↑↑---------------------------
   },

   created() {
      //获取用户信息
      this.user = this.$getSessionStorage("userinfo");

      //检测用户是否有默认地址,跳转添加
      if (this.$getLocalStorage(this.user.userId) === null) {
         this.open4();
         this.$router.push("/userAddress");
      }
      if(this.$getLocalStorage(this.user.userId)!)
      this.deliveryAddress = this.$getLocalStorage(this.user.userId);

      //获取用户评论信息
      this.$axios
         .get("http://47.101.196.82:8988/elm/comment/list/" + this.user.userId)
         .then((response) => {
            this.commentList = response.data.map.commentList;
         })
         .catch((error) => {
            console.log(error);
         });
   },

   mounted() {
      if (this.$store.state.isNight) {
         //为true,标识启用夜间模式
         setTimeout(() => {
            let comment = document.getElementsByClassName("comment");
            for (let i = 0; i < comment.length; i++) {
               comment[i].style.opacity = 0.5;
            }
         }, 400);
      }

      //为页面添加滚动信息
      window.addEventListener("scroll", this.scrollBottom);
   },
};
</script>
  
<style scoped>
/* 用户展示区部分 */
.topDiv {
   z-index: 100;
   position: absolute;
   background-image: url("../assets/渐变蓝背景.jpg");
   background-position: 20% 20%;
   width: 100vw;
   height: 46vh;
   top: 0px;

   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

   border-radius: 0px 0px 60px 60px;
}
.topDiv .userImg {
   position: relative;
   width: 90px;
   border-radius: 100%;
   top: 20%;
   left: 28%;
}
.topDiv .userDetail {
   position: relative;
   top: 20%;
   left: 32%;
   max-width: 40vw;
}

.toDown {
   position: absolute;
   top: 20px;
   right: 20px;
   cursor: pointer;
}

/* 修改用户信息部分 */
.changeDetailPointOut {
   position: absolute;
   left: 0%;
   top: 2%;
}
.updataDetail {
   margin-top: 20%;
}

.avatar-uploader .el-upload {
   border: 1px dashed #d9d9d9;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
}
.avatar-uploader .el-upload:hover {
   border-color: #409eff;
}
.avatar-uploader-icon {
   font-size: 28px;
   color: #8c939d;
   width: 178px;
   height: 178px;
   line-height: 178px;
   text-align: center;
}
.avatar {
   width: 178px;
   height: 178px;
   display: block;
}
#testImg {
   position: absolute;
   z-index: 122;
}

/* ------------底部评论区--------- */
.comment {
   margin-top: 30%;
}

/* --------------瀑布------------- */
#fall-list {
   /* 父盒子相对定位 */
   position: relative;
   margin-top: 50%;
}

#fall-list .fall-line {
   /* 指元素沿着其容器的左侧或右侧放置,允许文本或者内联元素环绕他 */
   /* 从文档流中移除 */
   /* border:1px solid black; */
   float: left;
   width: 50vw;
}

#fall-list .fall-item {
   border: 1px solid black;
   border-radius: 30px 30px 0px 0px;
   width: 96%;
   margin: 5px auto;
}

#fall-list .fall-item img {
   width: 100%;
   border-radius: 30px 30px 0px 0px;
}

/* 评论卡片 */
.comment {
   width: 98vw;
   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
</style>