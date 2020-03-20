<template>
  <el-dialog
    :close-on-click-modal="false"
    top="5vh"
    title="用户详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="80%">
    <p class="reportExport"><i class="icon iconfont iconlujing1 fr" @click="exportExcel"></i></p>
    <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
      <el-table-column fixed="left" label="#" width="60" align="center">
        <template slot-scope="scope">
          <span>{{(query.page - 1) *query.limit+ scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CustomerNo"
        label="用户编号"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="CustomerName"
        label="姓名"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="WaterWorksName"
        label="水厂"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="AreaName"
        label="所属区域"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="WaterMeterTypeName"
        label="水表类型"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="UseWaterTypeName"
        label="用水性质"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="UserTypeName"
        label="用户类型"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="Tel"
        label="电话"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="CustomerStateName"
        label="用户状态"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="OperatorName"
        label="开户人"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="OperAccountDate"
        label="开户时间"
        align="center"
        min-width="200px">
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="searchFun"
    />
  </el-dialog>
</template>

<script>
  import Pagination from '@/components/Pagination/index'//分页组建
  import { promptInfoFun } from "@/utils/index"
  import { GetCustomerDataList, GetCustomerDataList_ToExcel } from "@/api/userSetting"

  export default {
    components: { Pagination },
    name: "Dialog",
    data() {
      return {
        tableData:[],
        dialogVisible: false,
        tableHeight:null,
        total:0,
        query:{
          CustomerQueryType: 1,
          CustomerQueryValue: "",
          UserType: -1,
          UserState: 1301,
          AreaId: "",
          WaterMeterNo: "",
          WaterTypeId: -1,
          WaterPropertyId: "",
          WaterFactoryId: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          limit: 20,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000016"
        }
      }
    },
    methods: {
      searchFun(){
        GetCustomerDataList(this.query).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      },
      handleClose(){//编辑弹窗关闭事件
        this.dialogVisible = false;
      },
      exportExcel(){//导出
        if(this.tableData.length<=0){
          promptInfoFun(this,1,'当前列表无数据，不可导出')
          return false
        }
        GetCustomerDataList_ToExcel(this.query).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      sortChanges({prop, order }){//列表排序方法
        this.query.filed = prop
        this.query.sort = order == 'ascending' ? 'ASC' : (order == 'descending' ? 'DESC' : '')
        if(this.tableData.length>0){
          this.query.page = 1
          this.searchFun()
        }
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight -  300
    }
  }
</script>
<style lang="scss">
  .reportExport{ width: 100%;height: 34px;position: relative;border: 1px solid #e6ebf5;border-bottom:none;margin: 0;
    i{
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-left: solid 1px #e6ebf5;
      cursor: pointer;
    }
    i:hover {color: #00B3A1}
  }
</style>
