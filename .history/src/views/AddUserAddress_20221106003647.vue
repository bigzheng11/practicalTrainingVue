<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <p>新增送货地址</p>
      </header>

      <!-- 表单部分 -->
      <ul class="form-box">
         <li>
            <div class="title">联系人：</div>
            <div class="content">
               <input
                  type="text"
                  v-model="deliveryAddress.contactName"
                  placeholder="联系人姓名"
               />
            </div>
         </li>
         <li>
            <div class="title">性别：</div>
            <div class="content" style="font-size: 3vw">
               <input
                  type="radio"
                  value="1"
                  v-model="deliveryAddress.contactSex"
                  style="width: 6vw; height: 3.2vw"
               />男
               <input
                  type="radio"
                  value="0"
                  v-model="deliveryAddress.contactSex"
                  style="width: 6vw; height: 3.2vw"
               />女
            </div>
         </li>
         <li>
            <div class="title">电话：</div>
            <div class="content">
               <input
                  type="tel"
                  v-model="deliveryAddress.contactTel"
                  placeholder="电话"
               />
            </div>
         </li>
         <li>
            <div class="title">收货地址：</div>
            <div class="content">
               <input
                  type="text"
                  v-model="deliveryAddress.address"
                  placeholder="收货地址"
               />
            </div>
         </li>
      </ul>

      <div class="button-add">
         <button @click="addUserAddress">保存</button>
      </div>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
   name: "AddUserAddress",
   data() {
      return {
         deliveryAddress: {
            contactName: "",
            contactSex: "",
            contactTel: "",
            address: "",
            userId: "",
         },
         user: {},
         //商家的编号
         businessId: this.$route.query.businessId,
      };
   },
   created() {
      this.user = this.$getSessionStorage("userinfo");
      this.deliveryAddress.userId = this.user.userId; //取出userId赋值给 配送地址对象中的userId属性
   },
   components: {
      Footer,
   },
   methods: {
      successAlert(message) {
         this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
         });
      },
      addUserAddress() {
         if (this.deliveryAddress.contactName == "") {
            alert("联系人姓名不能为空");
            return;
         }
         if (this.deliveryAddress.contactTel == "") {
            alert("联系人姓名不能为空");
            return;
         }
         if (this.deliveryAddress.address == "") {
            alert("联系人姓名不能为空");
            return;
         }
         //ajax请求，保存地址信息
         this.$axios
            .post(
               "http://101.43.132.60:8988/elm/delivery/saveAddress",
               this.$qs.stringify(this.deliveryAddress)
            )
            .then((response) => {
               if (response.data.code == 1) {
                  this.successAlert("地址信息添加成功");
                  this.$router.push({
                     path: "/userAddress",
                     query: {
                        businessId: this.businessId,
                     },
                  });
               } else {
                  this.deliveryAddress.contactName = "";
                  this.deliveryAddress.contactTel = "";
                  this.deliveryAddress.address = "";
                  alert(response.data.message);
               }
            })
            .catch((error) => {
               console.log(error);
            });
      },
   },
};
</script>

<style scoped>
/*************** 总容器 ***************/
.wrapper {
   width: 100%;
   height: 100%;
}

/*************** header ***************/
.wrapper header {
   width: 100%;
   height: 12vw;
   background-color: #1561db;
   display: flex;
   justify-content: space-around;
   align-items: center;
   color: #fff;
   font-size: 4.8vw;
   position: fixed;
   left: 0;
   top: 0;
   /*保证在最上层*/
   z-index: 1000;
}

/*************** （表单信息） ***************/
.wrapper .form-box {
   width: 100%;
   margin-top: 4vw;
}

.wrapper .form-box li {
   box-sizing: border-box;
   padding: 4vw 3vw 0vw 3vw;
   display: flex;
}

.wrapper .form-box li .title {
   flex: 0 0 18vw;
   font-size: 3.5vw;
   font-weight: 700;
   color: #666;
}

.wrapper .form-box li .content {
   flex: 1;

   display: flex;
   align-items: center;
}

.wrapper .form-box li .content input {
   border: none;
   outline: none;
   width: 100%;
   height: 4vw;
   font-size: 3vw;
}

.wrapper .button-add {
   box-sizing: border-box;
   padding: 4vw 3vw 0vw 3vw;
}

.wrapper .button-add button {
   width: 100%;
   height: 10vw;
   font-size: 3.8vw;
   font-weight: 700;

   border: none;
   outline: none;
   border-radius: 4px;
   color: #6895d4;
   background-color: #c7e9fb;
   border: 1px solid #c8e2f5;
}
</style>
