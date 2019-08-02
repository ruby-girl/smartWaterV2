<template>
    <div>
      <div>
        <el-upload
          ref="foreignPersonUploadItem"
          class="upload-demo uploadFile"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
          :limit="10"
          :show-file-list="false"
          :on-exceed="handleExceed"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.JPG,.JPEG,.PDF,.DOC,.DOCX,.XLS,.XLSX"
          :file-list="fileList"
        >
          <el-button size="small" type="primary"><i class="el-icon-upload2" /> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">可选择jpg/png/word/excel/pdf格式，每张图片大小限制为10M内</div>
        </el-upload>

        <ul class="uploadList el-upload-list el-upload-list--text">
          <li v-for="(item,index) in fileList" tabindex="0" :key="index" class="el-upload-list__item is-success">
            <div>
              <p @mouseover="selectStyle (item)" @mouseout="outStyle(item)">
                <i v-show="item.type === 0?true:false" class="icon iconfont" style="color:#EBB021">&#xe68b;</i><!--图片-->
                <i v-show="item.type === 1?true:false" class="icon iconfont" style="color:#345e9e">&#xe65d;</i><!--word-->
                <i v-show="item.type === 2?true:false" class="icon iconfont" style="color:#389850">&#xe693;</i><!--excel-->
                <i v-show="item.type === 3?true:false" class="icon iconfont" style="color:#dc2e1b">&#xe691;</i><!--pdf-->
                <span>{{ item.name }}</span>
              </p>
              <i class="el-icon-view" @click="handlePreview(item)" />
              <i class="el-icon-close" @click="handleRemove(item)" />
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
        <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100"></iframe>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data(){
      return {
        dialogVisible:false,
        iframeUrl:'',
        clientHeight:'',
        ifImg: false,
        curSrc: '',
        curPdfSrc: '',
        fileList: [// 上传后文件
          {
            name: 'city.jpeg',
            type: 0,
            url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg' },
          {
            name: 'sds1.xls',
            type: 2,
            url: 'https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls'
          },
          {
            name: 'PlayerAPI_v1.0.6.pdf',
            type: 3,
            url: 'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf'
          }
        ],
      }
    },
    methods:{
      handleRemove(file) { // 删除文件
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].uid == file.uid) {
            this.fileList.splice(i, 1)
          }
        }
      },
      handlePreview(file) { // 点击文件列表中已上传的文件时的事件
        const type = file.type
        switch (type) { // 0.图片，1word,2excel,3pdf
          case 0:
            this.curSrc = file.url
            this.ifImg = true
            break
          case 1:
            // window.open(file.url, '_blank')
            this.dialogVisible = true;
            this.iframeUrl = file.url;
            break
          case 2:
            // window.open(file.url, '_blank')
            this.dialogVisible = true;
            this.iframeUrl = file.url;
            break
          case 3:
            //window.open(file.url, '_blank')
            this.dialogVisible = true;
            this.iframeUrl = file.url;
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
      uploadSuccess(response, file, fileLis) { // 上传成功
        const Suffix = file.name.split('.')[1]
        if (Suffix == 'docx' || Suffix == 'doc') {
          file.type = 1
        } else if (Suffix == 'xlsx' || Suffix == 'xls') {
          file.type = 2
        } else if (Suffix == 'pdf') {
          file.type = 3
        }
        this.fileList.push(file)
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
      }
    },
    mounted() {
      this.clientHeight = document.documentElement.clientHeight;
      window.onresize = function temp() {
        this.clientHeight = document.documentElement.clientHeight;
      };
    }
  }
</script>
<style lang="scss">
  .dragging{
    border-left: dashed 1px #fbdb14;
    padding:0 10px;
  }
  .uploadFile{
    width: 250px;
    height: 200px;
    text-align: center;
    border: dashed 1px #ddd;
    padding: 50px 20px;
    .el-upload__tip{
      line-height: 20px;text-align: left;
    }
    /* .el-upload-list{
       .el-upload-list__item-name{text-align: left;}
       .el-upload-list__item{border-bottom: solid 1px #eee;}
       position: absolute;
       top: 0px;
       left: 270px;
       border: solid 1px #ddd;
       height: 200px;
       overflow: auto;
       width: calc(100% - 270px);
     }*/
  }
  .uploadList{
    width: calc(100% - 270px);
    border: solid 1px #ddd;
    height: 200px;
    overflow: auto;
    position: absolute;
    top: 0px;
    margin: 0;
    left: 270px;
    li{
      font-size: 16px;
      cursor: pointer;
      position: relative;
      >div{position: relative;border-bottom: solid 1px #eee;margin: 0;padding: 5px;
        >p{margin: 0;display: inline-block;}
      }
      padding: 0 15px;
      list-style-type: none;
      .el-icon-view{position: absolute;right: 25px;top:9px;cursor: pointer;}
      .el-icon-close{display: block;top:9px;}
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

</style>
