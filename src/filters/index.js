//全局的过滤器：
export default {
  //性别的格式的过滤器，参数sexNum性别数值：1先生、2女士
  sexFmt(sexNum) {
    let sexName = '' //性别的称呼
    if (sexNum != null) {
      switch (sexNum) {
        case 0:
          sexName = '女士'
          break
        case 1:
          sexName = '先生'
          break
        default:
          sexName = '人妖'
      }
    } else {
      sexName = '未知'
    }
    return sexName
  },
  //后面还可以定义其它的过滤
}
