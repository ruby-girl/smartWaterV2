<template>
  <el-dialog
    class="cl_addDialog"
    :close-on-click-modal="false"
    top="0vh"
    title="添加"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="50%">
    <!--用户资料-->

    <div class="user_information">
      <h3 class="add_title"><i></i>用户资料</h3>
      <el-form :inline="true" ref="ruleForm" :model="rb" :rules="rules" label-width="100px">
      <el-form-item label="水厂：" prop="BookName">
        <el-input v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="用户编码：" prop="BookName">
        <el-input :disabled="true" v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="姓名：" prop="BookName">
        <el-input v-model.trim="rb.BookName" placeholder="长度（1-30）" max-length="30" size="small"/>
      </el-form-item>
      <el-form-item label="简码：" prop="BookName">
        <el-input :disabled="true" v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="电话：" >
        <el-input v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="人口：" prop="BookName">
        <el-input v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="用户类型：" prop="BookName">
        <el-select v-model="rb.BookName" placeholder="请选择" size="small">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
          <el-option label="简码" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号：" >
        <el-input v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="区域：" prop="BookName" class="cl_allLine">
        <p v-model="rb.BookName" @click="setAreaFun" class="areaInput"> <i :class="ifArea?'el-icon-arrow-up':'el-icon-arrow-down'" style="float: right; margin-top: 7px;color: #C0C4CC"></i></p>
        <AreaTree :areaTreeData = areaTreeData v-show="ifArea" @click="getArea"></AreaTree>
      </el-form-item>
      <el-form-item label="用水性质：" prop="BookName">
        <el-select v-model="rb.BookName" placeholder="请选择" size="small">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
          <el-option label="简码" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表册：">
        <el-select v-model="rb.BookName" placeholder="请选择" size="small">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
          <el-option label="简码" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="纳税人识别号：" prop="BookName" label-width="110px">
        <el-input v-model.trim="rb.BookName" size="small"/>
      </el-form-item>
      <el-form-item label="地址：" class="cl_allArea">
        <el-input type="textarea" v-model="adress" max-length="500" @input="descInput(1)" rows="1"></el-input>
        <span>{{adressRemnant}}/500</span>
      </el-form-item>
      <el-form-item label="备注：" class="cl_allArea">
        <el-input type="textarea" v-model="remark" max-length="500" @input="descInput(2)"></el-input>
        <span>{{remarkRemnant}}/500</span>
      </el-form-item>
    </el-form>
    </div>
    <!--水表信息-->
    <div class="user_information">
      <h3 class="add_title"><i></i>水表信息</h3>
      <el-form :inline="true" ref="ruleForm" :model="rb" :rules="rules" label-width="100px">
        <el-form-item label="水表编号：" prop="BookName">
          <el-input v-model.trim="rb.BookName" size="small"/>
        </el-form-item>
        <el-form-item label="水表样式：">
          <el-select v-model="rb.BookName" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水表口径：" prop="BookName">
          <el-select v-model="rb.BookName" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始读书：">
          <el-input v-model.trim="rb.BookName" size="small"/>
        </el-form-item>
        <el-form-item label="安装位置：" class="cl_allArea">
          <el-input type="textarea" v-model="adress" max-length="500" @input="descInput(1)" rows="1"></el-input>
          <span>{{adressRemnant}}/500</span>
        </el-form-item>
        <el-form-item label="备注：" class="cl_allArea">
          <el-input type="textarea" v-model="remark" max-length="500" @input="descInput(2)"></el-input>
          <span>{{remarkRemnant}}/500</span>
        </el-form-item>
      </el-form>
    </div>
    <!--附件信息-->
    <div class="user_information">
      <h3 class="add_title"><i></i>附件信息</h3>
      <el-form :inline="true" ref="jp" :model="jp" :rules="rules" label-width="100px">
        <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
      </el-form>
    </div>
    <el-checkbox v-model="ifGoOn">勾选后继续添加</el-checkbox>
    <p style="text-align: center">
      <el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交审核/确定</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
    </p>
  </el-dialog>
</template>

<script>
  import { registerAdd, registerUpDate } from "@/api/registerBook"
  import { getDictionaryOption } from "@/utils/permission"
  import { promptInfoFun } from "@/utils/index"
  import AreaTree from './AreaTree'
  import uploadBox from '@/components/Upload'

  export default {
    name: "AddDialog",
    components: { AreaTree, uploadBox },
    data() {
      return {
        ifGoOn:false,//是否继续添加
        ifArea:false,//区域下拉是否显示
        dialogVisible: true,
        rb:{
          BookName:''
        },
        rules: {
          BookName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        areaTreeData:[],//区域数据
        adressRemnant:0,//剩余字数
        remarkRemnant:0,//剩余字数
        adress:'',
        remark:'',
        upload: {//上传文件集合
          file: []
        },
      }
    },
    methods: {
      submitForm(formName) {//编辑新增保存事件
        this.$refs[formName].validate((valid) => {
          if (valid) {
          } else {
            return false
          }
        })
      },
      resetForm(formName){//取消时初始化表单信息
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
      },
      handleClose(){//弹窗关闭初始化表单信息
        this.resetForm('ruleForm')
      },
      getArea(){//选择区域数据回填
        this.ifArea = true
      },
      setAreaFun(){//模拟下拉显示区域数据
        this.ifArea = !this.ifArea
      },
      descInput(num){
        num==1 ? this.adressRemnant = this.adress.length : this.remarkRemnant = this.remark.length

      },
      getFileFun(data) {//获取上传文件信息
        this.upload.file = data
      },
    },
    mounted() {

    }
  }
</script>
<style lang="scss">
  .cl_addDialog{
    .el-form--inline .el-form-item{margin-bottom: 15px;}
    .el-dialog{ background: #F5F5F5;}
    .el-form-item__content { width: calc(100% - 130px);}
  .cl_allLine {
    position: relative; width: 100%;
    .areaInput{width: 100%;height: 32px;line-height: 32px;border: solid 1px #D8E2E7;border-radius: 5px;margin: 0;cursor: pointer;padding: 0 10px 0 15px;position: relative;}
  }
  .cl_allArea {
    width: 100%;
    span{position: absolute;right: 10px;bottom: 0;color: #C0C8CC;font-size: 13px;}
   }
   .user_information{background: #fff;
   .add_title{font: bold 16px 'Microsoft-YaHei';color: #5B5B5B;padding: 0 15px;padding-top: 18px;
   i{display: inline-block;width: 4px;background: #29BEB0;height: 18px;margin-right: 5px; vertical-align: middle;margin-top: -4px;}}
   }

  }
</style>
