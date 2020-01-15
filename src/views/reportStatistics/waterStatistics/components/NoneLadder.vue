<template>
  <div class="cl-container">
    <SelectHead ref="childSelect" @getText="getText"></SelectHead>
    <div class="cl-center-box">
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel" style="margin-top: 50px;"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(param.page - 1) *param.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="WaterPropertyName"
          label="用水性质名称"
          min-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="WaterMeterType"
          min-width="120"
          label="水表类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="CustomerType"
          min-width="120"
          label="用户类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="CustomerCount"
          min-width="120"
          label="用户户数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="WaterPriceToLadder1"
          label="水费"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="WaterYieldToLadder1"
          min-width="120"
          label="水量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="SewagePrice"
          min-width="120"
          label="污水费"
          align="center">
        </el-table-column>
        <el-table-column
          prop="OtherPrice1"
          label="其他费用1"
          min-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="OtherPrice2"
          label="其他费用2"
          min-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="TotalPrice"
          label="共计水量"
          min-width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="TotalYield"
          label="共计水费"
          min-width="120"
          align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SearchTips from "@/components/SearchTips/index";
import SelectHead from "./SelectHead"; //查询条件组建
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { WaterPropertyReportToNotLadder, WaterPropertyReportToNotLadderToExcel } from "@/api/reportInfo";
import { promptInfoFun } from "@/utils/index";
export default {
  components: { SelectHead, SearchTips },
  name: "plan",
  data() {
    return {
      tableData: [],
      tableHeight: null, //表格高度
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      param: {},
    };
  },
  methods: {
    searchFun() {
      let param = Object.assign({},this.param)
      param.CustomerType = parseInt(this.param.CustomerType)
      param.WaterMeterType = parseInt(this.param.WaterMeterType)
      WaterPropertyReportToNotLadder(param).then(res => {
        if (res.code == 0) {
          this.tipsData = pushItem(this.tipsDataCopy)
          this.tableData = res.data;
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
    },
    exportExcel() { //导出
      if(this.tableData.length<=0){
        promptInfoFun(this,1,'暂无导出数据')
        return false
      }
      let param = Object.assign({},this.param)
      param.CustomerType = parseInt(this.param.CustomerType)
      param.WaterMeterType = parseInt(this.param.WaterMeterType)
      WaterPropertyReportToNotLadderToExcel(param).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    sortChanges({ prop, order }) {
      //列排序
      this.param.filed = prop;
      this.param.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableData.length > 0) {
        this.param.page = 1;
        this.searchFun();
      }
    },
    /**
     *val 对应绑定的参数
     *this this对象
     * this.tipsDataCopy   存储面包屑数据的数组
     * param  对应搜索条件的对象名
     */
    delTips(val) {
      if(val=='createStartTimes'){
        promptInfoFun(this,1,'生效日期不能为空!')
        return false
      }
      this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, 'param')
      this.searchFun()
    },
    /**
     *val 搜索数据值
     *model 对应绑定的属性
     * arr   下拉框循环的数组（输入框传“”）
     * name  对应的搜索lable
     */
    //处理搜索条件,面包屑
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name); //返回的组件需要的对象
      this.tipsDataCopy.push(obj);
    }
  },
  created() {
    this.$nextTick(()=>{
      this.$refs.searchTips.showTabBtn = false//隐藏自定义按钮
      this.tableHeight  = document.getElementsByClassName("cl-container")[0].offsetHeight - document.getElementById("table").offsetTop;
    })
  }
};
</script>
