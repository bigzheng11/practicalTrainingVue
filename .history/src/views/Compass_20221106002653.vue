<template>
   <div class="wrapper">
      <div class="top">
         <p>消息</p>
         <div class="all" @click="clearAll">
            <i class="el-icon-edit"></i>全部已读
         </div>
      </div>

      <!-- 测试 -->
      <div id="Ui" style="margin: 60px 0px 0px 10px">
         <el-card
            class="box-card"
            style="width: 95vw; border-radius: 20px; margin-bottom: 8px"
            v-for="(item, index) in allList"
            :key="item.orderId"
         >
            <div slot="header" class="clearfix">
               <span>
                  <img
                     :src="item.business.businessImg"
                     alt=""
                     style="width: 60px; border-radius: 20px"
                  />
                  {{ item.business.businessName }}
               </span>

               <div
                  class="warning"
                  style="
                     float: right;
                     padding: 3px 0;
                     color: red;
                     cursor: pointer;
                  "
                  v-show="!item.message.status"
                  @click="clearWarning(item.message.mid, index)"
               >
                  <i class="el-icon-warning" style="font-size: 22px"></i>
               </div>
               <p
                  @click="deleteTest(item.message.mid)"
                  style="position: relative; left: 300px; top: 94px"
               >
                  <i
                     class="el-icon-delete-solid"
                     style="font-size: 30px; color: #e17055; cursor: pointer"
                  ></i>
               </p>
            </div>
            <div
               class="text item"
               v-for="(itemTwo, index) in item.odList"
               :key="index"
            >
               {{ itemTwo.food.foodName }}X{{ itemTwo.quantity }}
            </div>
         </el-card>
      </div>
   </div>
</template>
  
