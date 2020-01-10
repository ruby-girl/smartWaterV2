<template>
  <div class="mac-contianer">
    <div ref="formHeight"></div>
    <div class="position-search-head">
      <el-form
        :inline="true"
        :model="WLWQueryParam"
        :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
        size="small"
        label-width="70px"
        @submit.native.prevent
        ref="searcTable"
        style="width:100%"
      >
        <el-form-item label="水表编号" v-show="show1||isShow" key="WaterMeterNo" prop="WaterMeterNo">
          <el-input
            v-model="WLWQueryParam.WaterMeterNo"
            maxlength="20"
            @change="getText(WLWQueryParam.WaterMeterNo,'WaterMeterNo','','水表编号')"
          />
        </el-form-item>
        <el-form-item label="水表状态" v-show="show2||isShow" key="MeterState" prop="MeterState">
          <el-select
            v-model="WLWQueryParam.MeterState"
            placeholder="请选择"
            @change="getText(WLWQueryParam.MeterState,'MeterState',waterTypeList,'水表状态')"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="item in waterTypeList"
              :label="item.Name"
              :value="item.Id"
              :key="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阀门状态" v-show="show3||isShow" key="ValveState" prop="ValveState">
          <el-select
            v-model="WLWQueryParam.ValveState"
            placeholder="请选择"
            @change="getText(WLWQueryParam.ValveState,'ValveState',valStateList,'阀门状态')"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="item in valStateList"
              :label="item.Name"
              :value="item.Id"
              :key="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="show4||isShow" key="CustomerQueryType" prop="CustomerQueryValue">
          <el-select
            v-model="WLWQueryParam.CustomerQueryType"
            placeholder="请选择"
            style="width: 100px;float: left;margin-right:4px;"
            class="short-select"
            @change="getscName(WLWQueryParam.CustomerQueryType)"
          >
            <el-option label="姓名/简码" value="2"></el-option>
            <el-option label="用户编号" value="1"></el-option>
            <!-- <el-option label="电话" value="3"></el-option>
            <el-option label="证件号" value="4"></el-option>
            <el-option label="用户地址" value="5"></el-option> -->
          </el-select>
          <el-input
            v-model="WLWQueryParam.CustomerQueryValue"
            maxlength="20"
            placeholder="(长度1-30)"
            @keyup.enter.native="handleFilter"
            @change="getText(WLWQueryParam.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
            style="width: 180px;float: left"
          />
        </el-form-item>

        <el-form-item
          label="用户状态"
          v-show="show5||isShow"
          key="CustomerMeterState"
          prop="CustomerMeterState"
        >
          <el-select
            v-model="WLWQueryParam.CustomerMeterState"
            placeholder="请选择"
            @change="getText(WLWQueryParam.CustomerMeterState,'CustomerMeterState',userStateList,'用户状态')"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="item in userStateList"
              :label="item.Name"
              :value="item.Id"
              :key="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开户状态"
          v-show="show6||isShow"
          key="CustomerOpenAccountState"
          prop="CustomerOpenAccountState"
        >
          <el-select
            v-model="WLWQueryParam.CustomerOpenAccountState"
            placeholder="请选择"
            @change="getText(WLWQueryParam.CustomerOpenAccountState,'CustomerOpenAccountState',statusList,'开户状态')"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="item in statusList"
              :label="item.Name"
              :value="item.Id"
              :key="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <span class="isShow" v-if="showBtn" :class="{tro:isShow}">
            <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
          </span>
          <el-button type="primary" size="mini" @click="searchWLWMeterInfo" round>
            <i class="icon iconfont">&#xe694;</i>查询
          </el-button>
          <el-button size="mini" class="btn-add" round @click="resetting">
            <i class="iconfont icon_zhongzhi"></i>重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contanier">
      <div class="cl-operation1 clearfix" style="margin-bottom:8px;">
        <el-button size="mini" class="fl borderClass" round @click="orderLockWLWOpen(1)">
          <i class="icon iconfont">&#xe646;</i>阀门锁定开
        </el-button>
        <el-button size="mini" class="fl borderClass" round @click="orderLockWLWClose(0)">
          <i class="icon iconfont">&#xe643;</i>阀门锁定关
        </el-button>
        <el-button size="mini" class="fl borderClass" round @click="orderUnockWLW(0)">
          <i class="icon iconfont">&#xe645;</i>解锁
        </el-button>
      </div>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="ExcelWLWInfo" />
      <Static class="static-height" :ErrorList="ErrorList" />
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
          highlight-current-row
          @current-change="handleCurrentChange"
          @sort-change="sortChanges"
        >
          <el-table-column type="index" fixed="left" label="#" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(WLWQueryParam.page - 1) * WLWQueryParam.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
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
              align="center"
              :label="item.ColDesc"
            />
          </template>

          <el-table-column label="操作" width="100px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="查看历史详情"
                placement="bottom"
              >
                <i class="icon iconfont viewHis" @click="waterMeterWLWDetail(scope.row.Id)">&#xe670;</i>
              </el-tooltip>
               <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="编辑"
                placement="bottom"
              >
                <i
                  class="icon iconfont editJxWater"
                  @click=""
                >&#xe69f;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="WLWQueryParam.page"
          :limit.sync="WLWQueryParam.limit"
          @pagination="searchWLWMeterInfo('0')"
        />
      </div>
    </div>
    <el-dialog
      title="历史详情"
      :visible.sync="viewWaterHistory"
      top="20vh"
      width="836px"
      hight="432px"
      center
      :close-on-click-modal="false"
    >
      <wLW-water-meterHis :hisData="hisData" :meterReadListParam="Bl_WaterMeter4His" />

      <pagination
        v-show="histotal>0"
        :total="histotal"
        :page.sync="Bl_WaterMeter4His.page"
        :limit.sync="Bl_WaterMeter4His.limit"
        @pagination="waterMeterWLWDetail(Bl_WaterMeter4His.Meter4Id)"
      />
    </el-dialog>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import Static from "./intercomponents/Static"; //异常统计
