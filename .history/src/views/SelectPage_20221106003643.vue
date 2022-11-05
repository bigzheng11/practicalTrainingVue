<template>
   <div class="wrapper">
      <div class="top">
         <el-input
            v-model="input"
            placeholder="请输入内容"
            style="width: 80%"
            v-on:input="getList"
         ></el-input>
      </div>

      <!-- 历史标签 -->
      <el-tag
         v-for="(tag, index) in tags"
         :key="tag.id"
         closable
         @click="handleClose(tag, index)"
      >
         {{ tag.name }}
      </el-tag>

      <!--selectLength=0时,代表都没搜到  -->
      <el-empty
         :image-size="200"
         v-show="selectLength == 0"
         style="position: absolute; bottom: 30%; left: 30%"
      ></el-empty>

      <div class="business">
         <el-row
            :gutter="12"
            v-for="(item, index) in businessList"
            :key="index"
         >
            <el-col :span="23" style="margin: 6px">
               <el-card shadow="always">
                  <img
                     @click="toBusinessInfo(item.businessId)"
                     :src="item.businessImg"
                     alt=""
                     style="height: 54px; border-radius: 10px; cursor: pointer"
                  />
                  {{ item.businessName }}
               </el-card>
            </el-col>
         </el-row>
      </div>

      <div class="food">
         <el-row :gutter="12" v-for="(item, index) in foodList" :key="index">
            <el-col :span="23" style="margin: 6px">
               <el-card shadow="never">
                  <img
                     @click="toBusinessInfo(item.businessId)"
                     :src="item.foodImage"
                     alt=""
                     style="height: 54px; border-radius: 30px; cursor: pointer"
                  />
                  {{ item.foodName }}
               </el-card>
            </el-col>
         </el-row>
      </div>
   </div>
</template>

<script>
export default {
   data() {
      return {
         input: "",
         foodList: [],
         businessList: [],
         //用来标识食品和商家是否全部搜到
         selectLength: 0,
         //标签
         tags: [],
         index: 0,
      };
   },

   methods: {
      //标签点击方法
      handleClose(tag, index) {
         this.input = tag.name;
         this.tags.splice(index, 1);
         this.getList();
      },

      //点击跳转方法
      toBusinessInfo(businessId) {
         this.$router.push({
            path: "/caidan",
            query: { businessId: businessId },
         });
      },

      //搜索主方法
      getList() {
         if (this.input != "") {
            //获取商家列表
            this.$axios
               .get(
                  "http://101.43.132.60:8988/elm/business/getBusinessName/" +
                     this.input
               )
               .then((response) => {
                  this.businessList = response.data.map.business;
                  //商家搜索到内容
                  if (this.businessList.length != 0) {
                     this.selectLength += 1;
                  }

                  //将搜索框内的文字,添加进标签的数组中
                  if (this.input != "") {
                     let Obj = {};
                     Obj.name = this.input;
                     Obj.type = "";
                     Obj.id = this.index;
                     this.tags.push(Obj);
                     this.index += 1;
                  }
               })
               .catch((error) => {
                  console.log(error);
               });

            //获取食品列表
            this.$axios
               .get(
                  "http://101.43.132.60:8988/elm/food/getFoodName/" + this.input
               )
               .then((response) => {
                  this.foodList = response.data.map.food;
                  //食品搜索到内容
                  if (this.foodList.length != 0) {
                     this.selectLength += 1;
                  }
               })
               .catch((error) => {
                  console.log(error);
               });
         } else {
            //输入框为空
            this.foodList = [];
            this.businessList = [];
            this.selectLength = 0;
         }
      },
   },
};
</script>
<style scoped>
.top {
   display: flex;
   width: 100vw;
   height: 10vh;
   background-color: #1561db;
   border-radius: 1px red solid;
   justify-content: center;
   align-items: center;
   border-radius: 0px 0px 20px 20px;
}

input {
   height: 4vh;
   width: 74%;
   border-radius: 10px;
}

img {
   position: absolute;
   right: 25px;
   top: 11px;
}
</style>

