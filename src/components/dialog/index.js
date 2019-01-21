import Dialogcom from './dialog.vue'
import dialog from './function'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
export default (Vue) => {
  Vue.component(Dialogcom.name, Dialogcom)
  if (typeof window !== 'undefined' && window.Vue) {
    window.$dialog = dialog
    Vue.use(ElementUI)
    Vue.use(dialog)
  }
  Vue.prototype.$dialog = dialog
}
