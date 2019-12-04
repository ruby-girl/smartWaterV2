<template>
  <div class="uploadBox">
    <el-form-item label="附件类型">
      <el-select v-model="certificates" placeholder="请选择" size="small">
        <el-option v-for="(item,index) in option" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <div class="uploadPart" style="margin: 0 100px 20px 100px">
      <el-upload
        ref="foreignPersonUploadItem"
        class="upload-demo uploadFile"
        :action="upUrl"
        :headers="headers"
        :before-upload="beforeAvatarUpload"
        :on-success="uploadSuccess"
        :show-file-list="false"
        :on-exceed="handleExceed"
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.JPG,.JPEG,.PDF,.DOC,.DOCX,.XLS,.XLSX"
        :file-list="fileList">
        <el-button size="small" type="success"><i class="icon iconfont">&#xe688;</i> 添加附件</el-button>
        <div slot="tip" class="el-upload__tip">可选择jpg/png/word/excel/pdf格式，每张图片大小限制为10M内</div>
      </el-upload>

      <ul class="uploadList el-upload-list el-upload-list--text">
        <li v-for="(item,index) in fileList" :key="index" tabindex="0" class="el-upload-list__item is-success">
          <div>
            <p @mouseover="selectStyle (item)" @mouseout="outStyle(item)">
              <i v-show="item.type === 0?true:false" class="icon iconfont" style="color:#EBB021">&#xe68b;</i><!--图片-->
              <i v-show="item.type === 1?true:false" class="icon iconfont" style="color:#345e9e">&#xe65d;</i><!--word-->
              <i v-show="item.type === 2?true:false" class="icon iconfont" style="color:#389850">&#xe693;</i><!--excel-->
              <i v-show="item.type === 3?true:false" class="icon iconfont" style="color:#dc2e1b">&#xe691;</i><!--pdf-->
              <span class="picName" :title="item.name">{{ item.name }}</span>
            </p>
            <i class="el-icon-view" @click="handlePreview(item)" />
            <i class="el-icon-close" @click="handleRemove(item.id)" />
          </div>
          <img v-show="(item.type === 0&&item.active)?true:false" class="smallImg" :src="item.url" alt="">
        </li>
      </ul>
    </div>
    <!--弹窗-->
    <div v-show="ifImg" class="cl-image-viewer">
      <div class="cl-image-viewer__mask" @click="ifImg=false" />
      <img :src="curSrc" alt="">
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="dialogVisible">
      <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100" />
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import { FileDelete } from "@/api/upload"
  import { getDictionaryOption } from "@/utils/permission"

 export default {
  name: 'Upload',
  data() {
    return {
      option:[
        {label:'身份证',value:'1'},
        {label:'居住证',value:'2'}
      ],
      certificates:'1',
      upUrl: '',
      dialogVisible: false,
      iframeUrl: '',
      clientHeight: '',
      ifImg: false,
      curSrc: '',
      curPdfSrc: '',
      fileList: [],
      headers: {
        Authorization: ''
      },
    }
  },
  watch: {
    certificates() {
      this.upUrl = this.baseUrl + '/api/Files/Upload?FileType=' + this.certificates
    }
  },
  mounted() {
    this.headers.Authorization = getToken()
    this.clientHeight = document.documentElement.clientHeight
    window.onresize = function temp() {
      this.clientHeight = document.documentElement.clientHeight
    }
    this.upUrl = this.baseUrl + '/api/Files/Upload?FileType=' + this.certificates

  },
  methods: {
    handleRemove(id) { // 删除文件
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].id === id) {
          this.fileList.splice(i, 1)
        }
      }
      FileDelete({id:id}).then(res => {
        if(res.code==0){
          this.$message({
            message: res.message,
            type: 'success'
          });
        }else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })

    },
    handlePreview(file) { // 点击文件列表中已上传的文件时的事件
      const type = file.type
      switch (type) { // 0.图片，1word,2excel,3pdf
        case 0:
          this.curSrc = file.url
          this.ifImg = true
          break
        case 1:
          this.dialogVisible = true
          this.iframeUrl = file.url
          break
        case 2:
          this.dialogVisible = true
          this.iframeUrl = file.url
          break
        case 3:
          this.dialogVisible = true
          this.iframeUrl = file.url
          break
      }
    },
    handleExceed(files, fileList) { // 文件超出上传个数事件
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeAvatarUpload(file) { // 上传限制
      const isLt5M = file.size / 1024 / 1024 < 10
      if (!isLt5M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'error'
        })
        return false
      }
      return isLt5M
    },
    uploadSuccess(response, file) { // 上传成功
      let data= response.data;
      const Suffix = data.FileExtName.split('.')[1]
      if (Suffix === 'docx' || Suffix === 'doc') {
        file.type = 1
      } else if (Suffix === 'xlsx' || Suffix === 'xls') {
        file.type = 2
      } else if (Suffix === 'pdf') {
        file.type = 3
      }else {
        file.type = 0
      }
      file.name = data.FileName
      file.id = data.Id
      file.url = this.baseUrl + (data.RelativePath).replace("~","")
      this.fileList.push(file)
      this.$emit('getFileFun', this.fileList)
    },
    selectStyle(item) {
      const _this = this
      this.$nextTick(function() {
        this.fileList.forEach(function(item) {
          _this.$set(item, 'active', false)
        })
        this.$set(item, 'active', true)
      })
    },
    outStyle(item) {
      this.$set(item, 'active', false)
    },
    /**
     * 获取已保存附件信息回填预览列表
     * */
    setFiles(data) {
      let obj = {}
      this.fileList = []
      for(let i=0;i<data.length;i++){
        let thisType;
        const Suffix = data[i].FileExtName.split('.')[1]
        if (Suffix === 'docx' || Suffix === 'doc') {
          thisType = 1
        } else if (Suffix === 'xlsx' || Suffix === 'xls') {
          thisType = 2
        } else if (Suffix === 'pdf') {
          thisType = 3
        }else {
          thisType = 0
        }
        obj = {
          id: data[i].Id,
          name:data[i].FileName,
          type: thisType,
          url:this.baseUrl + (data[i].RelativePath).replace("~",""),
        }
        this.fileList.push(obj)
      }
      this.$emit('getFileFun', this.fileList)
    }
  }
}
</script>
<style lang="scss">
  .uploadBox{
    .el-button--small{font-size: 14px;}
    .uploadPart{position: relative}
    .dragging{
      border-left: dashed 1px #fbdb14;
      padding:0 10px;
    }
    .uploadFile{
      width: 206px;
      height: 144px;
      text-align: center;
      border: dashed 1px #ddd;
      padding: 30px 0;
      .el-upload__tip{
        line-height: 20px;text-align: left;color: #8A9299;padding:0 5px;margin-top: 10px;
      }
    }
    .uploadList{
      width: calc(100% - 220px);
      border: solid 1px #ddd;
      height: 144px;
      overflow: auto;
      position: absolute;
      top: 0px;
      margin: 0;
      left: 220px;
      li{
        font-size: 16px;
        cursor: pointer;
        position: relative;
        >div{position: relative;border-bottom: solid 1px #eee;margin: 0;padding: 0px;
          >p{margin: 0;display: inline-block;width: 100%;position: relative;line-height: 17px;}
        }
        padding: 0 15px;
        list-style-type: none;
        .el-icon-view{position: absolute;right: 25px;top:9px;cursor: pointer;}
        .el-icon-close{display: block;top:9px;}
        .picName{display: inline-block;width: 80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}
      }
      .smallImg{
        width: 80px;height: 80px;
      }
    }
    .cl-image-viewer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      height: 100%;
      text-align: center;
      .el-image-viewer__canvas{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img{
        max-height: 100%; max-width: 100%;
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .cl-image-viewer__mask{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: .5;
      background: #000;
      cursor: pointer;
    }
    .el-dialog__header{
      background-color:#fff !important;
    }
    .el-dialog__close{
      color: #333 !important;font-size: 24px;
    }
  }

</style>
