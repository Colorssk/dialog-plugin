<template>
  <div id="app">
  </div>
</template>

<script>
 import {Button} from 'element-ui'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  mounted(){
    // setTimeout(() => {
    // this.$dialog({
    //     title: 'test dialog',
    //     width: '50%',
    //     data: [
    //       {type: 'input', label: '姓', placeholder: '请输入姓', id: '1', required: true},
    //       {type: 'select', placeholder: '请选择', id: '1', required: false, options: [{label: '男', value: '1'}, {label: '女', value: '2'}]},
    //       {type: 'input', label: '名', placeholder: '请输入名', id: '2'},
    //       {type: 'radio', label: '选择', placeholder: '请选择', id: '1', options: ['male', 'female']},
    //       {type: 'upload', id: 1, label: '文件上传'}
    //     ]
    //   }, (data) => { console.log(data) })
    // }, 500)
  }
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
