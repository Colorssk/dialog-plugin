// import Vue from 'vue'
// import Componentdialog from './func_dialog'
// import radio from './radio.vue'
// const DialogConstructor = Vue.extend(Componentdialog)
// const RadioConstructor = Vue.extend(radio)
// let el
// const dialogInstnce = new RadioConstructor({
//   mounted () {
//     el = this.$el
//   }
// })
// dialogInstnce.vm = dialogInstnce.$mount()
// const dialog = (options) => {
//   if (Vue.prototype.$isServer) return
//   const instance = new DialogConstructor({
//     propsData: options,
//     mounted () {
//       console.log('覆盖没问题')
//       // document.getElementById('slot').appendChild('<div>test</div>')
//       // console.log(el)
//       // console.log(this.$el)
//       // this.$el.appendChild(el)
//       // console.log(this.$el)
//       // setTimeout(() => {
//       //   console.log(document.getElementById('#sl'))
//       // }, 3000)
//     }
//   })
//   instance.vm = instance.$mount()
//   // instance.vm.$el.appendChild(el)
//   // console.log(document.body)
//   // console.log(instance.$el.offsetHeight)
//   console.log(instance.$el.appendChild(el))
//   console.log(document.getElementById('#sl'))
//   // console.log(instance.vm.$el)
//   document.body.appendChild(instance.vm.$el)
//   instance.vm.dialogVisible = true
//   return instance.vm
// }
// export default dialog
import Vue from 'vue'
import Componentdialog from './func_dialog'

const DialogConstructor = Vue.extend(Componentdialog)

const dialog = (options, callback) => {
  if (Vue.prototype.$isServer) return
  const instance = new DialogConstructor({
    propsData: options
  })
  instance.vm = instance.$mount()
  instance.vm.dialogVisible = true
  document.body.appendChild(instance.vm.$el)// 要先插入页面才能对dom由后续操作
  instance.vm.$on('submit', (data) => {
    callback(data)
    instance.vm.dialogVisible = false
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
  })
  instance.vm.$on('close', () => {
    instance.vm.dialogVisible = false
    // 节点还在需要手动移除节点，插件形式手动销毁组件方便
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
  })
  return instance.vm
}
export default dialog
