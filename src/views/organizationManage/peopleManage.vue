<template>
  <div class="cl-container cl-container2">
    <div>
      <div id="conditionBox">
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">部门：</label>
              <el-select v-model="queryData.SYS_Department_Id" placeholder="请选择（单选）" size="small" @change="getPostList">
                <el-option
                  v-for="(item,index) in departArray"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">岗位：</label>
              <el-select v-model="queryData.OA_Job_Id" placeholder="请选择（单选）" size="small">
                <el-option
                  v-for="(item,index) in postArray"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">模糊查询：</label>
              <el-input
                v-model="queryData.EmpNo"
                placeholder="人员名称/员工编号"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">岗位状态：</label>
              <el-select v-model="queryData.JobStatus" placeholder="请选择（单选）" size="small">
                <el-option label="在职" value="在职" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="cl-inlineItem" style="width: 100%">
              <label class="cl-label">入职时间：</label>
              <el-date-picker
                v-model="EntryTime"
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
          <el-col v-show="ifMore" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">性别：</label>
              <el-select v-model="queryData.Gender" placeholder="请选择（单选）" size="small">
                <el-option label="女" value="女" />
                <el-option label="男" value="男" />
              </el-select>
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">身份证号：</label>
              <el-input
                v-model="queryData.IDNumber"
                placeholder="人员名称/员工编号"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">电话号码：</label>
              <el-input
                v-model="queryData.MobileNumber"
                placeholder="人员名称/员工编号"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="cl-inlineItem" style="width: 100%">
              <label class="cl-label">出生日期：</label>
              <el-date-picker
                v-model="birthdayTime"
                style="width: 83%"
                size="small"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="getTime2"
              />
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="cl-inlineItem">
              <label class="cl-label">操作人：</label>
              <el-select v-model="queryData.createUserId" placeholder="请选择（单选）" size="small">
                <el-option
                  v-for="(item,index) in operationArray"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="cl-inlineItem" style="width: 100%">
              <label class="cl-label">操作时间：</label>
              <el-date-picker
                v-model="operationTime"
                style="width: 83%"
                size="small"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="getTime3"
              />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
            <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button>
            <i v-show="ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">收起 &#xe692;</i>
            <i v-show="!ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">展开 &#xe68f;</i>
          </el-col>
        </el-row>
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="success" size="small" class="cl-search" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          <el-button type="primary" size="small" class="cl-search cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
        </div>
      </div>
      <customTable ref="myChild" />
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border :row-class-name="tableRowClassName">
        <el-table-column
          type="selection"
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
        <el-table-column label="操作" width="200px" align="left">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.row,1)">编辑</a>
            <a class="operation1" @click="handleEdit(scope.row,2)">详情</a>
            <a class="operation2" @click="handleDelete(scope.row)" v-show="scope.row.SYS_User_Id.length <= 0">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryData.page"
        :limit.sync="queryData.limit"
        @pagination="searchFun"
      />
    </div>

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
import { peopleDelete, peopleUpDate, peopleGetList, ComboBoxList, linkComboBoxList , GetRoleNameList} from "@/api/organize"
let deleteId;
import Bus from '@/utils/bus.js'

