<template>
  <div class="mac-contianer">
    <el-form
      :inline="true"
      :model="WLWQueryParam"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="用户编号：">
        <el-input v-model="WLWQueryParam.CustomerNo" maxlength="20" />
      </el-form-item>
      <el-form-item label="水表编号：">
        <el-input v-model="WLWQueryParam.WaterMeterNo" maxlength="20" />
      </el-form-item>

      <el-form-item label="用户状态：">
        <el-select v-model="WLWQueryParam.CustomerMeterState" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开户" value="1"></el-option>
          <el-option label="销户" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户状态：">
        <el-select v-model="WLWQueryParam.CustomerOpenAccountState" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开户" value="1"></el-option>
          <el-option label="销户" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阀门状态：">
        <el-select v-model="WLWQueryParam.ValveState" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开户" value="1"></el-option>
          <el-option label="销户" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水表状态：">
        <el-select v-model="WLWQueryParam.MeterState" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开户" value="1"></el-option>
          <el-option label="销户" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" size="small" class="cl-search" @click="searchWLWMeterInfo">
          <i class="icon iconfont">&#xe694;</i>
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 clearfix">
      <el-button
        type="warning"
        size="small"
        class="fr"
        style="margin-left: 10px;"
        @click="setCustomData()"
      >
        <i class="icon iconfont">&#xe678;</i> 表格自定义
      </el-button>
      <el-button type="success" size="small" class="fr" @click="ExcelWLWInfo">
        <i class="icon iconfont">&#xe683;</i> 导出Excel
      </el-button>
    </div>
    <customTable ref="myChild" />
    <Static />
    <div class="main-padding-20-y" id="table">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        fit
        :height="tableHeight"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        :cell-style="{'padding':'5px 0'}"
      >
        <template v-for="(item ,index) in tableHeadData">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="150px"
            :sortable="item.IsSortBol?'custom':null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed="item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="150px"
            sortable="custom"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
          />
        </template>
        <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
        <el-table-column label="操作" width="300px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation3" @click="meterReadingPlanDetail(scope.row.Id)">详情</a>

            <a class="operation4" @click="delMeterReadingPlan(scope.row.Id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="WLWQueryParam.page"
        :limit.sync="WLWQueryParam.limit"
      />
    </div>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import Static from "./intercomponents/Static"; //异常统计
import { getDictionaryOption } from "@/utils/permission";
import { getWLWWaterInfo, excelWLWWaterInfo } from "@/api/waterMeterMang";
export default {
  //机械表
  name: "InternetWater",
  components: { customTable, Pagination, Static },
  data() {
    return {
      WLWQueryParam: {
        page: 1,
        limit: 10,
        CustomerNo: "", //用户编号
        WaterMeterNo: "", //水表编号
        CustomerMeterState: "-1", //用户水表状态
        CustomerOpenAccountState: "-1", //用户开户状态
        ValveState: "-1", //阀门状态
        MeterState: "-1", //水表状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000024"
      },
      tableKey: 1,
      tableData: [],
      tableHeight: null, //表格高度
      customHeight: "", //自定义高度
      checksData: [],
      total: 0
    };
  },
  created() {
    this.CustomerMeterStateList = getDictionaryOption("用户状态");
    this.TrafficStatusList = getDictionaryOption("远传表通讯状态");
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("section-container")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      58;
    this.$refs.myChild.GetTable(this.WLWQueryParam.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
  },
  watch: {
    customHeight() {
      //获取自定义模块高度
      let that = this;
      that.$nextTick(() => {
        that.tableHeight =
          document.getElementsByClassName("section-container")[0].offsetHeight -
          document.getElementById("table").offsetTop -
          58;
      });
    }
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
  methods: {
    searchWLWMeterInfo() {
      let that = this;
      getWLWWaterInfo(that.WLWQueryParam).then(res => {
        if (res.code == 0) {
          that.tableData = res.data;
          that.total = res.count;
        } else {
          that.$message({
            message: res.msg ? res.msg : "查询失败",
            type: "warning"
          });
        }
      });
    },
    setCustomData() {
      //表格自定义方法
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
    },
    ExcelWLWInfo() {
      //导出
      let that = this;
      excelWLWWaterInfo(that.WLWQueryParam).then(res => {
        if (res.code == 0) {
          window.location.href = `${this.common.excelPath}${res.data}`;
          that.$message({
            message: res.msg ? res.msg : "导出成功",
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg ? res.msg : "导出失败",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>