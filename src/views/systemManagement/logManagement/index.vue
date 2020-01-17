
<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" ref="seachChild" />
      </div>
      <div class="contanier">
        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" />
        <div class="main-padding-20-y" id="table">
          <el-table
            :data="tableData"
            border
            fit
            :height="tableHeight"
            style="width: 100%;"
            :header-cell-style="{'background-color': '#F0F2F5'}"
          >
            <el-table-column type="index" fixed="left" label="#" width="60" align="center">
              <template slot-scope="scope">
                <span>{{(selectHead.page - 1) * selectHead.limit+ scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="SA_WaterFactory_Name" label="水厂"></el-table-column>
            <el-table-column prop="EditTime" label="日期"></el-table-column>
            <el-table-column prop="SYS_Model_Name" label="用水量"></el-table-column>
            <el-table-column prop="EditUser" label="供水量"></el-table-column>
            <el-table-column prop="Content" label="产销差率"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./components/SelectHead";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { getLogList } from "@/api/log";
export default {
  name: "logManagement",
  components: { SelectHead, SearchTips },
  data() {
    return {
      selectHead: {
        page:1,
        limit:20,
        sA_WaterFactory_Id: "-1", //水厂
        sYS_Model_Name: "-1", //模块名称
        content: "", //内容
        user_Id: "-1", //操作员
        sort:"",
        filed:"",
        starDateTime:"",
        endDateTime:"",
      },
      tableHeight: null,
      tableData: [], //表格数据
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024
    };
  },
  methods: {
    delTips(val) {
      if (val == "dateArr") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.YearMonth = "";
        this.$refs.seachChild.dateArr = [];
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      this.searchTableList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
   
    //查询
    searchTableList() {
      getLogList(this.selectHead).then(res => {
        this.tableData = res.data;
        this.tipsData = pushItem(this.tipsDataCopy);
      });
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop -
        4;

      this.$refs.searchTips.showTabBtn = false;
      this.$refs.searchTips.showExcel = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.section-full-container {
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
</style>
