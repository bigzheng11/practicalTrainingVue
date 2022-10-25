import { Loading } from 'element-ui'
let loading = null
//显示加载页面 传递 { text:'wwww' }
const showLoading = params => {
  if (loading) {
    loading.close()
  }
  let options = {
    fullscreen: true, //全屏显示
    lock: true, //锁定
    text: '数据加载中', //显示的文字
    spinner: 'el-icon-loading', //显示图标
    background: 'rgba(220,220,220,0.7)', //遮罩的背景颜色  rgba
  }
  //合并对象
  Object.assign(options, params)
  loading = Loading.service(options) //开启加载页面
}
//隐藏加载页面
const hideLoading = () => {
  if (loading) {
    loading.close()
  }
}

export { showLoading, hideLoading }

// let o1 = { name: 'tim', age: 12 }  options默认配置项
// let o2 = { name:'tom',sex: '女士' }  params参数
// Object.assign(o1, o2)
// { name: 'tom', age: 12, sex: '女士'}
