import Dialogcom from './dialog.vue'
import dialog from './function'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

export default (Vue) => {
  Vue.component(Dialogcom.name, Dialogcom)
  Vue.prototype.$dialog = dialog
  Vue.use(ElementUI)
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(dialog)
  }
}
// const pubdialog = {
//   install(Vue, options){
//     Vue.component(Dialogcom.name, Dialogcom)
//     Vue.prototype.$dialog = dialog
//   }
// }
  // if (typeof window !== 'undefined' && window.Vue) {
  //   Vue.use(dialog)
  // }

