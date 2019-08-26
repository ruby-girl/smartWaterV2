<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <el-row>
          <el-col :xs="15" :sm="8" :md="6" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">部门：</label>
              <el-select v-model="jp.SYS_Department_Id" placeholder="请选择" size="small">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in postArray" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="15" :sm="8" :md="6" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">岗位：</label>
              <el-input
                v-model="jp.JobName"
                placeholder="请输入岗位名称"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col :xs="15" :sm="8" :md="6" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">操作人：</label>
              <el-select v-model="jp.createUserId" placeholder="请选择" size="small">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="18" :sm="12" :md="12" :lg="7" :xl="7">
            <div class="cl-inlineItem" style="width: 100%">
              <label class="cl-label">操作时间：</label>
              <el-date-picker
                v-model="createStartTimes"
                style="width: 83%"
                size="small"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                format="yyyy-MM-dd"
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
        <template v-for="(item ,index) in tableHead">
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
            <el-tooltip v-else effect="dark" content="岗位已关联人员，不可删除" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;">删除</a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="jp.page"
        :limit.sync="jp.limit"
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
        <el-form-item label="部门:" prop="SYS_Department_Id">
          <el-select v-model="ruleForm.SYS_Department_Id" placeholder="请选择（单选）" size="small"  style="width: 250px">
            <el-option v-for="(item,index) in postArray" :key="index" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位:" prop="JobName">
          <el-input
            v-model.trim="ruleForm.JobName"
            placeholder="请输入岗位信息"
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
import { GetListPost, AddPost, UpDatePost, DeletePost, ComboBoxList, JobGetList_Execl } from "@/api/organize"
import { GetLoginNameList } from "@/api/user"
let ID;
export default {
  name: 'postManage',
  components: { customTable, Pagination },
  data() {
    return {
      operatorArray: [],
      ruleForm: {
        SYS_Department_Id: '',
        JobName: ''
      },
      rules: {
        JobName: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        SYS_Department_Id: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      postArray: [],
      tableHeight: null,
      warnVisible: false,
      dialogVisible: false,
      createStartTimes:[],
      title: '',
      total: 0,
      jp: {
        page: 1,
        limit: 10,
        filed:'',
        sort:"",
        SYS_Department_Id: '',
        JobName:'',
        createUserId:'',
        createStartTime:'',
        createEndTime:'',
        tableId: '0000002'
      },
      tableData: [],
      checkAllData: [],//表头信息
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
      JobGetList_Execl({jp: this.jp}).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      })
    },
    /**
       * 编辑及新增
       * */
    handleEdit(scope,row) {
      ID = row.Id
      this.dialogVisible = true
      this.title = '编辑'
      this.ruleForm = {
        SYS_Department_Id: row.SYS_Department_Id,
        JobName: row.JobName
      }
    },
    addNewFun() {
      this.dialogVisible = true
      this.title = '添加'
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
      DeletePost(params).then(res => {
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
      GetListPost(this.jp).then(res => {
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
            this.ruleForm.Id = ID
            UpDatePost(this.ruleForm).then(res => {
              if (res.code ==0 ) {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.dialogVisible = false
                this.ruleForm = {
                  SYS_Department_Id: '',
                  JobName: ''
                }
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
            AddPost(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.dialogVisible = false
                this.ruleForm = {
                  SYS_Department_Id: '',
                  JobName: ''
                }
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
    /**
     * 编辑弹窗表格重置
     * */
    resetForm(formName) {
      this.dialogVisible = false;
      this.ruleForm = {
        SYS_Department_Id: '',
        JobName: ''
      }
      this.$refs[formName].resetFields();
    },
    /**
     * 获取部门信息
     * */
    getComboBoxList() {
      ComboBoxList().then(res => {
        if(res.code==0){
          this.postArray = res.data;
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
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
    getTime1(data) {
      if(data !=null) {
        this.jp.createStartTime = data[0]
        this.jp.createEndTime = data[1]
      }else {
        this.jp.createStartTime = ''
        this.jp.createEndTime = ''
      }
    },
    /**
     * 排序
     * */
    sortChanges({prop, order }){
      this.jp.filed = prop
      this.jp.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
      if(this.tableData.length>0){
        this.jp.page = 1
        this.searchFun()
      }
    }
  },
  mounted() {
    this.GetLoginNameList()
    this.$refs.myChild.GetTable(this.jp.tableId);
    this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
    this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    this.getComboBoxList();
    //this.searchFun();
  }
}
</script>
                                                                                                                             
