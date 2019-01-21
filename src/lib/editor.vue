<template>
    <textarea :id='id' :value='value'></textarea>
</template>
<script>
// Import TinyMCE
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/fullscreen'
const INIT = 0
const CHANGED = 2
// var EDITOR = null
export default {
  props: {
    value: {
      type: String,
      editor: null,
      required: true
    },
    setting: {},
    url: {
      // 接口
      default: '',
      type: String
    },
    accept: {
      // 文件类型
      default: 'image/jpeg, image/png',
      type: String
    },
    maxSize: {
      // 大小
      default: 2097152,
      type: Number
    },
    withCredentials: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    value: function (val) {
      // console.log('init ' + val)
      if (this.status === INIT || tinymce.activeEditor.getContent() !== val) {
        tinymce.activeEditor.setContent(val)
      }
      this.status = CHANGED
    }
  },
  data () {
    return {
      status: INIT,
      // userInfo: this.$store.state.userInfo,
      userInfo: {jobNumber: 1200436},
      // uploadUrl: this.$config.url().uploadUrl,
      uploadUrl: 'http://train.t.17usoft.com/trainskyzenapi/views/insertSkyFile',
      id: 'editor-' + new Date().getMilliseconds()
    }
  },
  methods: {},
  mounted () {
    const that = this
    const setting = {
      selector: '#' + that.id,
      upload_image_url: this.uploadUrl, // 配置的上传图片的路由
      // language_url: this.$config.url().language_url,
      language_url: 'http://train.t.17usoft.com/trainskyzen/static/tinymce/zh_CN.js',
      language: 'zh_CN',
      // skin_url: this.$config.url().skin_url,
      skin_url: 'http://train.t.17usoft.com/trainskyzen/static/tinymce/skins/lightgray',
      init_instance_callback: function (editor) {
        // EDITOR = editor
        // console.log('Editor: ' + editor.id + ' is now initialized.')
        editor.on('input change undo redo', () => {
          var content = editor.getContent()
          that.$emit('show', content)
          that.$emit('nextshow')
        })
      },
      content_style: `
    *                         { padding:0 margin:0 }
    html, body                { height:100% }
    img                       { max-width:100% display:blockheight:auto }
    a                         { text-decoration: none }
    iframe                    { width: 100% }
    p                         { line-height:1.6 margin: 0px }
    table                     { word-wrap:break-word word-break:break-all max-width:100% border:none border-color:#999 }
    .mce-object-iframe        { width:100% box-sizing:border-box margin:0 padding:0 }
    ul,ol                     { list-style-position:inside }
  `,
      insert_button_items: 'image link | inserttable',
      paste_retain_style_properties: 'all',
      paste_word_valid_elements: '*[*]', // word需要它
      paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
      paste_convert_word_fake_lists: false, // 插入word文档需要该属性
      paste_webkit_styles: 'all',
      paste_merge_formats: true,
      nonbreaking_force_tab: false,
      paste_auto_cleanup_on_paste: false,
      plugins: [
        'advlist link image',
        'code fullscreen',
        'table textcolor paste textcolor colorpicker wordcount'
      ], // 配置
      max_word: 5,
      // wordcount_cleanregex: /[0-9.(),:!?%#$?\x27\x22_+=\\\/\-]*/g,// 这里不需要转义
      wordcount_cleanregex: /[0-9.(),:!?%#$?\x27\x22_+=\\/-]*/g,
      toolbar_items_size: 'small',
      branding: false,
      block_formats:
        'Paragraph=pHeading 1=h1Heading 2=h2Heading 3=h3Heading 4=h4Heading 5=h5Heading 6=h6',
      toolbar1:
        'table |insertfile undo redo | formatselect | link unlink | uploadimg image media', // 工具栏1
      toolbar2:
        ' fontsizeselect | forecolor backcolor | fontselect bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | removeformat | fullscreen', // 工具栏2
      // 图片上传
      images_upload_handler: function (blobInfo, success, failure) {
        // failure(blobInfo)
        // that.$emit('on-ready', blobInfo.blob().size, blobInfo.blob())
        if (blobInfo.blob().size > that.maxSize) {
          failure('文件体积过大')
        }
        if (that.accept.indexOf(blobInfo.blob().type) >= 0) {
          uploadPic()
        } else {
          failure('图片格式错误')
        }
        function uploadPic () {
          // 发送请求

          // xhr.withCredentials = true
          var formData = new FormData()

          var xhr = new XMLHttpRequest()
          xhr.open('POST', that.url)
          xhr.onload = function () {
            failure('上传成功')
            if (xhr.status !== 200) {
              // 抛出 'on-upload-fail' 钩子
              that.$emit('on-upload-fail')
              failure('上传失败: ' + xhr.status)
              return
            }
            const json = JSON.parse(xhr.responseText)
            // 抛出 'on-upload-success' 钩子
            that.$emit('on-upload-success', [json, success, failure])
          }
          xhr.onerror = function () {
            that.$emit('on-ready', '上传失败')
          }

          formData.set('file', blobInfo.blob())
          formData.append('fileName', blobInfo.blob().name)
          formData.append('creatorNum', that.userInfo.jobNumber)
          xhr.send(formData)
        }
      }
    }
    Object.assign(setting, that.setting)

    tinymce.init(setting)
  },
  beforeDestroy: function () {
    tinymce.get(this.id).destroy()
  }
}
</script>
