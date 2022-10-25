<template>
  <div class="wrapper">

    <!-- header部分 -->
    <header>
      <p>编辑送货地址</p>
    </header>

    <!-- 表单部分 -->
    <ul class="form-box">
      <li>
        <div class="title">
          联系人：
        </div>
        <div class="content">
          <input type="text" placeholder="联系人姓名" v-model="deliveryAddress.contactName">
        </div>
      </li>
      <li>
        <div class="title">
          性别：
        </div>
        <div class="content" style="font-size: 3vw;">
          <input type="radio" value="1" style="width:6vw;height:3.2vw;"
                 v-model="deliveryAddress.contactSex">男
          <input type="radio" value="0" style="width:6vw;height:3.2vw;"
                 v-model="deliveryAddress.contactSex">女
        </div>
      </li>
      <li>
        <div class="title">
          电话：
        </div>
        <div class="content">
          <input type="tel" placeholder="电话" v-model="deliveryAddress.contactTel">
        </div>
      </li>
      <li>
        <div class="title">
          收货地址：
        </div>
        <div class="content">
          <input type="text" placeholder="收货地址" v-model="deliveryAddress.address">
        </div>
      </li>
    </ul>

    <div class="button-add">
      <button @click="editUserAddress">更新</button>
    </div>

    <!-- 底部菜单部分 -->
    <Footer></Footer>
  </div>
</template>

<script>
  import Footer from '../components/Footer.vue'

  export default {
    name: 'EditUserAddress',
    data() {
      return {
        daId: this.$route.query.daId, //获得编辑地址 编号daId
        deliveryAddress: {},
        //商家的编号
        businessId: this.$route.query.businessId,
      }
    },
    created() {
      //默认加载需要编辑的地址对象信息  address/get/{daId}
      this.$axios('address/get/' + this.daId)
        .then((response) => {
          if (response.data.code == 1) {
            this.deliveryAddress = response.data.data.address //获得需要编辑的地址对象信息
          } else {
            this.$message({
              type: 'error',
              message: response.data.message,
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    components: {
      Footer,
    },
    methods: {
      editUserAddress() {
        if (this.deliveryAddress.contactName == '') {
          this.$message({
            type: 'warning',
            message: '联系人姓名不能为空',
          })
        }
        if (this.deliveryAddress.contactTel == '') {
          this.$message({
            type: 'warning',
            message: '联系人电话不能为空',
          })
        }
        if (this.deliveryAddress.address == '') {
          this.$message({
            type: 'warning',
            message: '联系人详细地址不能为空',
          })
        }

        //请求服务器端 进行地址信息更新  address/update
        this.$axios
          .put('address/update', this.$qs.stringify(this.deliveryAddress))
          .then((response) => {
            if (response.data.code == 1) {
              this.$message({
                type: 'success',
                message: '地址信息更新成功',
              })
              this.$router.push({
                path: '/userAddress',
                query: {
                  businessId: this.businessId,
                },
              })
            } else {
              this.$message({
                type: 'error',
                message: response.data.message,
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
    },
  }
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
    color: #70c26d;
    background-color: #daf2d8;
  }
</style>