export default {
  name: 'PeopleManage',
  components: { customTable, Pagination },
  data() {
    return {
      ifMore: false,
      tableHeight: '',
      warnVisible: false,
      queryData: {
        page: 1,
        limit: 10,
        SYS_Department_Id: '',
        OA_Job_Id: '',
        EmpNo: '',
        JobStatus: '',
        EnrollingTime: '',
        EnrollingTimeEnd: '',
        Gender: '',
        IDNumber: '',
        MobileNumber: '',
        Birthday: '',
        BirthdayEnd: '',
        createUserId: '',
        createStartTime: '',
        createEndTime: ''
      },
      operationTime: [],
      EntryTime: [],
      birthdayTime: [],
      postArray: [],
      departArray: [],
      operationArray: [],
      total: 0,
      tableData: [],
      checkAllData: [// 所有列可选项
        { checked: true, text: '人员编号', prop: 'EmpNo', position: 'center', width: '200px' },
        { checked: true, text: '人员名称', prop: 'EmpName', position: 'center', width: '200px' },
        { checked: false, text: '入职时间', prop: 'EnrollingTime', position: 'center', width: '200px' },
        { checked: false, text: '岗位状态', prop: 'JobStatus', position: 'center', width: '200px' },
        { checked: false, text: '性别', prop: 'Gender', position: 'center', width: '200px' },
        { checked: false, text: '出生日期', prop: 'Birthday', position: 'center', width: '200px' },
        { checked: false, text: '电话号码', prop: 'MobileNumber', position: 'center', width: '200px' },
        { checked: false, text: '身份证号', prop: 'IDNumber', position: 'center', width: '200px' },
        { checked: false, text: '操作人', prop: 'CreateUser', position: 'center', width: '200px' },
        { checked: false, text: '操作时间', prop: 'CreateTime', position: 'center', width: '200px' },
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
    ifMore() {
      this.$nextTick(() => {
        this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      })
    },
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
    this.getComboBoxList()
    this.GetRoleNameList()
    this.searchFun()
    let self = this
    Bus.$on('msg', () => {
      self.searchFun()
    })
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
       * 1: 编辑
       * 2：详情
       * */
    handleEdit(row,type) {
      if(type==1) {//编辑
          this.$router.push({
            name:"peopleEdit",
            params:{
              id:row.Id
            }
          })
      }else {//详情
        this.$router.push({
          name:"peopleDetail",
          params:{
            id:row.Id
          }
        })
      }
    },
    addNewFun() {
      this.$router.push({ path: '/organizationManage/peopleAdd' })
    },
    /**
       * 删除
       * */
    handleDelete(row) {
      deleteId = row.Id
      this.warnVisible = true

    },
    deleteFun() {
      peopleDelete({id:deleteId}).then(res => {
        if(res.code==0){
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.warnVisible = false
          this.searchFun()
        }else {
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
      let jp ;
      if(!this.ifMore) {
         jp = {
            page: this.queryData.page,
            limit: this.queryData.limit,
            SYS_Department_Id: this.queryData.SYS_Department_Id,
            OA_Job_Id: this.queryData.OA_Job_Id,
            EmpNo: this.queryData.EmpNo,
            JobStatus: this.queryData.JobStatus,
            EnrollingTime: this.queryData.EnrollingTime,
            EnrollingTimeEnd: this.queryData.EnrollingTime,
            Gender: '',
            IDNumber: '',
            MobileNumber: '',
            Birthday: '',
            BirthdayEnd: '',
            createUserId: '',
            createStartTime: '',
            createEndTime: ''
        }
      }else {
        jp = this.queryData
      }

      peopleGetList(jp).then(res => {
        this.total = res.count;
        this.tableData = res.data;
      })
    },
    /**
       * 编辑新增保存
       * */
    saveFun() {
    },
    /**
     * 获取部门信息
     * */
    getComboBoxList() {
      ComboBoxList().then(res => {
        if(res.code==0){
          this.departArray = res.data;
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    /**
     * 岗位联动
     * */
    getPostList(id) {
      let params = { SYS_Department_Id : id}
      linkComboBoxList(params).then(res => {
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
     * 获取操作员下拉
     * */
    GetRoleNameList() {
      GetRoleNameList().then(res => {
        if(res.code==0){
          this.operationArray = res.data;
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    getTime1(data) {
      this.queryData.EnrollingTime = data[0]
      this.queryData.EnrollingTimeEnd = data[1]
    },
    getTime2(data) {
      this.queryData.Birthday = data[0]
      this.queryData.BirthdayEnd = data[1]
    },
    getTime3(data) {
      this.queryData.createStartTime = data[0]
      this.queryData.createEndTime = data[1]
    },
    tableRowClassName({row}) {
      if (row.SYS_User_Id.length > 0)
      {
        return 'warning-row';
      }
    }
  }
}
</script>

