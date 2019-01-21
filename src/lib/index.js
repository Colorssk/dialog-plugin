import Dialogcom from './dialog.vue'
import dialog from './function'

export default (Vue) => {
  Vue.component(Dialogcom.name, Dialogcom)
  Vue.prototype.$dialog = dialog
  // 这里的判断很重要
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

