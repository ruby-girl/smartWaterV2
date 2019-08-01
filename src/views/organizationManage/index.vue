<template>
  <div style="margin: 20px;">
    <div
      style="padding:0 30px;border: solid 1px #eee;margin-bottom: 20px;background: #ffffe7;border: solid 1px #fbdb14;line-height: 50px;height: 50px;
    color: #8b8c89;font-size: 14px;"
    >
      <span style="display: inline-block;float: left">自定义选项：</span>
      <div style="float: left">
        <el-checkbox v-for="check in checkData" :key="check.text" v-model="check.checked" v-dragging="{ item: check, list: checkData, group: 'check' }">{{ check.text }}</el-checkbox>
      </div>
      <el-button type="primary" size="mini" plain style="float: right;margin-top: 10px;cursor: pointer" @click="sureFun()">确定</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" height="300" border>
      <el-table-column
        type="selection"
        width="55"
      />
      <template v-for="(item ,index) in tableDataHead">
        <el-table-column
          min-width="200px"
          :key="index"
          :prop="item.prop"
          :align="item.position"
          sortable
          :label="item.text"
        />
      </template>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px;width: 100%;position: relative">
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
        <li v-for="item in fileList" tabindex="0" class="el-upload-list__item is-success">
          <div>
            <p @mouseover="selectStyle (item)" @mouseout="outStyle(item)">
              <i v-show="item.type === 0?true:false" class="el-icon-picture" /><!--图片-->
              <i v-show="item.type === 1?true:false" class="el-icon-document" /><!--word-->
              <i v-show="item.type === 2?true:false" class="el-icon-picture-outline" /><!--excel-->
              <i v-show="item.type === 3?true:false" class="el-icon-goods" /><!--pdf-->
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
    name: 'OrganizationManage',
    data() {
      return {
        dialogVisible:false,
        iframeUrl:'',
        clientHeight:'',
        ifImg: false,
        checkData: [// 所有列可选项
          { checked: true, text: '日期', prop: 'date', position: 'left' },
          { checked: true, text: '姓名', prop: 'name', position: 'left' },
          { checked: false, text: '地址', prop: 'address', position: 'left' },
          { checked: false, text: '年龄', prop: 'age', position: 'left' },
          { checked: false, text: '性别', prop: 'sex', position: 'left' },
          { checked: false, text: '身高', prop: 'height', position: 'left' }
        ],
        tableDataHead: [],
        tableData: [
          {
            date: '2012-10-30',
            name: ' 机库顶',
            address: '新世纪欧式党纪国法',
            age: '12',
            sex: '女',
            height: '120'
          },
          {
            date: '2012-10-31',
            name: ' 西涵涵',
            address: '第三个根本不被覆盖不是多',
            age: '13',
            sex: '男',
            height: '130'
          }
        ],
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
        curSrc: '',
        curPdfSrc: ''
      }
    },
    methods: {
      sureFun() { // 自定义表格
        this.tableDataHead = []
        const data = this.checkData
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].checked) {
            this.tableDataHead.push(data[i])
          }
        }
      },
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
      this.$dragging.$on('dragged', ({ value }) => {})
      this.sureFun()
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
