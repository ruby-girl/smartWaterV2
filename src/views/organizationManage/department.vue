<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <el-row>
          <el-col :xs="15" :sm="8" :md="8" :lg="6" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">部门：</label>
              <el-input
                v-model.trim="dp.DeptName"
                placeholder="请输入部门名称"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col :xs="15" :sm="8" :md="8" :lg="6" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">操作人：</label>
              <el-select v-model="dp.createUserId" placeholder="请选择" size="small">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="10" :xl="7">
            <div class="cl-inlineItem" style="width: 100%">
              <label class="cl-label">操作时间：</label>
              <el-date-picker
                v-model="createStartTimes"
                style="width: 83%"
                size="small"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="getTime1"
              />
            </div>
          </el-col>
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
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
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          fixed="left"
        />
        <template v-for="(item ,index) in tableHead" >
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            align="center"
            :label="item.ColDesc"
            :fixed= "item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            align="center"
            :label="item.ColDesc"
          />
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
    </div>
    <!--编辑或新增窗口 s-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="部门:" prop="newDertmentName">
          <el-input
            v-model.trim="ruleForm.newDertmentName"
            placeholder="请输入部门名称"
            maxlength="10"
            size="small"
            style="width: 250px"
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
  import { GetList, Add, UpDate, Delete, GetList_Execl } from "@/api/organize"
  import { GetLoginNameList } from "@/api/user"
  let ID = '',editObj = {};
  import { parseTime } from "@/utils/index"

  export default {
    name: 'department',
    components: { customTable, Pagination },
    data() {
      return {
        operatorArray:[],
        tableHeight: null,
        warnVisible: false,
        dialogVisible: false,
        title: '',
        total: 0,
        createStartTimes:[],
        dp: {
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          DeptName: '',
          createUserId: '-1',
          createStartTime: '',
          createEndTime: '',
          tableId: '0000001'
        },
        ruleForm: {
          newDertmentName: ''
        },
        rules: {
          newDertmentName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        tableData: [],
        checkAllData: [],
        checksData: [],
        customHeight: ''
      }
    },
    computed: {
      tableHead: function() {
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
      customHeight() {
        let self = this
        self.$nextTick(() => {
          self.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        })
      }
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
        GetList_Execl(this.dp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
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
        GetList(this.dp).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
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
      },
      getTime1(data) {
        if(data !=null){
          this.dp.createStartTime = data[0]
          this.dp.createEndTime = data[1]
        }else{
          this.dp.createStartTime = ''
          this.dp.createEndTime = ''
        }
      },
      /**
       * 获取操作人信息
       * */
      GetLoginNameList() {
        GetLoginNameList().then(res => {
          if (res.code ==0 ) {
            this.operatorArray = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        })
      },
      /**
       * 排序
       * */
      sortChanges({prop, order }){
        this.dp.filed = prop
        this.dp.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.dp.page = 1
          this.searchFun()
        }
      }
    },
    mounted() {
      let start = parseTime(new Date());
      let end = parseTime(new Date());
      this.createStartTimes.push(new Date(start));
      this.createStartTimes.push(new Date(end));

      this.GetLoginNameList()
      this.$refs.myChild.GetTable(this.dp.tableId);
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    }
  }
</script>
