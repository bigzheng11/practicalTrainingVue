<template>
    <div id="itemLogo" @click="toBack">
        <i class="el-icon-back"></i>
    </div>
</template>
  
  <script>
  export default {
    name: "comeback",
    data() {
      return {};
    },
    methods: {
      //返回上一个页面
        toBack(){
            this.$router.go(-1)
        }
    },
  };
  </script>
  
  <style scoped>
  /****************** 返回部分 ******************/
  #itemLogo{
    z-index: 999;
    position:absolute;
    left:3%;
    top:-4px;
    font-size: 40px;
    cursor: pointer;
  }
  </style>