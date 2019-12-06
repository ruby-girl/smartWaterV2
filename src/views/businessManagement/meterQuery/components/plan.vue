<template>
  <div class="cl-container">
    <SelectHead ref="childSelect" @getText="getText"></SelectHead>
    <div class="cl-center-box">
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel"/>
      <el-table
        id="table"
        :data="tableData"
        :height="tableHeight"
        border
        @sort-change="sortChanges"
        ref="multipleTable">
        <el-table-column type="index" fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(param.page - 1) * param.limit + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed="item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
          />
        </template>
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation1" @click="handleDetail(scope.row)" v-if="scope.LadderNumber>1">水量详情</a>
            <a class="operation2" @click="handleDelete(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="param.page"
        :limit.sync="param.limit"
        @pagination="searchFun"
      />
    </div>
    <EditDialog ref="editDialog"></EditDialog>
  </div>
</template>

<script>
  import EditDialog from "./EditDialog"; //查询条件组建
  import SearchTips from "@/components/SearchTips/index";
  import SelectHead from "./SelectHead"; //查询条件组建
  import Pagination from "@/components/Pagination/index"; //分页
  import { delTips,getText,pushItem } from "@/utils/projectLogic";//搜索条件面包屑
  import { MeterReadPlanExport, ReadingQueryPageQuery, QueryMeterReaderByFactoryId } from "@/api/meterQuery";
  import { promptInfoFun } from "@/utils/index";

  export default {
    components: { Pagination,SelectHead,SearchTips,EditDialog},
    name: "plan",
    data() {
      return {
        tipsData:[],
        tableData:[],
        tableHeight: null, //表格高度
        total: 0,
        tipsData: [],//传入子组件的值
        tipsDataCopy: [],//表单变化的值
        checksData:[],
        param: {
          CustomerQueryType: "1", //用户查询类型 用户编号=1，姓名=2，简码=3
          CustomerQueryValue: "", //用户查询值
          SA_WaterFactory_Id: "-1", //水厂
          SA_MeterReadPlan_Id: "", //抄表计划Id
          SA_MeterReader_Id: "-1", //抄表员ID
          SA_RegisterBookInfo_Id: "-1", //表册Id
          UserType: "-1", //用户类型 = ['1201', '1202', '1203', '1204', '-1']
          InputEmpName: "", //录入人
          ReadDateStart: "", //抄表时间
          ReadDateEnd: "",
          ReadingQueryType: "1", //抄表查询类型 按抄表计划查询=1， 按抄表时间查询=2
          MeterReadState: "-1", //抄表状态 = ['1401', '1402', '-1']
          InputTimeStart: "", //录入时间
          InputTimeEnd: "",
          limit: 10,
          page: 0,
          sort: "",
          filed: "",
          tableId: "0000015"
        },
      }
    },
    computed: {
      tableHead: function() {  //获取表头信息
        const arrayHead = [];
        const data = this.checksData;
        for (let i = 0; i < data.length; i++) {
          // 过滤选中列
          if (data[i].IsCheck) {
            arrayHead.push(data[i]);
          }
        }
        return arrayHead;
      }
    },
    methods:{
      searchFun() {//列表查询
        ReadingQueryPageQuery(this.param).then(res => {
          if (res.code == 0) {
            pushItem(this)
            this.total = res.count;
            this.tableData = res.data;
          } else {
            promptInfoFun(this, 1, res.message);
          }
        });
      },
      exportExcel() {//导出
        MeterReadPlanExport(this.param).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        });
      },
      handleDelete() {//删除

      },
      handleDetail(row) {//水量详情
        this.$refs.editDialog.dialogVisible = true
        this.$refs.editDialog.getInfo(row)
      },
      sortChanges({ prop, order }) {//列排序
        this.param.filed = prop;
        this.param.sort =
          order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
        if (this.tableData.length > 0) {
          this.param.page = 1;
          this.searchFun();
        }
      },
      delTips(val) {
        if (val == "meterData") {
          this.param.ReadDateStart = "";
          this.param.ReadDateEnd = "";
        }else if(val == 'InputTimeStart'){
          this.param.InputTimeStart = "";
          this.param.InputTimeEnd = "";
        }
        this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "param");
      },
      getText(val, model, arr) {
        let obj=getText(val, model, arr,this.tipsDataCopy,this)
        this.tipsDataCopy.push(obj);
      },
    },
    mounted() {
      this.$refs.searchTips.$refs.myChild.GetTable(this.param.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    }
  }
</script>