import WLWWaterMeterHis from "./intercomponents/WLWWaterMeterHis"; //历史
import { getDictionaryOption } from "@/utils/permission";
import {
  getWLWWaterInfo, //查询
  excelWLWWaterInfo, //导出
  GetMeter4ErrorTypeNum, //异常统计
  searWLWHisWater, //历史
  ValveUnLock, //解锁，
  ValveLockOpen, //开
  ValveLockClose //关
} from "@/api/waterMeterMang";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem, getName } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  //机械表
  name: "InternetWater",
  components: { SearchTips, Pagination, Static, WLWWaterMeterHis },
  watch: {
    screenWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        this.show5 = this.showLabel(5, val);
        this.show6 = this.showLabel(6, val);
      },
      immediate: true
    }
  },
  data() {
    return {
      WLWQueryParam: {
        page: 1,
        limit: 20,
        CustomerQueryType:"1",//用户编号
        CustomerQueryValue:"",
        WaterMeterNo: "", //水表编号
        CustomerMeterState: -1, //用户水表状态
        CustomerOpenAccountState: -1, //用户开户状态
        ValveState: -1, //阀门状态
        MeterState: -1, //水表状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000024"
      },
      tableKey: 1,
      tableData: [],
      tableHeight: null, //表格高度
      customHeight: "", //自定义高度
      checksData: [],
      total: 0,
      ErrorList: {}, //异常统计
      Bl_WaterMeter4His: {
        Meter4Id: "",
        limit: 10,
        page: 1,
        sort: "",
        filed: "",
        tableId: ""
      },
      SelectionList: "",
      hisData: [],
      histotal: 0,
      viewWaterHistory: false,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      userStateList: [
        { Id: 0, Name: "正常" },
        { Id: 10, Name: "余额不足" },
        { Id: 8, Name: "欠费关阀" }
      ], //用户状态
      valStateList: [
        { Id: 1, Name: "正常开阀" },
        { Id: 2, Name: "阀门开到位" },
        { Id: 3, Name: "正在关阀" },
        { Id: 4, Name: "阀门关到位" }
      ], //阀门状态
      statusList: [{ Id: 0, Name: "已开户" }, { Id: 1, Name: "未开户" }], //用户开户
      waterTypeList: [{ Id: 0, Name: "正常" }, { Id: 1, Name: "异常" }], //水表状态
      screenWidth: null,
      showBtn: false,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      show6: true,
      secNmae: "用户编号"
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
      98;
    this.$refs.searchTips.$refs.myChild.GetTable(this.WLWQueryParam.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.$nextTick(() => {
      this.screenWidth = this.$refs.formHeight.clientWidth;
      if (Math.floor((this.screenWidth - 180) / 280) <= 6) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    });
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
    getscName(id) {
      this.secNmae = getName(id);
    },
    resetting() {
      //重置
      this.$refs["searcTable"].resetFields();
      this.tipsDataCopy = [];
      this.searchWLWMeterInfo();
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },
    delTips(val) {
      //返回的查询条件的属性
      this.tipsDataCopy = delTips(
        val,
        this,
        this.tipsDataCopy,
        "WLWQueryParam"
      );
      this.searchWLWMeterInfo();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    searchWLWMeterInfo(num) {
      let that = this;
      this.SelectionList=""
      if (num != 0) {
        this.orderData = Object.assign({}, this.WLWQueryParam);
        this.orderData.page = 1;
      } else {
        this.orderData.page = this.WLWQueryParam.page;
      }

      getWLWWaterInfo(that.orderData).then(res => {
        if (res.code == 0) {
          this.tipsData = pushItem(this.tipsDataCopy);
          that.tableData = res.data;
          that.total = res.count;
        } else {
          that.$message({
            message: res.msg ? res.msg : "查询失败",
            type: "warning"
          });
        }
      });
      GetMeter4ErrorTypeNum().then(res => {
        //统计
        that.ErrorList = res.data;
      });
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.WLWQueryParam.page = 1;
      this.WLWQueryParam.filed = prop;
      this.WLWQueryParam.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchWLWMeterInfo();
    },
    setCustomData() {
      //表格自定义方法
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
    },
    ExcelWLWInfo() {
      //导出
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      let that = this;
      excelWLWWaterInfo(that.orderData).then(res => {
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
    waterMeterWLWDetail(id) {
      //历史详情
      let that = this;
      that.viewWaterHistory = true;
      that.Bl_WaterMeter4His.Meter4Id = id;
      searWLWHisWater(that.Bl_WaterMeter4His).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    },
    handleCurrentChange(val) {
      if(val){
        //选中行数据
        console.log(val)
        this.SelectionList = val.Id;

      }
    },
    orderLockWLWOpen() {
      //开
      //阀门锁定
      const that = this;
      if (that.SelectionList == "") {
        that.$message({
          message: "请选择数据后在进行操作",
          type: "warning"
        });
        return false;
      }
      ValveLockOpen({ SA_WaterMeter_Id: that.SelectionList }).then(res => {
        if (res.code == 0) {
          that.searchWLWMeterInfo();
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
    },
    orderLockWLWClose() {
      //关
      //阀门锁定
      const that = this;
      if (that.SelectionList == "") {
        that.$message({
          message: "请选择数据后在进行操作",
          type: "warning"
        });
        return false;
      }
      ValveLockClose({ SA_WaterMeter_Id: that.SelectionList }).then(res => {
        if (res.code == 0) {
          that.searchWLWMeterInfo();
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
    },
    orderUnockWLW() {
      //阀门解锁
      let that = this;
      if (that.SelectionList == "") {
        that.$message({
          message: "请选择数据后在进行操作",
          type: "warning"
        });
        return false;
      }
      ValveUnLock({ SA_WaterMeter_Id: that.SelectionList }).then(res => {
        if (res.code == 0) {
          that.searchWLWMeterInfo();
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
