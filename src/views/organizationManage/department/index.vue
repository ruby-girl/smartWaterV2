<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <!--查询条件组建 s-->
        <SelectHead ref="selectChild"></SelectHead>
        <!--查询条件组建 e-->
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
          <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
        </div>
        <!--表格自定义组建 s-->
        <customTable ref="myChild" />
        <!--表格自定义组建 e-->
      </div>
      <!--列表数据 s-->
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          fixed="left"/>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze"/>
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"/>
        </template>
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.$index, scope.row)">编辑</a>
            <a class="operation2" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.isDelete">删除</a>
            <el-tooltip v-else effect="dark" content="部门已关联岗位，不可删除" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;">删除</a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="dp.page"
        :limit.sync="dp.limit"
        @pagination="searchFun"
      />
      <!--列表数据 e-->
    </div>
    <!--编辑或新增窗口 s-->
    <el-dialog
      :close-on-click-modal="false"
      top="30vh"
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="400px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="部门:" prop="newDertmentName">
          <el-input
            v-model.trim="ruleForm.newDertmentName"
            placeholder="请输入部门名称"
            maxlength="10"
            size="small"
            style="width: 250px"/>
        </el-form-item>
        <p class="footBox dialogFooter">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
        </p>
      </el-form>
    </el-dialog>
    <!--编辑或新增窗口 e-->
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import customTable from '@/components/CustomTable/index'//自定义表格组建
  import SelectHead from './components/SelectHead'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页组建
  import { GetList, Add, UpDate, Delete, GetList_Execl } from "@/api/organize"//http 请求方法
  import { parseTime } from "@/utils/index"
  let editObj = {};//编辑需要用到的全局变量

  export default {
    name: 'department',
    components: { SelectHead, customTable, Pagination },
    data() {
      return {
        tableHeight: null,//表格高度
        dialogVisible: false,//编辑或新增弹窗标识
        title: '',//编辑或新增弹窗标题
        total: 0,//分页总条数
        dp: {//查询条件对象
           page: 1,
           limit: 10,
           filed:'',
           sort:"",
           DeptName: '',
           editUserId: '-1',//操作者
           editStartTime: '',//操作开始结束时间
           editEndTime: '',
           tableId: '0000001'
         },
        ruleForm: {//新增或编辑操作对象
          newDertmentName: ''
        },
        rules: {
          newDertmentName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        tableData: [],//列表数据
        checkAllData: [],
        checksData: [],//自定义字段中选中了字段
        customHeight: ''//自定义字段模块高度
      }
    },
    computed: {
      tableHead: function() {//获取表头信息
        const arrayHead = []
        const data = this.checksData
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].IsCheck) {
            arrayHead.push(data[i])
          }
        }
        return arrayHead
      }
    },
    watch: {
      customHeight() {//自定义模块高度
        let self = this
        self.$nextTick(() => {
          self.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        })
      }
    },
    methods: {
      setCustomData() {//表格自定义
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom//给子组件变量赋值
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        GetList_Execl(this.dp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(scope,row) {//编辑方法
        editObj = row
        this.dialogVisible = true
        this.title = '编辑'
        this.ruleForm.newDertmentName = row.DeptName
      },
      addNewFun() {//新增方法
        this.dialogVisible = true
        this.title = '添加'
        this.ruleForm.newDertmentName = ''
      },
      handleDelete(scope,row) {//删除方法
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          Delete({ Id: row.Id }).then(res => {
            if (res.code ==0 ) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              });
              this.dialogVisible = false
              this.searchFun()
            } else {
              this.$message({
                message: res.message,
                type: 'warning',
                duration: 4000
              });
            }
          })
        });
      },
      searchFun() {//查询方法
        GetList(this.dp).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      submitForm(formName) {//编辑及新增保存方法
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              let params = { Id: editObj.Id, DeptName: this.ruleForm.newDertmentName }
              UpDate(params).then(res => {
                if (res.code ==0 ) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 4000
                  });
                }
              })
            } else {
              let params = { deptName: this.ruleForm.newDertmentName }
              Add(params).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 4000
                  });
                }
              })
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName){//表格重置
        this.dialogVisible = false;
        this.ruleForm.newDertmentName = ''
        this.$refs[formName].resetFields();
      },
      handleClose(){//新增或编辑弹窗关闭事件
        this.dialogVisible = false;
        this.ruleForm.newDertmentName = ''
        this.$refs['ruleForm'].resetFields();
      },
      sortChanges({prop, order }){//列表排序方法
        this.dp.filed = prop
        this.dp.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.dp.page = 1
          this.searchFun()
        }
      }
    },
    mounted() {
      this.$refs.myChild.GetTable(this.dp.tableId);//调用子组件方法获取表头信息
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    }
  }
</script>
