<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" ref="seachChild" />
      </div>
      <div class="contanier">
        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
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
            <el-table-column prop="name" label="水厂" width="180"></el-table-column>
            <el-table-column prop="name" label="业务办理日期" width="180"></el-table-column>
            <el-table-column prop="name" label="开户数" width="180"></el-table-column>
            <el-table-column prop="name" label="过户数" width="180"></el-table-column>
            <el-table-column prop="name" label="销户数" width="180"></el-table-column>
            <el-table-column prop="name" label="换表数" width="180"></el-table-column>
            <el-table-column prop="name" label="水表升级数" width="180"></el-table-column>
            <el-table-column prop="name" label="总计" width="180"></el-table-column>
            <el-table-column label="操作" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :visible-arrow="false"
                  content="查看明细"
                  placement="bottom"
                >
                  <i
                    class="iconStyle icon iconfont operation3"
                    @click="Detail(scope.row.Id)"
                  >&#xe653;</i>
                </el-tooltip>
               
              </template>
            </el-table-column>
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
export default {
  name: "userBusinessStatistics",
  components: { SelectHead, SearchTips },
  data() {
    return {
      selectHead: {
        SA_WaterFactory_Id: "-1", //水厂
        CreateUser: "-1", //操作人
        WaterType: -1, //水表类型
        UserType: -1, //用户类型
        createStartTime: "",
        createEndTime: ""
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
        this.selectHead.createStartTime = "";
        this.selectHead.createStartTime = "";
        this.$refs.seachChild.dateArr = [];
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      this.searchTableList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      console.log(obj);
      this.tipsDataCopy.push(obj);
    },
    //导出
    excel() {
      console.log("导出");
    },
    //查询
    searchTableList() {
      console.log(this.tipsDataCopy);
      this.tipsData = pushItem(this.tipsDataCopy);
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      console.log(document.getElementsByClassName("section-full-container")[0].offsetHeight)
      console.log(document.getElementById("table").offsetTop )
      this.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop-44
      
      this.$refs.searchTips.showTabBtn = false;
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
