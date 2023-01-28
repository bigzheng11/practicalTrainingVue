<template>
   <div class="wrapper">
      <!-- header部分 -->
      <header>
         <p>地址管理</p>
      </header>

      <!-- 地址列表部分 -->

      <ul class="addresslist">
         <el-skeleton :rows="6" :loading="loading" />
         <li v-for="item in deliveryAddressArr" :key="item.daId">
            <div class="addresslist-left" @click="setDeliveryAddress(item)">
               <h3>
                  {{ item.contactName }} {{ item.contactSex | sexFmt }}
                  {{ item.contactTel }}
               </h3>
               <p>{{ item.address }}</p>
            </div>
            <div class="addresslist-right">
               <!-- <i class="fa fa-edit" @click="editUserAddress(index)"></i> -->
               <i class="el-icon-edit" @click="editUserAddress(item.daId)"></i>
               <i class="el-icon-delete" @click="open(item.daId)"></i>
            </div>
         </li>
      </ul>

      <!-- 新增地址部分 -->
      <div class="addbtn" @click="toAddUserAddress">
         <i class="fa fa-plus"></i>
         <p>新增收货地址</p>
      </div>

      <!-- 底部菜单部分 -->
      <Footer></Footer>
   </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
   name: "UserAddress",
   data() {
      return {
         //用户对象
         user: {},
         //配送地址的数组
         deliveryAddressArr: [],
         loading: true, //默认显示骨架屏
         //商家的编号
         businessId: this.$route.query.businessId,
      };
   },
   created() {
      console.log("-----this.$router----", this.$router);

      this.user = this.$getSessionStorage("userinfo");
      this.listDeliveryAddressByUserId(); //调用methods属性中定义的listDeliveryAddressByUserId方法
   },
   components: {
      Footer,
   },
   methods: {
      //----------------
      open(daId) {
         this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info ",
            center: true,
         })
            .then(() => {
               //删除的操作 address/delete/{daId}
               this.$axios
                  .get(
                     "http://4j89034j54.zicp.vip:8988/elm/delivery/removeAddress/" +
                        daId
                  )
                  .then((response) => {
                     console.log(response);

                     //删除的地址如果是 设置的默认地址
                     let defaultDeliveryAddress = this.$getLocalStorage(
                        this.user.userId
                     ); //从LocalStorage取出默认地址对象
                     if (
                        defaultDeliveryAddress != null &&
                        defaultDeliveryAddress.daId == daId
                     ) {
                        //如果默认地址的daId等于删除的地址daid,说明删除的就是默认地址
                        this.$removeLocalStorage(this.user.userId); //从local中删除默认地址
                     }
                     //重新调用，请求所有的配送地址
                     this.listDeliveryAddressByUserId();

                     this.$message({
                        type: "success",
                        message: "删除成功!",
                     });
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            })
            .catch(() => {
               this.$message({
                  type: "info",
                  message: "已取消删除",
               });
            });
      },
      //请求服务器API：通过userId获得该用户下所有的配送地址
      listDeliveryAddressByUserId() {
         this.$axios
            .get(
               "http://4j89034j54.zicp.vip:8988/elm/delivery/listById/" +
                  this.user.userId
            )
            .then((response) => {
               this.deliveryAddressArr = response.data.map.deliveryAddressList;
               this.loading = false; //赋值骨架屏变量为 fasle
            })
            .catch((error) => {
               console.log(error);
            });
      },
      setDeliveryAddress(deliveryAddress) {
         //把用户选择的默认送货地址存储到localStorage中
         this.$setLocalStorage(this.user.userId, deliveryAddress); //设置为默认的配送地址

         // this.$router.push({
         //    path: "/orders",
         //    query: {
         //       businessId: this.businessId,
         //    },
         // });

         this.$router.go(-1);
      },
      toAddUserAddress() {
         this.$router.push({
            path: "/addUserAddress",
            query: {
               businessId: this.businessId,
            },
         });
      },
      editUserAddress(daId) {
         console.log(daId);
         this.$router.push({
            path: "/editUserAddress",
            query: {
               daId: daId,
               businessId: this.businessId,
            },
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
   background-color: #f5f5f5;
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

/*************** addresslist ***************/
.wrapper .addresslist {
   width: 100%;
   margin-top: 12vw;
   background-color: #fff;
}

.wrapper .addresslist li {
   width: 100%;
   box-sizing: border-box;
   border-bottom: solid 1px #ddd;
   padding: 3vw;

   display: flex;
}

.wrapper .addresslist li .addresslist-left {
   flex: 5;
   /*左边这块区域是可以点击的*/
   user-select: none;
   cursor: pointer;
}

.wrapper .addresslist li .addresslist-left h3 {
   font-size: 3.6vw;
   font-weight: 300;
   color: #666;
}

.wrapper .addresslist li .addresslist-left p {
   font-size: 3vw;
   color: #58626a;
}

.wrapper .addresslist li .addresslist-right {
   flex: 1;
   font-size: 4.6vw;
   color: #000;
   cursor: pointer;

   display: flex;
   justify-content: space-around;
   align-items: center;
}
.wrapper .addresslist li .addresslist-right .el-icon-delete {
   color: #ff0066;
}

/*************** 新增地址部分 ***************/
.wrapper .addbtn {
   width: 100%;
   height: 14vw;
   border-top: solid 1px #fff;
   border-bottom: solid 1px #fff;
   background-color: #fafafa;
   margin-top: 4vw;

   display: flex;
   justify-content: center;
   align-items: center;

   font-size: 4vw;
   color: #2c3035;
   user-select: none;
   cursor: pointer;
}

.wrapper .addbtn p {
   margin-left: 2vw;
}
.wrapper .addbtn .fa-plus-circle {
   color: #2c3035;
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
</style>
