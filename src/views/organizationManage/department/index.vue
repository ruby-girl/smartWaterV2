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
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(dp.page - 1) * dp.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            :width=" index == 0 ? 350+'px':'auto'"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze"/>
          <el-table-column
            v-else
            :key="index"
            :width=" index == 0 ? 350+'px':'auto'"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"/>
        </template>
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.row)">编辑</a>
            <a class="operation2" @click="handleDelete(scope.row)" v-if="scope.row.isDelete">删除</a>
            <el-tooltip v-else effect="dark" content="岗位已关联人员，不可删除" placement="bottom-start">
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
    <AddOrEdit ref="addChild"></AddOrEdit>
    <!--编辑或新增窗口 e-->
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import customTable from '@/components/CustomTable/index'//自定义表格组建
  import AddOrEdit from './components/AddOrEdit'
  import SelectHead from './components/SelectHead'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页组建
  import { GetList, Delete, GetList_Execl,GetEditObjById } from "@/api/organize"
  import { parseTime, promptInfoFun } from "@/utils/index"
  let editObj = {};//编辑需要用到的全局变量

  export default {
    name: 'department',
    components: { SelectHead, customTable, Pagination, AddOrEdit },
    data() {
      return {
        tableHeight: null,//表格高度
        title: '',//编辑或新增弹窗标题
        total: 0,//分页总条数
        dp: {//查询条件对象
          Id: "-1",
          JobName: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000001"
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
      handleEdit(row) {//编辑方法
        this.$refs.addChild.dialogVisible = true
        this.$refs.addChild.title = '编辑'
        GetEditObjById({id:row.Id}).then(res => {
          if(res.code==0){
            this.$refs.addChild.jp = res.data
          }
        })
      },
      addNewFun() {//新增方法
        this.$refs.addChild.dialogVisible = true
        this.$refs.addChild.title = '添加'
        this.$refs.addChild.jp.DeptName = ''
      },
      handleDelete(row) {//删除方法
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          Delete({ Id: row.Id }).then(res => {
            if (res.code ==0 ) {
              promptInfoFun(this, 2, res.message);
              this.dialogVisible = false
              this.searchFun()
            } else {
              promptInfoFun(this, 1, res.message);
            }
          })
        });
      },
      searchFun() {
        GetList(this.dp).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
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
