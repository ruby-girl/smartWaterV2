<template>
  <div class="cl-container cl-container3">
    <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="人员编号:">
              <span>{{ruleForm.code}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="人员名称:">
              <span>{{ruleForm.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="公司:">
              <span>{{ruleForm.company}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="水厂:">
              <span>{{ruleForm.waterworks}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="部门:">
              <span>{{ruleForm.department}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="岗位:">
              <span>{{ruleForm.post}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="性别:">
             <span>{{ruleForm.sex}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="出生日期:">
              <span>{{ruleForm.birthday}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="电话号码:">
              <span>{{ruleForm.phone}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="身份证号:">
              <span>{{ruleForm.id}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="入职时间:">
             <span> {{ruleForm.entryTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="岗位状态:">
              <span>{{ruleForm.status}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="地址:">
             <span>{{ruleForm.adress}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="附件:">
              <span>{{ruleForm.Certificates}}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item>
              <ul class="fileBox clearfix">
                <li v-for="(item,index) in ruleForm.file" :key="index">
                  <p v-show="item.type === 0?true:false"><img :src="item.url"></p>
                  <p v-show="item.type === 1?true:false"><span class="icon iconfont" style="color:#345e9e;font-size: 60px;">&#xe65d;</span></p>
                  <p v-show="item.type === 2?true:false"><span class="icon iconfont" style="color:#389850;font-size: 60px;">&#xe693;</span></p>
                  <p v-show="item.type === 3?true:false"><span class="icon iconfont" style="color:#dc2e1b;font-size: 60px;">&#xe691;</span></p>
                  <i @click="handlePreview(item)" >{{item.name}}</i>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

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
import '../../styles/organization.scss'
export default {
  name: 'PeopleDetail',
  data() {
    return {
      ruleForm: {
        code: '12312312',
        name: '长大强',
        company: 'XX公司',
        waterworks: 'xx水厂',
        department: 'xx部门',
        post: 'xx岗位',
        sex: '男',
        birthday: '2112-12-12',
        phone: '12323678',
        id: '23',
        entryTime: '2012-2-1',
        status: '在职',
        adress: '啊u嘿哈韦哈尔u和覅我和覅文化',
        Certificates: '二五',
        file: [
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
        ]
      },
      curSrc: '',
      ifImg: '',
      dialogVisible: false,
      iframeUrl: '',
      clientHeight: ''
    }
  },
  methods: {
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
    }
  },
  mounted() {
    this.clientHeight = document.documentElement.clientHeight
    window.onresize = function temp() {
      this.clientHeight = document.documentElement.clientHeight
    }
  }
}
</script>
