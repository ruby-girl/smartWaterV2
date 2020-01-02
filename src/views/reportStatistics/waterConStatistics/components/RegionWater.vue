<template>
  <div class="onBox">
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
          <el-table-column prop="name" label="用户编号" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="name" label="电话" width="180"></el-table-column>
          <el-table-column prop="name" label="地址" width="180"></el-table-column>
          <el-table-column prop="name" label="水表类型" width="180"></el-table-column>
          <el-table-column prop="name" label="用户类型" width="180"></el-table-column>
          <el-table-column prop="name" label="口径" width="180"></el-table-column>
          <el-table-column prop="name" label="用水量" width="180"></el-table-column>
          <el-table-column prop="name" label="抄表起止日期" width="180"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./selected/RegionWaterSelected";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "RegionWater",//按区域
  components: { SelectHead, SearchTips },
  data() {
    return {
      selectHead: {
        SA_WaterFactory_Id: "-1", //水厂
        CreateUser: -1, //口径
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
      this.tipsDataCopy.push(obj);
    },
    //导出
    excel() {
      console.log("导出");
    },
    //查询
    searchTableList() {
      this.tipsData = pushItem(this.tipsDataCopy);
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("onBox")[0].offsetHeight -
        document.getElementById("table").offsetTop -
        4;

      this.$refs.searchTips.showTabBtn = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.onBox {
  height: 100%;
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
</style>