<script>
export default {
   name: "WebSocket",
   data() {
      return {
         // ws是否启动
         wsIsRun: false,
         // 定义ws对象
         webSocket: null,
         // ws请求链接（类似于ws后台地址）
         ws: "",
         // ws定时器
         wsTimer: null,
         user: {},
         message: {},
         listOrderStatus: [],
         orderId: 0,

         OrdersList: [],
         businessList: [],
         allList: [],
      };
   },

   created() {
      this.user = this.$getSessionStorage("userinfo");
      //请求数据库中的订单数据，用于绑定页面需要显示的数据，信息表中的status字段是记录该消息是否已经被读过
      this.$axios
         .get(
            "http://47.101.196.82:8988/elm/websocket/checkOrderMessage/" +
               this.user.userId
         )
         .then((response) => {
            this.allList = response.data.map.listOrderStatus;

            this.$message({
               type: "success",
               message: this.message.data,
            });

            this.listOrderStatus = response.data.map;

         })
         .catch((error) => {
            console.log(error);
         });
   },

   async mounted() {
      this.wsIsRun = true;
      this.wsInit();

      if (this.$store.state.isNight) {
         setTimeout(() => {
            let comment = document.querySelector("#Ui");
            let header = document.querySelector(".top");
            header.style.backgroundColor = "grey";
            comment.style.opacity = 0.5;
         }, 400);
      }
   },

   methods: {
      //删除消息,刷新页面
      deleteTest(mid) {
         this.$axios
            .get("http://47.101.196.82:8988/elm/message/eliminate/" + mid)
            .then((response) => {
               this.$router.go(0);
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //一键已读
      clearAll() {
         for (let i = 0; i < this.allList.length; i++) {
            this.clearWarning(this.allList[i].message.mid, i);
         }
      },

      //已读
      clearWarning(mide, index) {
         this.allList[index].message.status = 1;
         this.$axios
            .post(
               "http://47.101.196.82:8988/elm/message/updateOrderByIdState",
               {
                  mid: mide,
                  status: 1,
               }
            )
            .then((response) => {
               console.log(response);
            })
            .catch((error) => {
               console.log(error);
            });
      },

      //参数的意思为传递一个订单ID用于更新标记的已读或者未读,使用点击事件请求地址
      redering() {},
      demoServer() {
         console.log("你干嘛！");
         this.$axios
            .get("websocket/pushone")
            .then((response) => {
               console.log("response.data:----->", response.data);
               this.webSocket.send("推送");
               console.log(this.message);
               this.$message({
                  type: "success",
                  message: this.message.data,
               });
            })
            .catch((error) => {
               console.log(error);
            });
      },

      sendDataToServer() {
         if (this.webSocket.readyState === 1) {
            this.webSocket.send("来自前端的数据");
         } else {
            throw Error("服务未连接");
         }
      },
      /**
       * 初始化ws
       */
      wsInit() {
         const wsuri =
            "ws://47.101.196.82:8988/elm/websocket/" + this.user.userId;
         this.ws = wsuri;
         if (!this.wsIsRun) return;
         // 销毁ws
         this.wsDestroy();
         // 初始化ws
         this.webSocket = new WebSocket(this.ws);
         // ws连接建立时触发
         this.webSocket.addEventListener("open", this.wsOpenHanler);
         // ws服务端给客户端推送消息
         this.webSocket.addEventListener("message", this.wsMessageHanler);
         // ws通信发生错误时触发
         this.webSocket.addEventListener("error", this.wsErrorHanler);
         // ws关闭时触发
         this.webSocket.addEventListener("close", this.wsCloseHanler);

         // 检查ws连接状态,readyState值为0表示尚未连接，1表示建立连接，2正在关闭连接，3已经关闭或无法打开
         clearInterval(this.wsTimer);
         this.wsTimer = setInterval(() => {
            if (this.webSocket.readyState === 1) {
               clearInterval(this.wsTimer);
            } else {
               console.log("ws建立连接失败");
               this.wsInit();
            }
         }, 3000);
      },
      wsOpenHanler(event) {
         console.log("ws建立连接成功");
         console.log("event:--->", event);
      },
      wsMessageHanler(e) {
         console.log("wsMessageHanler");
         console.log(e);
         this.message = e;
      },
      /**
       * ws通信发生错误
       */
      wsErrorHanler(event) {
         console.log(event, "通信发生错误");
         this.wsInit();
      },
      /**
       * ws关闭
       */
      wsCloseHanler(event) {
         console.log(event, "ws关闭");
         this.wsInit();
      },
      /**
       * 销毁ws
       */
      wsDestroy() {
         if (this.webSocket !== null) {
            this.webSocket.removeEventListener("open", this.wsOpenHanler);
            this.webSocket.removeEventListener("message", this.wsMessageHanler);
            this.webSocket.removeEventListener("error", this.wsErrorHanler);
            this.webSocket.removeEventListener("close", this.wsCloseHanler);
            this.webSocket.close();
            this.webSocket = null;
            clearInterval(this.wsTimer);
         }
      },
   },
};
</script>
  
  <style scoped>
/* card部分 */
.text {
   font-size: 14px;
}

.item {
   margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
   display: table;
   content: "";
}
.clearfix:after {
   clear: both;
}

.box-card {
   width: 480px;
}

* {
   margin: 0;
   padding: 0;
}
.wrapper .top {
   z-index: 100;
   width: 100%;
   height: 14vw;
   border-top: solid 1px #ddd;
   background-color: #ecf0f1;
   position: fixed;
   left: 0;
   top: -1px;
   display: flex;
   justify-content: space-around;
   align-items: center;
   margin: 0px;
   padding: 0;
}
.wrapper .top p {
   position: absolute;
   font-size: 22px;
   left: 30px;
}
.wrapper .top .all {
   position: absolute;
   right: 26px;
   color: #7f8c8d;
   cursor: pointer;
}

.wrapper .top li {
   /*li本身的尺寸完全由内容撑起*/
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   color: #1561db;
   user-select: none;
   cursor: pointer;
}
.wrapper .top li p {
   font-size: 2.8vw;
}
.wrapper .top li i {
   font-size: 5vw;
}

.list {
   margin-top: 70px;
}
.listItem {
   width: 94vw;
   height: 92px;
   margin: 8px;
}

.listItem img {
   width: 25%;
   border-radius: 20px;
}
.redPoint {
   width: 6%;
   height: 20px;
   border-radius: 100%;
   background-color: #e17055;
   position: relative;
   z-index: 50;
   left: 23%;
   bottom: 100%;
   color: white;
}
.listItem .text {
   width: 60%;
   height: 80%;
   position: relative;
   /* border: 1px red solid; */
   top: -100%;
   left: 27%;
   font-size: 14px;
   color: grey;
}
.listItem .businessName {
   width: 30%;
   height: 80%;
   position: relative;
   /* border: 1px blue solid; */
   top: -110%;
   left: 67%;
   font-size: 16px;
   color: salmon;
   font-weight: 700;
   text-overflow: ellipsis;
   overflow: hidden;
   white-space: nowrap;
   cursor: pointer;
}
</style>