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
        <!--自定义表格字段组建 s-->
        <customTable ref="myChild" />
        <!--自定义表格字段组建 e-->
      </div>
      <!--列表 s-->
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
            :fixed= "item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            :align="item.Position"
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
        @pagination="searchFun"/>
      <!--列表 e-->
    </div>
    <!--编辑或新增窗口 s-->
    <Dialog ref="childDialog"></Dialog>
    <!--编辑或新增窗口 e-->
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import customTable from '@/components/CustomTable/index'//自定义表头组建
  import SelectHead from './components/SelectHead'//查询条件组建
  import Dialog from './components/Dialog'//新增编辑弹窗
  import Pagination from '@/components/Pagination/index'//分页组建
  import { GetListPost, AddPost, UpDatePost, DeletePost, ComboBoxList, JobGetList_Execl } from "@/api/organize"// 请求方法
  import { GetLoginNameList } from "@/api/user"
  import { parseTime } from "@/utils/index"
  export default {
    name: 'postManage',
    components: { customTable, Pagination, SelectHead, Dialog },
    data() {
      return {
        tableHeight: null,//表格高度
        total: 0,
        jp: {//查询条件对象
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          SYS_Department_Id: '-1',
          JobName:'',
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          tableId: '0000002'
        },
        tableData: [],//表格数据
        checkAllData: [],//表头信息
        checksData: [],
        customHeight: ''//自定义模块高度
      }
    },
    computed: {
      tableHead: function() {//表头数据
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
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        JobGetList_Execl(this.jp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(scope,row) {//编辑方法
        this.$refs.childDialog.ID = row.Id //给子组件变量赋值
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '编辑'
        this.$refs.childDialog.ruleForm = {
          SYS_Department_Id: row.SYS_Department_Id,
          JobName: row.JobName
        }
      },
      addNewFun() {//新增方法
        this.$refs.childDialog.dialogVisible = true//给子组件变量赋值
        this.$refs.childDialog.title = '添加'
      },
      handleDelete(scope,row) {//删除方法
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          DeletePost({ Id: row.Id }).then(res => {
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
        GetListPost(this.jp).then(res => {
          this.total = res.count;
          this.tableData = res.data;
        })
      },
      getComboBoxList() {//获取部门信息
        ComboBoxList().then(res => {
          if(res.code==0){
            this.$refs.childDialog.postArray = res.data//给子组件变量赋值
            this.$refs.selectChild.postArray = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      GetLoginNameList() {//获取操作人信息
        GetLoginNameList().then(res => {
          if (res.code ==0 ) {
            this.$refs.selectChild.operatorArray = res.data;//给子组件变量赋值
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      sortChanges({prop, order }){//排序
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
      this.getComboBoxList();
      this.$refs.myChild.GetTable(this.jp.tableId);//调用子组件方法获取表头信息
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    }
  }
</script>

