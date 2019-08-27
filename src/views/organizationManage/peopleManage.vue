<template>
  <div class="cl-container cl-container2">
    <div>
      <div id="conditionBox">
        <el-row>
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">部门：</label>
              <el-select v-model="queryData.SYS_Department_Id" placeholder="请选择" size="small" @change="getPostList">
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(item,index) in departArray"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">岗位：</label>
              <el-select v-model="queryData.OA_Job_Id" placeholder="请选择" size="small">
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(item,index) in postArray"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">人员：</label>
              <el-input
                v-model="queryData.EmpNo"
                placeholder="人员名称/员工编号"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">岗位状态：</label>
              <el-select v-model="queryData.JobStatus" placeholder="请选择" size="small">
                <el-option label="在职" value="在职" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
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
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">性别：</label>
              <el-select v-model="queryData.Gender" placeholder="请选择" size="small">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="女" value="女" />
                <el-option label="男" value="男" />
              </el-select>
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">电话号码：</label>
              <el-input
                v-model="queryData.MobileNumber"
                placeholder="请输入11位电话号码"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
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
          <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">身份证号：</label>
              <el-input
                v-model.trim="queryData.IDNumber"
                placeholder="请输入18位身份证号"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">操作人：</label>
              <el-select v-model="queryData.createUserId" placeholder="请选择" size="small">
                <el-option
                  v-for="(item,index) in operationArray"
                  :key="index"
                  :label="item.Name"
                  :value="item.Id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
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
          <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">账号状态：</label>
              <el-select v-model="queryData.AccountStatus" placeholder="请选择" size="small">
                <el-option label="全部" value="全部"/>
                <el-option label="已分配" value="已分配"/>
                <el-option label="未分配" value="未分配"/>
              </el-select>
            </div>
          </el-col>
          <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">邮箱：</label>
              <el-input
                v-model="queryData.EmailAddress"
                placeholder="长度0-50"
                maxlength="10"
                size="small"
              />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" style="margin-bottom: 20px;">
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
        <el-table-column label="操作" width="200px"  align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.row,1)">编辑</a>
            <a class="operation1" @click="handleEdit(scope.row,2)">详情</a>
            <a class="operation2" @click="handleDelete(scope.row)" v-if="scope.row.SYS_User_Id.length <= 0">删除</a>
            <el-tooltip v-else effect="dark" content="人员已关联账号，不可删除" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;">删除</a>
            </el-tooltip>
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
import { peopleDelete, peopleUpDate, peopleGetList, ComboBoxList, linkComboBoxList , GetRoleNameList, Employee_Execl} from "@/api/organize"
let deleteId;
import Bus from '@/utils/bus.js'
import { parseStartTime, parseEndTime } from "@/utils/index";

