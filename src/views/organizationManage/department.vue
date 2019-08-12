<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">部门：</label>
              <el-input
                v-model="department"
                placeholder="部门（长度10以内）"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4">
            <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button>
          </el-col>
        </el-row>
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="success" size="small" class="cl-search" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          <el-button type="primary" size="small" class="cl-search cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
        </div>
        <customTable ref="myChild" />
      </div>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border>
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
        />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            :key="index"
            :min-width="item.width"
            :prop="item.prop"
            :align="item.position"
            :label="item.text"
          />
        </template>
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.$index, scope.row)">编辑</a>
            <a class="operation2" @click="handleDelete(scope.$index, scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="searchFun"
      />
    </div>

    <!--编辑或新增窗口 s-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="22%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="部门:" prop="newDertmentName">
          <el-input
            v-model="ruleForm.newDertmentName"
            placeholder="请输入部门名称"
            maxlength="20"
            size="small"
          />
        </el-form-item>
        <p class="footBox dialogFooter">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
        </p>
      </el-form>
    </el-dialog>
    <!--编辑或新增窗口 e-->
    <!--警告信息 s-->
    <el-dialog
      title="提示"
      class="warningBox"
      :visible.sync="warnVisible"
      width="20%"
    >
      <p class="warnInfo">
        <i class="icon iconfont icontishixunwen" /> 是否删除当前信息？
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="deleteFun">确 定</el-button>
        <el-button size="small" @click="warnVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--警告信息 e-->
  </div>
</template>

<script>
  import '../../styles/organization.scss'
  import customTable from '../../components/CustomTable/index'
  import Pagination from '../../components/Pagination/index'
  import { GetList, Add, UpDate, Delete } from "@/api/organize"
  let ID = '',editObj = {};
  export default {
    name: 'Department',
    components: { customTable, Pagination },
    data() {
      return {
        tableHeight: '',
        warnVisible: false,
        dialogVisible: false,
        title: '',
        total: 0,
        page: 1,
        limit: 10,
        department: '',
        ruleForm: {
          newDertmentName: ''
        },
        rules: {
          newDertmentName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        tableData: [],
        checkAllData: [// 所有列可选项
          { checked: true, text: '部门', prop: 'DeptName', position: 'center', width: '200px' },
          { checked: true, text: '操作人', prop: 'EditUser', position: 'center', width: '200px' },
          { checked: false, text: '操作时间', prop: 'DataState', position: 'center', width: '200px' },
        ],
        checksData: [],
        customHeight: ''
      }
    },
    computed: {
      tableHead: function() {
        const arrayHead = []
        const data = this.checksData
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].checked) {
            arrayHead.push(data[i])
          }
        }
        return arrayHead
      }
    },
    watch: {
      customHeight() {
        this.$nextTick(() => {
          this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        })
      }
    },
    mounted() {
      this.$refs.myChild.checkData = this.checkAllData//先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50

      this.searchFun()
    },
    methods: {
      /**
       * 表格自定义
       * */
      setCustomData() {
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      /**
       * 导出
       * */
      exportExcel() {
        alert('导出')
      },
      /**
       * 编辑及新增
       * */
      handleEdit(scope,row) {
        editObj = row
        this.dialogVisible = true
        this.title = '编辑'
        this.ruleForm.newDertmentName = row.DeptName
      },
      addNewFun() {
        this.dialogVisible = true
        this.title = '添加'
        this.ruleForm.newDertmentName = ''
      },
      /**
       * 删除
       * */
      handleDelete(scope,row) {
        ID = row.Id
        this.warnVisible = true
      },
      deleteFun() {
        this.warnVisible = false
        let params = { Id: ID }
        Delete(params).then(res => {
          if (res.code ==0 ) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.dialogVisible = false
            this.searchFun()
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        })
      },
      /**
       * 查询
       * */
      searchFun() {
        let dp = {
          page: this.page,
          limit: this.limit,
          DeptName: this.department
        }
        GetList(dp).then(res => {
          this.total = res.count;
          this.tableData = res.data;
        })
      },
      /**
       * 编辑新增保存
       * */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              let params = { Id: editObj.Id, DeptName: this.ruleForm.newDertmentName }
              UpDate(params).then(res => {
                 if (res.code ==0 ) {
                   this.$message({
                     message: res.message,
                     type: 'success'
                   });
                   this.dialogVisible = false
                   this.$refs[formName].resetFields();
                   this.searchFun()
                 } else {
                   this.$message({
                     message: res.message,
                     type: 'warning'
                   });
                 }
              })
            } else {
              let params = { deptName: this.ruleForm.newDertmentName }
              Add(params).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: 'success'
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  });
                }
              })
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName){
        this.dialogVisible = false;
        this.ruleForm.newDertmentName = ''
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
