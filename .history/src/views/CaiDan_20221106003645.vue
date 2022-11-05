<template>
   <div class="wrapper">
      <!-- 返回上一个页面 -->
      <div id="itemLogo" @click="toBack">
         <i class="el-icon-back"></i>
      </div>

      <div style="position: absolute; right: 10px; top: 10px">
         <el-button type="text" @click="dialog = true"
            >评论
            <i class="el-icon-chat-dot-square" style="font-size: 20px"></i>
         </el-button>
      </div>

      <el-drawer
         title="发表一下你的看法吧"
         :before-close="handleClose"
         :visible.sync="dialog"
         direction="btt"
         custom-class="demo-drawer"
         ref="drawer"
         size="470px"
      >
         <div class="demo-drawer__content">
            <el-form :model="form" style="margin: 30px">
               <el-form-item label="看法" :label-width="formLabelWidth">
                  <el-input
                     v-model="form.commentText"
                     autocomplete="off"
                  ></el-input>
               </el-form-item>

               <el-form-item label="评分" :label-width="formLabelWidth">
                  <div class="block">
                     <el-rate v-model="form.commentScore"></el-rate>
                  </div>
               </el-form-item>

               <el-form-item label="图片" :label-width="formLabelWidth">
                  <el-upload
                     class="avatar-uploader"
                     action="http://101.43.132.60:8988/elm/comment/insert"
                     :data="{
                        businessId: form.businessId,
                        commentText: form.commentText,
                        commentScore: form.commentScore,
                        userId: user.userId,
                     }"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload"
                  >
                     <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                     <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
               </el-form-item>
            </el-form>

            <div class="demo-drawer__footer" style="margin-left: 130px">
               <el-button @click="cancelForm">取 消</el-button>
               <el-button
                  type="primary"
                  @click="$refs.drawer.closeDrawer()"
                  :loading="loading"
                  >{{ loading ? "提交中 ..." : "确 定" }}</el-button
               >
            </div>
         </div>
      </el-drawer>

      <!-- 背景图片 -->
      <img :src="businessList.businessImg" alt="" style="width: 100vw" />

      <!-- first 信息展示 -->
      <div class="detail">
         <!-- second 商家信息展示 -->
         <div class="moreDetail">
            <h1>{{ businessList.businessName }}</h1>
            <p class="explain">
               &nbsp;&nbsp;&nbsp;&nbsp;{{ businessList.businessExplain }}
            </p>
            <p class="address">{{ businessList.businessAddress }}</p>
            <span class="price"
               >配送:
               <div>{{ businessList.deliveryPrice }}￥</div>
               -起送:
               <div>{{ businessList.starPrice }}￥</div></span
            >
         </div>

         <!-- second 底部评论/菜单  -->
         <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <!-- 菜单区 -->
            <el-tab-pane label="菜单" name="second" tab-click="testdemo()">
               <el-tabs :tab-position="tabPosition" style="height: 400px">
                  <el-tab-pane
                     :label="item.foodClassifyName"
                     v-for="(item, indexOut) in foodClassifyList"
                     :key="item.foodClassifyId"
                  >
                     <div style="overflow: auto; width: 265px; height: 400px">
                        <div
                           v-for="(
                              item2, indexIn
                           ) in item.foodBusinessClassifyList"
                           :key="item2.foodId"
                           style="margin-bottom: 5px"
                           class="foodItem"
                        >
                           <img
                              :src="item2.food.foodImage"
                              alt=""
                              style="
                                 width: 100px;
                                 height: 100px;
                                 display: inline-block;
                                 border-radius: 20px;
                              "
                           />

                           <div
                              style="position: relative; display: inline-block"
                           >
                              <span class="foodItemName">
                                 {{ item2.food.foodName }}
                              </span>

                              <span class="foodItempPrice">
                                 ￥{{ item2.food.foodPrice }}
                              </span>

                              <span
                                 class="foodItempQuantity"
                                 style="
                                    position: absolute;
                                    right: -150px;
                                    top: -30px;
                                 "
                              >
                                 <span>
                                    <i
                                       class="fa fa-minus-circle"
                                       @click="
                                          minus(
                                             indexOut,
                                             indexIn,
                                             item2.quantity,
                                             item2.foodId
                                          )
                                       "
                                       v-show="item2.quantity != 0"
                                    ></i>
                                 </span>
                                 <span v-show="item2.quantity != 0">{{
                                    item2.quantity
                                 }}</span>
                                 <span>
                                    <i
                                       class="fa fa-plus-circle"
                                       @click="
                                          add(
                                             indexOut,
                                             indexIn,
                                             item2.quantity,
                                             item2.foodId
                                          )
                                       "
                                    ></i>
                                 </span>
                              </span>
                           </div>
                        </div>
                     </div>
                  </el-tab-pane> </el-tabs
            ></el-tab-pane>

            <!-- 评论区 -->
            <el-tab-pane label="评论" name="first">
               <div style="overflow: auto; height: 49vh">
                  <!-- 评论卡片 -->
                  <el-card
                     shadow="never"
                     v-for="item in commentList"
                     :key="item.commentId"
                     style="margin-bottom: 10px"
                  >
                     <div style="position: relative">
                        <span class="pingFen">
                           <el-rate v-model="item.commentScore"></el-rate>
                        </span>
                        <!-- 用户评价   -   用户评价 -->
                        <div class="userComment">
                           {{ item.commentText }}
                        </div>
                        <!-- 用户评价   -   用户头像 -->
                        <img
                           :src="item.imagePath"
                           alt=""
                           style="height: 74px"
                        />

                        <span class="commentTime">
                           {{ item.createTime.slice(0, 10) }}
                        </span>
                     </div>
                  </el-card>
               </div>
            </el-tab-pane>
         </el-tabs>
      </div>

      <!-- 底部购物车 -->
      <!-- TODO添加后图标1.变蓝,2.class="el-icon-s-goods" -->
      <div class="buttomCar">
         <i
            :class="total == 0 ? 'el-icon-goods' : 'el-icon-s-goods'"
            style="
               font-size: 70px;
               position: absolute;
               top: 1px;
               left: 20px;
               color: #74b9ff;
            "
         ></i>

         <div style="position: absolute; left: 40%; top: 9px">
            <p style="font-size: 20px">￥:{{ total }}</p>
            <p style="font-size: 12px">
               起送费:{{ businessList.deliveryPrice }}
            </p>
         </div>
         <el-button
            @click="toOrders"
            type="primary"
            round
            style="position: absolute; right: 15px; top: 12px"
            :disabled="total == 0"
            >{{ total == 0 ? "不能起送" : "下单" }}</el-button
         >
      </div>
   </div>
