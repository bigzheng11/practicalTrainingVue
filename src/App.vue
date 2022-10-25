<template>
   <div id="wrapper">
      <transition :name="transitionName">   
      <router-view></router-view>
   </transition>
      <div class="wrapper">
         <Footer v-show="$route.meta.isShow"></Footer>
      </div>
   </div>
</template>

<script>
import Footer from "./components/Footer.vue";
export default {
   data() {
      return {
         transitionName:''
      };
   },
   watch: {
    //使用watch,监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进,反之亦然
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'slide-left';
      } else {
        this.transitionName = 'slide-right';
      }
    },
  },
   methods: {},

   components: { Footer },
   created() {},
};
</script>

<style>
/*这里的内容，就是静态工程中的 reset.css*/
html,
body,
div,
span,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
p {
   margin: 0;
   padding: 0;
   font-family: "微软雅黑";
}
html,
body,
#wrapper {
   /*必须要设置，这样总容器高度才能100%*/
   width: 100%;
   height: 30%;
}
ul,
ol {
   list-style: none;
}
a {
   text-decoration: none;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
