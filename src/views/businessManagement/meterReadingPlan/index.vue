<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head />
      </div>
      <div class="table-top-btn-padding display-flex justify-content-flex-justify">
        <el-button type="primary" size="mini" @click>
          <i class="iconfont icontianjia"></i>新增抄表计划
        </el-button>
        <div>
          <el-button type="success" size="mini" @click>
            <i class="iconfont icondaochuexcel"></i>导出Excel
          </el-button>
          <el-button type="warning" size="mini" @click="setCustomData()">
            <i class="iconfont iconbiaogezidingyi"></i>表格自定义
          </el-button>
        </div>
      </div>
      <customTable ref="myChild" />
      <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          :cell-style="{'padding':'7px 0'}"
          @sort-change="sortChanges"
        >
          <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
          <template v-for="(item ,index) in tableHeadData">
            <el-table-column
              v-if="item.IsFreeze"
              :key="index"
              min-width="130px"
              sortable="custom"
              :prop="item.ColProp"
              :align="item.Position"
              :label="item.ColDesc"
              :fixed="item.Freeze"
            />
            <el-table-column
              v-else
              :key="index"
              min-width="100px"
              sortable="custom"
              :prop="item.ColProp"
              :align="item.Position"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column label="操作" width="200px" align="center" fixed="right">
            <template slot-scope="scope">
              <a class="operation1">编辑</a>
              <a class="operation2">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="selectHead.page"
          :limit.sync="selectHead.limit"
          @pagination="setCustomData"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; //查询条件组件
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import { searchPlanList } from "@api/plan"
export default {
  name: "MeterReadingPlan",
  components: {
    SelectHead,
    customTable,
    Pagination
  },
  data() {
    return {
      total: 0,
      selectHead: {
        // 查询条件
        page: 1,
        limit: 10,
        SA_WaterFactory_Id: "", //水厂Id
        StartPlanDate: "", //计划开始日期
        EndPlanDate: "", //计划结束日期
        enumPlanState: "", //抄表计划状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000008"
      },
      checksData: [],
      tableData: [],
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      customHeight: "" //自定义高度
    };
  },
  computed: {
    tableHeadData: function() {
      //获取表头信息
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
    customHeight() {
      //获取自定义模块高度
      let that = this;
      that.$nextTick(() => {
        let formHeight = this.$refs.formHeight.offsetHeight;
        that.tableHeight =
          document.getElementsByClassName("section-container")[0].offsetHeight -
          formHeight -
          110 -
          that.customHeight;
      });
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      let formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      console.log(formHeight);
      that.tableHeight =
        document.getElementsByClassName("section-container")[0].offsetHeight -
        formHeight -
        110;
      console.log(that.tableHeight);
      this.$refs.myChild.GetTable(this.selectHead.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
    });
  },
  methods: {
    setCustomData() {
      //表格自定义方法
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
    },
    sortChanges() {
      console.log(1);
    },
    searchTableList() {
      searchPlanList(this.selectHead).then(res => {
        console.log(res)
      });
    }
  }
};
</script>
<style scoped>
</style>