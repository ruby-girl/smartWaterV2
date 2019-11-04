<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <!--查询条件组建 s-->
        <SelectHead ref="childSelect"></SelectHead>
        <div class="cl-operation1 clearfix">
          <el-button
            type="primary"
            size="small"
            class="fr cl-color1"
            @click="setCustomData()"
            style="margin-left: 10px;"
          >
            <i class="icon iconfont">&#xe678;</i> 表格自定义
          </el-button>
          <el-button type="success" size="small" class="fr" @click="exportExcel">
            <i class="icon iconfont">&#xe683;</i> 导出Excel
          </el-button>
        </div>
      </div>
      <!--自定义组建 s-->
      <customTable ref="myChild" />
      <!--自定义组建 e-->
      <!--列表组建 s-->
      <el-table
        id="table"
        :data="tableData"
        :height="tableHeight"
        border
        @sort-change="sortChanges"
        ref="multipleTable"
      >
        <el-table-column type="index" label="序号" width="80" align="center" fixed="left" />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            sortable="custom"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed="item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            sortable="custom"
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
      <!--列表组建 e-->
    </div>
    <!--水量详情-->
    <EditDialog ref="editDialog"></EditDialog>
  </div>
</template>

<script>
import "@/styles/organization.scss";
import customTable from "@/components/CustomTable/index"; //自定义组建
import SelectHead from "./components/SelectHead"; //查询条件组建
import EditDialog from "./components/EditDialog"; //查询条件组建
import Pagination from "@/components/Pagination/index"; //分页
import { MeterReadPlanExport, ReadingQueryPageQuery, QueryMeterReaderByFactoryId } from "@/api/meterQuery";
import { promptInfoFun } from "@/utils/index";

export default {
  name: "meterQuery",
  components: { customTable, Pagination, SelectHead, EditDialog },
  data() {
    return {
      tableData: [], //表格数据
      checkAllData: [],
      checksData: [], //自定义选中字段
      customHeight: "", //自定义高度
      tableHeight: null, //表格高度
      total: 0,
      param: {
        //查询条件
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
      }
    };
  },
  activated: function() {
    let id = this.$route.query.id;
    this.param.SA_MeterReadPlan_Id = id;
    this.searchFun();
  },
  created: function() {
    let id = this.$route.query.id;
    if(id){
      this.param.SA_MeterReadPlan_Id = id;
      this.searchFun();

    }
  },
  methods: {
    sortChanges({ prop, order }) {//列排序
      this.param.filed = prop;
      this.param.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableData.length > 0) {
        this.param.page = 1;
        this.searchFun();
      }
    },
    searchFun() {//列表查询
      ReadingQueryPageQuery(this.param).then(res => {
        if (res.code == 0) {
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
    setCustomData() {//表格自定义
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
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
  watch: {
    customHeight() {   //获取自定义模块高度
      let self = this;
      self.$nextTick(() => {
        self.tableHeight =
          document.getElementsByClassName("cl-container")[0].offsetHeight -
          document.getElementById("table").offsetTop -
          50;
      });
    }
  },
  mounted() {
    let _this = this;
    _this.$refs.myChild.GetTable(this.param.tableId);
    _this.checksData = this.$refs.myChild.checkData; //获取自定义字段中选中了字段
    _this.tableHeight =
      document.getElementsByClassName("cl-container")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      50;
    window.onresize = () => {
      _this.tableHeight =
        document.getElementsByClassName("cl-container")[0].offsetHeight -
        document.getElementById("table").offsetTop -
        50;
    };
  }
};
</script>