</template>
<script>
export default {
   data() {
      return {
         activeName: "second",
         tabPosition: "left",
         businessList: [],
         foodList: [],
         businessId: this.$route.query.businessId,
         commentList: [],
         foodClassifyList: [],
         cartArr: [],
         user: {},
         listCart: [],
         total: 0,
         // -----------表单
         table: false,
         dialog: false,
         loading: false,
         form: {
            businessId: this.$route.query.businessId,
            commentText: "",
            commentScore: 0,
            userId: 0,
            file: "",
         },
         formLabelWidth: "80px",
         timer: null,
         imageUrl: "",
         src: "",
         param: new FormData(), //表单要提交的参数
      };
   },

   methods: {
      //跳转订单页面方法
      toOrder() {
         //跳转至订单组件,Orders.vue
         this.$router.push({
            path: "/orders",
            query: {
               businessId: this.business.businessId,
            },
         });
      },

      //返回上一个页面
      toBack() {
         this.$router.go(-1);
      },
      //页面跳转
      toOrders() {
         this.$router.push({
            path: "/orders",
            query: { businessId: this.businessId },
         });
      },

      //计算总价方法
      totalPrice() {
         this.total = 0;
         for (let i = 0; i < this.foodClassifyList.length; i++) {
            for (
               let j = 0;
               j < this.foodClassifyList[i].foodBusinessClassifyList.length;
               j++
            ) {
               if (
                  this.foodClassifyList[i].foodBusinessClassifyList[j]
                     .quantity > 0
               ) {
                  this.total +=
                     this.foodClassifyList[i].foodBusinessClassifyList[j]
                        .quantity *
                     this.foodClassifyList[i].foodBusinessClassifyList[j].food
                        .foodPrice;
               }
            }
         }
         this.total = parseFloat(this.total).toFixed(2);
      },

      //---------------------------↓↓↓ Element-Ui原生方法 ↓↓↓---------------------------
      // 头像上传
      handleAvatarSuccess(res, file) {
         this.imageUrl = URL.createObjectURL(file.raw);
      },

      //头像上传规则
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

      // 表单
      handleClose(done) {
         if (this.loading) {
            return;
         }
         this.$confirm("确定想好了吗")
            .then((_) => {
               this.loading = true;
               this.timer = setTimeout(() => {
                  done();
                  // 动画关闭需要一定的时间
                  // setTimeout(() => {
                  //    this.loading = false;
                  // }, 400);
                  this.$router.go(0);
               }, 2000);
            })
            .catch((_) => {});
      },
      cancelForm() {
         this.loading = false;
         this.dialog = false;
         clearTimeout(this.timer);
      },

      //表单提交
      submitCommment() {
         this.$axios({
            method: "post",
            url: "http://101.43.132.60:8988/elm/comment/insert",
            headers: {
               "Content-Type": "multipart/form-data",
            },
            data: this.form,
         }).then((response) => {
            console.log(response);
         });
      },

      handleClick(tab, event) {
         //此处打印element的点击事件
         console.log(tab, event);
         console.log(tab.name);
      },
      //-------------------------------↑↑↑ Element-Ui原生方法 ↑↑↑-----------------------

      //-------------------------------↓↓↓ 购物车操作方法 ↓↓↓-----------------------
      //根据userId和businessID获取购物车
      getCart() {
         this.$axios
            .get("http://101.43.132.60:8988/elm/cart/listCart", {
               params: {
                  userId: this.user.userId,
                  businessId: this.businessId,
               },
            })
            .then((response) => {
               this.listCart = response.data.map.listCart;

               //对数据中数量进行同步
               for (let i = 0; i < this.foodClassifyList.length; i++) {
                  for (
                     let j = 0;
                     j <
                     this.foodClassifyList[i].foodBusinessClassifyList.length;
                     j++
                  ) {
                     this.foodClassifyList[i].foodBusinessClassifyList[
                        j
                     ].quantity = 0;
                     for (let z = 0; z < this.listCart.length; z++) {
                        if (
                           this.foodClassifyList[i].foodBusinessClassifyList[j]
                              .foodId === this.listCart[z].foodId
                        ) {
                           this.$set(
                              this.foodClassifyList[i].foodBusinessClassifyList[
                                 j
                              ],
                              "quantity",
                              this.listCart[z].quantity
                           );
                        }
                     }
                  }
               }
            })
            .catch((error) => {
               console.log(error);
            });
      },

      // 数量++方法
      add(indexOut, indexIn, quantity, foodId) {
         if (
            this.foodClassifyList[indexOut].foodBusinessClassifyList[indexIn]
               .quantity == 0
         ) {
            //如果数量是等于0，表示第一次添加数量
            this.saveCart(indexOut, indexIn, foodId);
         } else {
            //数量不是0，表示不是第一次添加数量,updateCart方法第二参数是更新数量，如果添加就是1
            this.updateCart(indexOut, indexIn, foodId, quantity, 1);
         }
      },

      // 数量--方法
      minus(indexOut, indexIn, quantity, foodId) {
         if (
            this.foodClassifyList[indexOut].foodBusinessClassifyList[indexIn]
               .quantity > 1
         ) {
            //如果数量大于1，进行数量减去1，第二参数，传递-1
            this.updateCart(indexOut, indexIn, foodId, quantity, -1);
         } else {
            //数量等于1，减去就要从数据库删除 购物数据。
            this.removeCart(indexOut, indexIn, foodId);
         }
      },

      //保存购物车方法
      saveCart(indexOut, indexIn, foodId) {
         this.$axios
            .post(
               "http://101.43.132.60:8988/elm/cart/saveCart",
               this.$qs.stringify({
                  businessId: this.businessId,
                  foodId: foodId,
                  userId: this.user.userId,
               })
            )
            .then((response) => {
               //添加成功餐品，餐品的数量变为1  食物的数组中数量同步数据库
               this.foodClassifyList[indexOut].foodBusinessClassifyList[
                  indexIn
               ].quantity = 1;
               this.totalPrice();
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //更新购物车方法
      updateCart(indexOut, indexIn, foodId, quantity, num) {
         this.$axios
            .put(
               "http://101.43.132.60:8988/elm/cart/updateCart",
               this.$qs.stringify({
                  businessId: this.businessId,
                  foodId: foodId,
                  userId: this.user.userId,
                  quantity: quantity + num, //当前quantity + num需要添加或删减的数量。
               })
            )
            .then((response) => {
               // 更新数量成功，食物的数组中数量同步数据库
               this.foodClassifyList[indexOut].foodBusinessClassifyList[
                  indexIn
               ].quantity += num;
               this.totalPrice();
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //删除购物车方法
      removeCart(indexOut, indexIn, foodId) {
         this.$axios //delete方式请求，传递参数是一个JSON对象，使用data属性传递
            .delete("http://101.43.132.60:8988/elm/cart/removeCart", {
               data: {
                  businessId: this.businessId,
                  foodId: foodId,
                  userId: this.user.userId,
               },
            })
            .then((response) => {
               //删除后，数组中该餐品的数量清零
               this.foodClassifyList[indexOut].foodBusinessClassifyList[
                  indexIn
               ].quantity = 0;
               this.totalPrice();
            })
            .catch((error) => {
               console.log(error);
            });
      },
      //-------------------------------↑↑↑ 购物车操作方法 ↑↑↑-----------------------
   },

   created() {
      //获取用户信息
      this.user = this.$getSessionStorage("userinfo");
      this.form.userId = this.user.userId;

      //获取商家信息 & 商家对应的食物
      this.$axios
         .get(
            "http://101.43.132.60:8988/elm/business/searchBusinessFood/" +
               this.businessId
         )
         .then((response) => {
            this.businessList = response.data.map.business;
            console.log("商家信息:-->", this.businessList);
            //调用listCart加载购物车中数据
         })
         .catch((error) => {
            console.log(error);
         });

      //根据商家id获取食品信息
      this.$axios
         .get(
            "http://101.43.132.60:8988/elm/foodClassify/getBusinessId/" +
               this.businessId
         )
         .then((response) => {
            let temp = response.data.map.foodClassifyList;
            for (let i = 0; i < temp.length; i++) {
               for (
                  let j = 0;
                  j < temp[i].foodBusinessClassifyList.length;
                  j++
               ) {
                  temp[i].foodBusinessClassifyList[j].quantity = 0;
               }
            }
            this.foodClassifyList = temp;
            //获取购物车信息 并 重新排序
            this.getCart();
         })
         .catch((error) => {
            console.log(error);
         });

      //根据商家ID查询「评论」
      this.$axios
         .get(
            "http://101.43.132.60:8988/elm/comment/getBusinessId/" +
               this.businessId
         )
         .then((response) => {
            console.log(
               "该商户下的评论:-->",
               response.data.map.getBusinessIdList
            );
            this.commentList = response.data.map.getBusinessIdList;
         })
         .catch((error) => {
            console.log(error);
         });
   },
};
</script>

  <style scoped>
/****************** 返回部分 ******************/
#itemLogo {
   z-index: 999;
   position: absolute;
   left: 3%;
   top: -4px;
   font-size: 40px;
   cursor: pointer;
   color: #3498db;
}
body {
   width: 100vw;
   height: 100vh;
}

.detail {
   width: 95vw;
   height: 76%;
   background-color: white;
   z-index: 100;
   position: absolute;
   top: 15%;
   border-radius: 30px 30px 0px 0px;
   padding: 10px;
}
.selected {
   margin-top: 3%;
}
.explain {
   font-size: 1.05rem;
   font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
      "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
   color: #606266;
}
.address {
   position: relative;
   font-size: 0.75rem;
   color: #b2bec3;
}
.price {
   font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
      "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

   position: relative;
   left: 57%;
}
.price div {
   display: inline-block;
   color: #0984e3;
}

/* .userComment{
  
} */
.pingFen {
   position: relative;
   left: 1px;
   top: -10px;
}

.commentTime {
   position: absolute;
   top: 110px;
   right: 0%;
   font-size: 10px;
   color: grey;
   z-index: 100;
}

/* 菜单内的食品 */
.foodItem {
}

.foodItemName {
   position: absolute;
   width: 100px;
   top: -90px;
   right: -115px;
}
.foodItempPrice {
   position: absolute;
   top: -30px;
   right: -80px;
}

/* ------------底部购物车------------- */
.buttomCar {
   position: fixed;
   width: 100vw;
   height: 8vh;
   /* border: 1px solid red; */
   border-radius: 30px;
   bottom: 1px;
   z-index: 999;
   background-color: #fff;
   box-shadow: 0px 0px 2.2px rgba(0, 0, 0, 0.039),
      0px 0px 5.3px rgba(0, 0, 0, 0.057), 0px 0px 10px rgba(0, 0, 0, 0.07),
      0px 0px 17.9px rgba(0, 0, 0, 0.083), 0px 0px 33.4px rgba(0, 0, 0, 0.101),
      0px 0px 80px rgba(0, 0, 0, 0.14);
}

/* 头像上传部分 */
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
</style>

