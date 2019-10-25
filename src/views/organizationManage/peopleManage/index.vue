<template>
  <div class="cl-container cl-container2">
    <div style="overflow: auto">
      <div id="conditionBox">
        <!--查询条件组件 s-->
        <SelectHead ref="childSelect"></SelectHead>
        <!--查询条件组件 e-->
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
          <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
        </div>
      </div>
      <!--自定义字段组建 s-->
      <customTable ref="myChild" />
      <!--自定义字段组建 e-->
      <!--列表数据 s-->
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
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze">
            <template slot-scope="scope">
              <i v-if="item.ColProp == 'EnrollingTime'||item.ColProp == 'Birthday'">
                {{ scope.row[item.ColProp]!=''&&scope.row[item.ColProp]!=null? scope.row[item.ColProp].split(' ')[0]:''}}
              </i>
              <i v-else>
                {{ scope.row[item.ColProp] }}
              </i>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc">
            <template slot-scope="scope">
              <i v-if="item.ColProp == 'EnrollingTime'||item.ColProp == 'Birthday'">
                {{ scope.row[item.ColProp]!=''&&scope.row[item.ColProp]!=null? scope.row[item.ColProp].split(' ')[0]:''}}
              </i>
              <i v-else>
                {{ scope.row[item.ColProp] }}
              </i>
            </template>
          </el-table-column>
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
      <!--列表数据 e-->
    </div>
    <!--新增s-->
    <addmponent ref="child" v-on:Changed = "changeMsg($event)"></addmponent>
    <!--新增e-->
    <!--编辑s-->
    <editmponent ref="child2" v-on:Changed1 = "changeMsg1($event)"></editmponent>
    <!--编辑e-->
    <!--详情s-->
    <detailmponent ref="child3"></detailmponent>
    <!--详情e-->
  </div>
</template>
<script>
  import '@/styles/organization.scss'
  import SelectHead from './components/SelectHead'
  import customTable from '@/components/CustomTable/index'
  import Pagination from '@/components/Pagination/index'
  import addmponent from './components/Add'
  import editmponent from './components/Edit'
  import detailmponent from './components/Detail'
  import { peopleDelete, peopleUpDate, peopleGetList, ComboBoxList, linkComboBoxList , GetRoleNameList, Employee_Execl} from "@/api/organize"
  import { getTime } from "@/utils/index";

  export default {
    name: 'peopleManage',
    components: {customTable, Pagination, addmponent, editmponent, detailmponent, SelectHead},
    data() {
      return {
        tableHeight: 600,//表格高度
        queryData: {//查询条件对象
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          SYS_Department_Id: '-1',//部门
          OA_Job_Id: '-1',//岗位
          EmpNo: '',//员工编号或名称
          JobStatus: '在职',//职位
          EnrollingTime: '',//入职开始结束时间
          EnrollingTimeEnd: '',
          Gender: '-1',//性别
          IDNumber: '',//身份证
          MobileNumber: '',//手机号
          Birthday: '',//生日开始结束时间
          BirthdayEnd: '',
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          EmailAddress: '',//邮箱地址
          AccountStatus: '-1',//账号状态
          tableId: '0000003'
        },
        total: 0,
        tableData: [],
        checkAllData: [],
        checksData: [],
        customHeight: ''
      }
    },
    computed: {
      tableHead: function () {//获取表头字段
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
    methods: {
      changeMsg(msg){//接受新增子组件触发事件
        if(msg==1){
          this.$refs.child.addVisible = false
          this.searchFun()
        }else{
          this.$refs.child.addVisible = msg
        }
      },
      changeMsg1(msg){//接受编辑子组件触发事件
        if(msg==1){
          this.$refs.child2.editVisible = false
          this.searchFun()
        }else{
          this.$refs.child2.editVisible = msg
        }
      },
      setCustomData() {//表格自定义
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        let jp;
        if (!this.$refs.childSelect.ifMore) {//此时查询条件不包含隐藏字段
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
            EnrollingTimeEnd: this.queryData.EnrollingTimeEnd,
            Gender: this.queryData.Gender,
            IDNumber: '',
            MobileNumber: '',
            Birthday: '',
            BirthdayEnd: '',
            editUserId: '-1',//操作者
            editStartTime: '',//操作开始结束时间
            editEndTime: '',
            EmailAddress: '',
            AccountStatus: '-1',
            tableId: '0000003'
          }
        } else {
          jp = this.queryData
        }
        Employee_Execl(jp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(row, type) {//编辑及新增方法
        let self = this
        if (type == 1) {//显示编辑弹窗信息
          self.$refs.child2.editVisible = true
          self.$nextTick(() => {
            self.$refs.child2.getInfo(row.Id)
          })
        } else {//显示详情弹窗信息
          self.$refs.child3.detailVisible = true
          self.$nextTick(() => {
            self.$refs.child3.getInfo(row.Id)
          })
        }
      },
      addNewFun() {//新增方法
        this.$refs.child.addVisible = true
      },
      handleDelete(row) {//删除
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          peopleDelete({id: row.Id}).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              });
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
        let jp;
        if (!this.$refs.childSelect.ifMore) {//此时查询条件不包含隐藏字段
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
            EnrollingTimeEnd: this.queryData.EnrollingTimeEnd,
            Gender: this.queryData.Gender,
            IDNumber: '',
            MobileNumber: '',
            Birthday: '',
            BirthdayEnd: '',
            editUserId: '-1',//操作者
            editStartTime: '',//操作开始结束时间
            editEndTime: '',
            EmailAddress: '',
            AccountStatus: '-1',
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
      sortChanges({prop, order }){//排序
        this.queryData.filed = prop
        this.queryData.sort = order =='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.queryData.page = 1
          this.searchFun()
        }
      }
    },
    mounted() {
      this.$refs.myChild.GetTable(this.queryData.tableId);//获取表头信息
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
    }
  }
</script>