export default {
  name: 'peopleManage',
  components: {customTable, Pagination},
  data() {
    return {
      ifMore: false,
      tableHeight: null,
      warnVisible: false,
      queryData: {
        page: 1,
        limit: 10,
        filed:'',
        sort:"",
        SYS_Department_Id: '-1',
        OA_Job_Id: '-1',
        EmpNo: '',
        JobStatus: '在职',
        EnrollingTime: '',
        EnrollingTimeEnd: '',
        Gender: '-1',
        IDNumber: '',
        MobileNumber: '',
        Birthday: '',
        BirthdayEnd: '',
        createUserId: '',
        createStartTime: '',
        createEndTime: '',
        EmailAddress: '',
        AccountStatus: '',
        tableId: '0000003'
      },
      operationTime: [],
      EntryTime: [],
      birthdayTime: [],
      postArray: [],
      departArray: [],
      operationArray: [],
      total: 0,
      tableData: [],
      checkAllData: [],
      checksData: [],
      customHeight: ''
    }
  },
  computed: {
    tableHead: function () {
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
    ifMore() {
      let self = this
      self.$nextTick(() => {
        self.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      })
    },
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
      let jp;
      if (!this.ifMore) {
        jp = {
          page: this.queryData.page,
          limit: this.queryData.limit,
          filed: this.queryData.filed,
          sort: this.queryData.sort,
          SYS_Department_Id: this.queryData.SYS_Department_Id,
          OA_Job_Id: this.queryData.OA_Job_Id,
          EmpNo: this.queryData.EmpNo,
          JobStatus: this.queryData.JobStatus,
          EnrollingTime: this.queryData.EnrollingTime,
          EnrollingTimeEnd: this.queryData.EnrollingTime,
          Gender: this.queryData.Gender,
          IDNumber: '',
          MobileNumber: '',
          Birthday: '',
          BirthdayEnd: '',
          createUserId: '',
          createStartTime: '',
          createEndTime: '',
          EmailAddress: '',
          AccountStatus: '',
          tableId: '0000003'
        }
      } else {
        jp = this.queryData
      }
      Employee_Execl(jp).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      })

    },
    /**
     * 编辑及新增
     * 1: 编辑
     * 2：详情
     * */
    handleEdit(row, type) {
      if (type == 1) {//编辑
        this.$router.push({
          name: "peopleEdit",
          params: {
            id: row.Id
          }
        })
      } else {//详情
        this.$router.push({
          name: "peopleDetail",
          params: {
            id: row.Id
          }
        })
      }
    },
    addNewFun() {
      this.$router.push({path: '/organizationManage/peopleAdd'})
    },
    /**
     * 删除
     * */
    handleDelete(row) {
      deleteId = row.Id
      this.warnVisible = true

    },
    deleteFun() {
      peopleDelete({id: deleteId}).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.warnVisible = false
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
      let jp;
      if (!this.ifMore) {
        jp = {
          page: this.queryData.page,
          limit: this.queryData.limit,
          filed: this.queryData.filed,
          sort: this.queryData.sort,
          SYS_Department_Id: this.queryData.SYS_Department_Id,
          OA_Job_Id: this.queryData.OA_Job_Id,
          EmpNo: this.queryData.EmpNo,
          JobStatus: this.queryData.JobStatus,
          EnrollingTime: this.queryData.EnrollingTime,
          EnrollingTimeEnd: this.queryData.EnrollingTime,
          Gender: this.queryData.Gender,
          IDNumber: '',
          MobileNumber: '',
          Birthday: '',
          BirthdayEnd: '',
          createUserId: '',
          createStartTime: '',
          createEndTime: '',
          EmailAddress: '',
          AccountStatus: '',
          tableId: '0000003'
        }
      } else {
        jp = this.queryData
      }

      peopleGetList(jp).then(res => {
        this.total = res.count;
        this.tableData = res.data;
      })
    },
    /**
     * 获取部门信息
     * */
    getComboBoxList() {
      ComboBoxList().then(res => {
        if (res.code == 0) {
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
      let params = {SYS_Department_Id: id}
      linkComboBoxList(params).then(res => {
        if (res.code == 0) {
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
        if (res.code == 0) {
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
      if (data != null) {
        this.queryData.EnrollingTime = data[0]
        this.queryData.EnrollingTimeEnd = data[1]
      } else {
        this.queryData.EnrollingTime = ''
        this.queryData.EnrollingTimeEnd = ''
      }
    },
    getTime2(data) {
      if (data != null) {
        this.queryData.Birthday = data[0]
        this.queryData.BirthdayEnd = data[1]
      } else {
        this.queryData.Birthday = ''
        this.queryData.BirthdayEnd = ''
      }
    },
    getTime3(data) {
      if (data != null) {
        this.queryData.createStartTime = data[0]
        this.queryData.createEndTime = data[1]
      } else {
        this.queryData.createStartTime = ''
        this.queryData.createEndTime = ''
      }
    },
    /**
     * 排序
     * */
    sortChanges({prop, order }){
      this.queryData.filed = prop
      this.queryData.sort = order =='ascending'?'ASC':(order=='descending'?'DESC':'')
      if(this.tableData.length>0){
        this.queryData.page = 1
        this.searchFun()
      }
    }
  },
  mounted() {
    let start = parseStartTime(new Date());
    let end = parseEndTime(new Date());
    this.EntryTime.push(new Date(start));
    this.EntryTime.push(new Date(end));

    this.$refs.myChild.GetTable(this.queryData.tableId);
    this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
    this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    this.getComboBoxList()
    this.GetRoleNameList()
    let self = this
    Bus.$on('msg', (e) => {
      self.searchFun()
    })
  }
}
</script>
