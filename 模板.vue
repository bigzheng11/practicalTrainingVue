<template>
  <div class="wrapper">
    
  </div>
</template>
  
<script>
export default {
  data() {
    return {};
  },

  methods: {},

  components: {},
  created() {
    this.$axios
      .get("brand/list")
      .then((response) => {
        //console.log(response.data)
        this.brandArr = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
  
  <style scoped>
</style>
  
<!-- 
axios请求:

this.$axios
.get('URL',this.$qs.stringify(this.user))
.then((response)=>{
    console.log(response)
    if(response.data.code == 1){
        console.log(成功)
    } else{
        console.log(出错啦)
    }
})
.catch((error)=>{
    console.log(error)
})

页面跳转:

this.$router.push({
    path: '/path',
    query: { ArgsName: args },
})


   -->