<template>
  <el-dialog
    :close-on-click-modal="false"
    top="30vh"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="400px">
    <el-form ref="jp" :model="jp" label-width="80px" class="demo-jp">
      <el-form-item label="部门 " prop="DeptName">
        <el-input
          v-model.trim="jp.DeptName"
          placeholder="长度1-10内"
          maxlength="10"
          size="small"
          style="width: 230px"/>
      </el-form-item>
      <p style="width: 100%;background: #F7F7F7;height: 10px;" v-show="title=='编辑'"></p>
      <el-button v-show="title=='编辑'" type="primary" icon="el-icon-plus" size="mini" style="margin-bottom: 30px;" @click="addPost">添加职位</el-button>

      <div style="max-height:220px;overflow: auto">
        <el-form-item v-show="title=='编辑'" label="职位" v-for="(item,index) in jp.JobNameList" :key="index">
          <el-input
            v-model.trim="item.JobName"
            placeholder="请输入岗位名称"
            maxlength="10"
            size="small"
            style="width: 180px"/>
          <label class="el-icon-close" style="color: #777C82;margin-left: 3px;cursor: pointer;"
                 @click="deletePost(index)"></label>
        </el-form-item>
      </div>
      <p class="footBox dialogFooter">
        <el-button type="primary" size="mini" @click="submitForm('jp')">确 定</el-button>
        <el-button size="mini" @click="resetForm('jp')">取 消</el-button>
      </p>
    </el-form>
  </el-dialog>
</template>

<script>
  import { promptInfoFun } from "@/utils/index";
  import { Add, UpDate } from "@/api/organize"

  export default {
    name: "AddOrEdit",
    data() {
      return {
        title:'',
        dialogVisible: false,//编辑或新增弹窗标识
        jp: {
          Id: "",
          DeptName: "",
          JobNameList: []
        }
      }
    },
    methods:{
      submitForm(formName) {//编辑及新增保存方法
        if(this.jp.DeptName.trim()==''){
          promptInfoFun(this, 1, '部门名称不能为空！');
          return false
        }
        if (this.title === '编辑') {
          let posts = this.jp.JobNameList
          if(posts.length > 0){
            posts.forEach(item=>{
              if(item.JobName.trim()==''){
                promptInfoFun(this, 1, '岗位名称不能为空！');
                return false
              }
            })
          }
          UpDate(this.jp).then(res => {
            if (res.code == 0) {
              promptInfoFun(this, 2, res.message);
              this.dialogVisible = false
              this.$refs[formName].resetFields();
              this.$parent.searchFun()
            } else {
              promptInfoFun(this, 1, res.message);
            }
          })
        } else {
          Add(this.jp).then(res => {
            if (res.code == 0) {
              promptInfoFun(this, 2, res.message);
              this.dialogVisible = false
              this.$refs[formName].resetFields();
              this.$parent.searchFun()
            } else {
              promptInfoFun(this, 1, res.message);
            }
          })
        }
      },
      resetForm(){//表格重置
        this.dialogVisible = false;
        this.jp.DeptName = ''
        this.jp.JobNameList =  {
          Id: "",
          JobName: ""
        }
      },
      handleClose(){//新增或编辑弹窗关闭事件
        this.dialogVisible = false;
        this.jp.DeptName = ''
        this.jp.JobNameList =  {
          Id: "",
          JobName: ""
        }
      },
      deletePost(index){//删除岗位
        this.jp.JobNameList.splice(index,1)
      },
      addPost(){//增加岗位
        this.jp.JobNameList.push({
          Id: "",
          JobName: ""
        })
      }
    }
  }
</script>
