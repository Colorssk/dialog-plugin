<template>
   <!-- <transition name="fade"> -->
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      :width="width"
      :before-close="handleClose"
      :style="style"
      >
        <el-form ref="form" :rules="rules" :model="form" :label-width="labelWidth">
          <div v-for="(item, index) in data" :key="index">
            <el-form-item :label="item.label || 'label'" v-if="item.type == 'input'" :prop="imputhandle(item.id)">
              <el-input v-model="form[`input${item.id}`]" :placeholder="item.placeholder || ''"></el-input>
            </el-form-item>
            <el-form-item :label="item.label || 'label'" v-if="item.type == 'select'" :prop="selecthandle(item.id)">
              <el-select v-model="form[`select${item.id}`]" :placeholder="item.placeholder || ''">
                <el-option
                  v-for="(ite,index) in item.options"
                  :key="index"
                  :label="ite.label"
                  :value="ite.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="item.label || 'label'" v-if="item.type == 'radio'" :prop="radiohandle(item.id)">
              <el-radio-group v-model="form[`radio${item.id}`]" v-if="typeof(item.options[0]) == 'string' || typeof(item.options[0]) == 'number'">
                <div v-for="(ite, inde) in item.options" :key="inde" class="radio-group">
                  <el-radio :label="ite">{{ite}}</el-radio>
                </div>
              </el-radio-group>
              <el-radio-group v-model="form[`radio${item.id}`]" v-if="typeof(item.options[0]) !== 'string' && typeof(item.options[0]) !== 'number'">
                <div v-for="(val, key, inde) in item.options" :key="inde" class="radio-group">
                  <el-radio :label="key">{{val}}</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <!-- 富文本编辑器 -->
            <!-- <el-form-item :label="item.label || 'label'" v-if="item.type == 'editor'" >
              <editor class="editor" :value="form[`editor${item.id}`]" :setting="editorSetting" @show="editors"  @nextshow="nexteditors(itme.id)"  :url="Url" :max-size="MaxSize" :accept="Accept" :with-credentials="withCredentials" @on-upload-fail="onEditorReady" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item> -->
            <!-- 上传文件 -->
            <el-form-item :label="item.label || 'label'" v-if="item.type == 'upload'" >
              <el-upload

                class="upload-demo"

                ref="upload"

                :action="action"

                :on-preview="handlePreview"

                :before-upload="beforeAvatarUpload"

                :on-remove="handleRemove"

                :file-list="fileList"

                :auto-upload="autoUpload"

                :on-success="handleSuccess"

                :data="form"

                name="salaryBill">

              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!-- 上传功能合并到提交按钮上 -->

              <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->

              <p slot="tip" class="el-uploadtip">只能上传{{uploadtype}}文件</p>

            </el-upload>
            </el-form-item>
          </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('form')">{{buttomText}}</el-button>
        <el-button @click="reset($event,'form')">重置</el-button>
      </span>
    </el-dialog>
  <!-- </transition> -->
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'
import allrules from './rules'
import falserules from './falseRules'
import editor from './editor'
export default {
  name: 'dialogym', // 组件命名时候也要避免重复报错：Do not use built-in or reserved HTML elements as component id: dialog
  props: {
    uploadtype: {// 上传类型
      type: Array,
      default: () => { return ['jpg', 'png'] }
    },
    action: {
      type: String,
      default: 'https://jsonplaceholder.typicode.com/posts/'
    },
    buttomText: {
      type: String,
      default: '立即创建'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    data: {
      type: Array,
      require: true
    },
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '30%'
    },
    handlemounted: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      autoUpload: false,
      fileList: [],
      Url: 'http://train.t.17usoft.com/trainskyzenapi/views/insertSkyFile',
      content: null,
      editorSetting: {
        // 配置富文本编辑器高
        height: 300
      },
      MaxSize: 75765, // 文件大小
      Accept: 'image/jpeg, image/png', // 文件格式
      withCredentials: true,
      inputIndex: 0,
      form: {
      },
      loadcomponents: {},
      dialogVisible: false,
      rules: {
      }
    }
  },
  mounted () {
    this.onHandle()
    this.data.forEach(el => {
      // 表单不需要提交文件的数据
      if (el.type !== 'upload') {
        this.$set(this.form, `${el.type}${el.id}`, null)
      }
      // if (el.type === 'editor') {
      //   this.$set(this.form, `${el.type}${el.id}`, '')
      // }
      // this.form[`${el.type}${el.id}`] = null
    })
    // 问题:当重复某个小组件时候，每个重复组件的必填功能一样=>解决方法
    _.filter(this.data, {required: true}).forEach(obj => {
      // if (obj.type !== 'editor') {
      if (obj.type !== 'upload') {
        this.$set(this.rules, `${obj.type}${obj.id}`, [])
        this.$set(this.rules[`${obj.type}${obj.id}`], 0, allrules[obj.type])
      }
      // }
      // this.rules[`${obj.type}${obj.id}`] = [] // 这种写法因为对象深层赋值导致无法让vuejs去响应
      // this.rules[`${obj.type}${obj.id}`].push(allrules[obj.type])
    })
    _.reject(this.data, {required: true}).forEach(obj => {
      // if (obj.type !== 'editor') {
      if (obj.type !== 'upload') {
        this.$set(this.rules, `${obj.type}${obj.id}`, [])
        this.$set(this.rules[`${obj.type}${obj.id}`], 0, falserules[obj.type])
      }
      // }
      // this.rules[`${obj.type}${obj.id}`] = []
      // this.rules[`${obj.type}${obj.id}`].push(falserules[obj.type])
    })
    // 给radio设置默认值
    this.data.forEach((el, index) => {
      if (el.type === 'radio') {
        // 纯数组
        if (typeof (el.options[0]) === 'string' || typeof (el.options[0]) === 'number') {
          this.$set(this.form, `${el.type}${el.id}`, el.options[0])
        } else {
          this.$set(this.form, `${el.type}${el.id}`, el.options[0].value)
        }

      // this.form[`${el.type}${el.id}`] = null
      }
    })
    console.log(this.form)
    console.log(this.data)
  },
  // watch: {
  //   content: {
  //     handler: function (newvalue, oldvalue) {
  //       if (newvalue !== null) {
  //         this.nexteditors(1)
  //       }
  //     },
  //     immediate: true
  //   }
  // },
  computed: {
    imputhandle (id) {
      return (id) => {
        return `input${id}`
      }
    },
    selecthandle (id) {
      return (id) => {
        return `select${id}`
      }
    },
    radiohandle (id) {
      return (id) => {
        return `radio${id}`
      }
    },
    // editorhandle (id) {
    //   return (id) => {
    //     return `editor${id}`
    //   }
    // },
    style () {
      return {}
    }
  },
  components: {editor: editor},
  methods: {
    // 选哟调整上传功能给提交按钮
    submitUpload () {
      this.$refs['upload'][0].submit()// ====================调整具体看是文件上传接口是否是独立的
    },
    handleSuccess (res, file, fileList) {
      if (res.code === 20000) {
        this.$message({

          message: '上传成功！',

          type: 'success'

        })
      } else {
        this.$message({

          message: res.msg,

          type: 'error'

        })
      }
    },
    handleRemove (file, fileList) {
    },
    beforeAvatarUpload (file) {
      let fileType = file.name.split('.')

      if (this.uploadtype.indexOf(fileType[1]) > -1) {
        return file
      } else {
        this.$message({
          type: 'error',
          message: `上传文件只能是${this.uploadtype.join('or')}格式!`
        })

        return false
      }
    },
    handlePreview (file) {

    },
    onEditorUploadComplete (res) {
    // 处理上传图片后返回数据，添加img标签到编辑框内

    // console.log(res)
    // console.log(res[0].resultInfo.item.fileAddress)
      this.form.editor1 =
        this.form.editor1 +
        "<img src='" +
        res[0].resultInfo.item.fileAddress +
        "'>"
    },
    onEditorReady (ins, ina) {
    // 上传失败的函数
      console.log('ins')
      console.log(ins)
      console.log(ina)
    },
    editors (content) {
    // editor组件传过来的值赋给content
      this.content = content
    },
    nexteditors (id) {
      this.form[`editor${id}`] = this.content
    },
    reset (e, formName) {
      e.preventDefault()
      this.$refs[formName].resetFields()
    },
    onSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
          this.submitUpload()
        } else {
          this.$message({
            type: 'warning',
            message: '请安要求输入'
          })
        }
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.$emit('close')
        })
        .catch(_ => {})
    },
    onHandle () {
      this.handlemounted()// 需要分装在一个方法内
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
.radio-group{
  display: inline;
  padding-right: 25px;
}
.el-dialog__wrapper>>>.el-dialog__footer{
  text-align: center !important;
}
.editor {
  margin: 0 20px;
  width: 100%;
  height: 580px;
}
</style>
