<template>
  <div class="mac-contianer">
    <el-form
      :inline="true"
      :model="YCMeterQueryParam"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="水表编号：">
        <el-input v-model="YCMeterQueryParam.CustomerQueryValue" maxlength="20" />
      </el-form-item>
      <el-form-item label="阀门状态：">
        <el-select v-model="YCMeterQueryParam.ValveState" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in ValveStateList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户状态：">
        <el-select v-model="YCMeterQueryParam.IsOpenAccount" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开户" value="0"></el-option>
          <el-option label="未开户" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通讯状态：">
        <el-select v-model="YCMeterQueryParam.TrafficStatus" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in TrafficStatusList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" size="small" class="cl-search" @click="searchYCWaterList">
          <i class="icon iconfont">&#xe694;</i>
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 clearfix">
      <el-button
        type="success"
        size="small"
        class="fl"
        style="background:rgba(51,179,0,1);border-color:rgba(51,179,0,1)"
        @click="meterRedingYC"
      >
        <i class="icon iconfont" style="font-size:12px">&#xe642;</i> 抄表
      </el-button>
      <el-button
        type="success"
        size="small"
        class="fl"
        style="background:rgba(0,178,161,1);border-color:rgba(0,178,161,1)"
        @click="orderLockYC(1)"
      >
        <i class="icon iconfont" style="font-size:12px">&#xe646;</i> 阀门锁定开
      </el-button>
      <el-button
        type="success"
        size="small"
        class="fl"
        style="background:rgba(229,169,3,1);border-color:rgba(229,169,3,1)"
        @click="orderLockYC(0)"
      >
        <i class="icon iconfont" style="font-size:12px">&#xe643;</i> 阀门锁定关
      </el-button>
      <el-button
        type="success"
        size="small"
        class="fl"
        style="background:rgba(117,194,0,1);border-color:rgba(117,194,0,1)"
        @click="orderUnockYC"
      >
        <i class="icon iconfont" style="font-size:12px">&#xe645;</i> 解锁
      </el-button>
      <el-button
        type="warning"
        size="small"
        class="fr c"
        style="margin-left: 10px;"
        @click="setCustomData()"
      >
        <i class="icon iconfont">&#xe678;</i> 表格自定义
      </el-button>
      <el-button type="success" size="small" class="fr" @click="ExcelYcInfo">
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
        @selection-change="selectionChange"
      >
        >
        <el-table-column type="selection" fixed="left" width="55"></el-table-column>
        <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />

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
        <el-table-column label="操作" width="150px" align="center" fixed="right">
          <template slot-scope="scope">
            <a
              class="viewHis"
              v-if="scope.row.SA_Customer_Id!=''"
              @click="waterMeterYCDetail(scope.row.SA_Customer_Id)"
            >查看历史详情</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="YCMeterQueryParam.page"
        :limit.sync="YCMeterQueryParam.limit"
      />
    </div>
    <el-dialog
      title="历史详情"
      :visible.sync="viewWaterHistory"
      top="30vh"
      width="1000px"
      hight="432px"
      center
      :close-on-click-modal="false"
    >
      <yC-water-meterHis :hisData="hisData" @sortProp="sortProp" />

      <pagination
        v-show="histotal>0"
        :total="histotal"
        :page.sync="meterReadListParam.page"
        :limit.sync="meterReadListParam.limit"
        @pagination="waterMeterJxDetail(meterReadListParam.WaterMeterId)"
      />
    </el-dialog>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import { getDictionaryOption } from "@/utils/permission";
import {
  searYCMeterWater,
  exportYCWaterINfo,
  searYCHisWater,
  readYCWaterinfo,
  lockYCChange,
  unLockYCChange
} from "@/api/waterMeterMang";
import YCWaterMeterHis from "./intercomponents/YCWaterMeterHis"; //历史
export default {
  //机械表
  name: "MechanicalWater",
  components: { customTable, Pagination, YCWaterMeterHis },
  data() {
    return {
      YCMeterQueryParam: {
        page: 1,
        limit: 10,
        CustomerQueryType: "6", //水表编号
        CustomerQueryValue: "", //水表编号值
        ValveState: "", //阀门状态
        TrafficStatus: "-1", //通讯状态
        IsOpenAccount: "", //开户状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000022"
      },
      meterReadListParam: {
        //历史数据
        customerId: "", //水表Id ,
        limit: 10, //表格每页数据条数 ,
        page: 1, //表格当前页面 从1开始 ,
        sort: "", // 排序方式 ASC或DESC ,
        filed: "", // 排序字段 ,
        tableId: "" // 表格Id 用于导出
      },
      ValveStateList: [],
      TrafficStatusList: [],
      tableKey: 1,
      tableData: [],
      tableHeight: null, //表格高度
      customHeight: "", //自定义高度
      checksData: [],
      total: 0,
      hisData: [],
      histotal: 0,
      viewWaterHistory: false,
      SelectionList: []
    };
  },
  created() {
    this.ValveStateList = getDictionaryOption("远传表阀门状态");
    this.TrafficStatusList = getDictionaryOption("远传表通讯状态");
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("section-container")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      58;
    this.$refs.myChild.GetTable(this.YCMeterQueryParam.tableId); // 先获取所有自定义字段赋值
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
    searchYCWaterList() {
      //查询
      let that = this;
      searYCMeterWater(that.YCMeterQueryParam).then(res => {
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
    ExcelYcInfo() {
      //导出
      let that = this;
      exportYCWaterINfo(that.YCMeterQueryParam).then(res => {
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
    waterMeterYCDetail(id) {
      //历史
      let that = this;
      that.viewWaterHistory = true;
      that.meterReadListParam.customerId = id;
      searYCHisWater(that.meterReadListParam).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    },
    sortProp(data) {
      //历史记录排序
      let that = this;
      that.meterReadListParam.sort = data.sort;
      that.meterReadListParam.filed = data.filed;
      searYCHisWater(that.meterReadListParam).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    },
    selectionChange(val) {
      //多选框数据
      let that = this;
      that.SelectionList=[]
      val.forEach(function(data) {
        that.SelectionList.push(data.Id);
      });
    },
    meterRedingYC() {
      let that = this;
      console.log(1);
      readYCWaterinfo(that.SelectionList).then(res => {
        console.log(res);
        if (res.code == 0) {
          that.searYCMeterWater();
          that.$message({
            message: res.msg ? res.msg : "抄表成功",
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg ? res.msg : "抄表失败",
            type: "warning"
          });
        }
      });
    },
    orderLockYC(num) {
      let IsOpen;
      let that = this;
      if (num) {
        IsOpen = true;
      } else {
        IsOpen = false;
      }
      lockYCChange({ isOpen: IsOpen, waterMeterId: that.SelectionList }).then(
        res => {
          if (res.code == 0) {
            that.searYCMeterWater();
            that.$message({
              message: res.msg ? res.msg : "操作成功",
              type: "success"
            });
          } else {
            that.$message({
              message: res.msg ? res.msg : "操作失败",
              type: "warning"
            });
          }
        }
      );
    },
    orderUnockYC() {
      let that = this;
      unLockYCChange(that.SelectionList).then(res => {
        console.log(res);
        if (res.code == 0) {
          that.searYCMeterWater();
          that.$message({
            message: res.msg ? res.msg : "操作成功",
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg ? res.msg : "操作失败",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>