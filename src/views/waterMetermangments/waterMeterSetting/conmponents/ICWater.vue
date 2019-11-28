<template>
  <div class="mac-contianer">
    <el-form
      :inline="true"
      :model="IcwachMeterData"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="姓名：">
        <el-input v-model="IcwachMeterData.CustomerName" maxlength="20" placeholder="(长度1-30)" />
      </el-form-item>
      <el-form-item label="水表编号：">
        <el-input v-model="IcwachMeterData.WaterMeterNo" maxlength="20" />
      </el-form-item>
      <el-form-item label="水表样式：">
        <el-select v-model="IcwachMeterData.wms" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in waterMeterList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态：">
        <el-select v-model="IcwachMeterData.cs" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in openStatus"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" size="small" class="cl-search" @click="searchFun">
          <i class="icon iconfont">&#xe694;</i>
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 clearfix">
      <el-button
        type="warning"
        size="small"
        class="fr c"
        style="margin-left: 10px;"
        @click="setCustomData()"
      >
        <i class="icon iconfont">&#xe678;</i> 表格自定义
      </el-button>
      <el-button type="success" size="small" class="fr" @click="excelWaterMeter">
        <i class="icon iconfont">&#xe683;</i> 导出Excel
      </el-button>
    </div>
    <customTable ref="myChild" />
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
        @sort-change="sortChanges"
      >
        <template v-for="(item ,index) in tableHeadData">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="170px"
            :sortable="item.IsSortBol?'custom':null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed="item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="170px"
            sortable="custom"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
          />
        </template>
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(IcwachMeterData.page - 1) * IcwachMeterData.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="viewHis" @click="waterMeterICDetail(scope.row.Id)">查看历史详情</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="IcwachMeterData.page"
        :limit.sync="IcwachMeterData.limit"
      />
    </div>
    <el-dialog
      title="历史详情"
      :visible.sync="viewWaterHistory"
      top="30vh"
      width="836px"
      hight="432px"
      center
      :close-on-click-modal="false"
    >
      <iC-water-meterHis
        :hisData="hisData"
        @sortProp="sortProp"
        :meterReadListParam="meterReadListParam"
      />

      <pagination
        v-show="histotal>0"
        :total="histotal"
        :page.sync="meterReadListParam.page"
        :limit.sync="meterReadListParam.limit"
        @pagination="waterMeterJxDetail(waterMeterICDetail.WaterMeterId)"
      />
    </el-dialog>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页

import {
  searICMeterWater,
  searICHisWater,
  excelICMeterWater
} from "@/api/waterMeterMang";
import ICWaterMeterHis from "./intercomponents/ICWaterMeterHis";
export default {
  //机械表
  name: "ICWater",
  components: { customTable, Pagination, ICWaterMeterHis },
  props: {
    waterMeterList: {
      type: Array,
      default: []
    },
    openStatus: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      IcwachMeterData: {
        //查询
        page: 1,
        limit: 10,
        CustomerName: "", // 用户名 ,
        WaterMeterNo: "", //水表编号 ,
        wms: "-1", //水表样式
        cs: "-1", //开户状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000023"
      },

      meterReadListParam: {
        //历史数据
        WaterMeterId: "", //水表Id ,
        limit: 10, //表格每页数据条数 ,
        page: 1, //表格当前页面 从1开始 ,
        sort: "", // 排序方式 ASC或DESC ,
        filed: "", // 排序字段 ,
        tableId: "" // 表格Id 用于导出
      },
      tableKey: 1,
      tableData: [],
      tableHeight: null, //表格高度
      customHeight: "", //自定义高度
      checksData: [],
      total: 0,
      hisData: [],
      histotal: 0,
      viewWaterHistory: false
    };
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("section-container")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      58;
    this.$refs.myChild.GetTable(this.IcwachMeterData.tableId); // 先获取所有自定义字段赋值
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
    searchFun() {
      let that = this;
      searICMeterWater(that.IcwachMeterData).then(res => {
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
    sortChanges({ column, prop, order }) {
      //排序
      this.IcwachMeterData.page = 1;
      this.IcwachMeterData.filed = prop;
      this.IcwachMeterData.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchFun();
    },
    excelWaterMeter() {
      let that = this;
      excelICMeterWater(that.IcwachMeterData).then(res => {
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
    },
    setCustomData() {
      //表格自定义方法
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
    },
    waterMeterICDetail(id) {
      let that = this;
      that.viewWaterHistory = true;
      that.meterReadListParam.WaterMeterId = id;
      searICHisWater(that.meterReadListParam).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    },
    sortProp(data) {
      let that = this;
      that.meterReadListParam.sort = data.sort;
      that.meterReadListParam.filed = data.filed;
      searICHisWater(that.meterReadListParam).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    }
  }
};
</script>