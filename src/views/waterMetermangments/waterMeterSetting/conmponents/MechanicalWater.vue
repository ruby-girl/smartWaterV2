<template>
  <div class="mac-contianer">
    <div ref="formHeight"></div>
    <div class="position-search-head">
      <el-form
        :inline="true"
        :model="wachMeterData"
        :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
        size="small"
        label-width="70px"
        @submit.native.prevent
        ref="searcTable"
      >

       
        <!-- <el-form-item
          label="姓名"
          v-show="show1||isShow"
          prop="CustomerName"
          key="CustomerName"
          :label-width="isShow?'70px':'40px'"
        >
          <el-input
            v-model="wachMeterData.CustomerName"
            maxlength="10"
            placeholder="(长度1-10)"
            @change="getText(wachMeterData.CustomerName,'CustomerName','','姓名')"
          />
        </el-form-item> -->
        <el-form-item label="水表编号" v-show="show1||isShow" key="WaterMeterNo" prop="WaterMeterNo">
          <el-input
            v-model="wachMeterData.WaterMeterNo"
            maxlength="50"
            @change="getText(wachMeterData.WaterMeterNo,'WaterMeterNo','','水表编号')"
          />
        </el-form-item>
        <el-form-item label="水表样式" v-show="show2||isShow" key="wachMeterData" prop="wachMeterData">
          <el-select
            v-model="wachMeterData.wms"
            placeholder="请选择"
            @change="getText(wachMeterData.wms,'wms',waterMeterList,'水表样式')"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in waterMeterList"
              :label="item.Name"
              :value="item.Id"
              :key="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item v-show="show3||isShow" key="CustomerQueryType" prop="CustomerQueryValue">
          <el-select
            v-model="wachMeterData.QueryType"
            placeholder="请选择"
            style="width: 100px;float: left;margin-right:4px;"
            class="short-select"
            @change="getscName(wachMeterData.QueryType)"
          >
            <el-option label="姓名" value="2"></el-option>
            <el-option label="用户编号" value="1"></el-option>
           
          </el-select>
          <el-input
            v-model="wachMeterData.Customer"
            maxlength="20"
            placeholder="(长度1-30)"
            @keyup.enter.native="handleFilter"
            @change="getText(wachMeterData.Customer,'Customer','',secNmae)"
            style="width: 180px;float: left"
          />
        </el-form-item>
        <el-form-item label="用户状态" v-show="show4||isShow" key="cs" prop="cs">
          <el-select
            v-model="wachMeterData.cs"
            placeholder="请选择"
            @change="getText(wachMeterData.cs,'cs',openStatus,'用户状态')"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in openStatus"
              :label="item.Name"
              :value="item.Id"
              :key="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="isShow" v-if="showBtn" :class="{tro:isShow}">
            <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
          </span>
          <el-button type="primary" size="mini" @click="searchWatetJX" round>
            <i class="icon iconfont">&#xe694;</i>查询
          </el-button>
          <el-button size="mini" class="btn-add" round @click="resetting">
            <i class="iconfont icon_zhongzhi"></i>重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contanier">
      <search-tips
        :tipsData="tipsData"
        ref="searchTips"
        @delTips="delTips"
        @excel="excelWaterMeter"
      />
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
              :key="index"
              min-width="190px"
              :sortable="item.IsSortBol?'custom':null"
              :prop="item.ColProp"
              align="center"
              :label="item.ColDesc"
              :fixed="item.Freeze"
            />
          </template>
          <el-table-column type="index" fixed="left" label="#" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(wachMeterData.page - 1) * wachMeterData.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="查看历史详情"
                placement="bottom"
              >
                <i class="icon iconfont viewHis" @click="waterMeterJxDetail(scope.row.Id)">&#xe670;</i>
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
                  @click="editwaterMeterJx(scope.row.Id)"
                >&#xe69f;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="wachMeterData.page"
          :limit.sync="wachMeterData.limit"
          @pagination="searchWatetJX('0')"
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
      <water-meterHis
        :hisData="hisData"
        @sortProp="sortProp"
        :meterReadListParam="meterReadListParam"
      />

      <pagination
        v-show="histotal>0"
        :total="histotal"
        :page.sync="meterReadListParam.page"
        :limit.sync="meterReadListParam.limit"
        @pagination="waterMeterJxDetail(meterReadListParam.WaterMeterId)"
      />
    </el-dialog>
    <editJX-waterMeter
      :edit-show.sync="editShow"
      :editopenStatus="openStatus"
      :editwaterMeterList="waterMeterList"
      :editInfo="editInfo"
    />
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem ,getName} from "@/utils/projectLogic"; //搜索条件面包屑
import {
  searJXMeterWater,
  searJXHisWater,
  editJXHisWater,
  excelJXMeterWater
} from "@/api/waterMeterMang";
import WaterMeterHis from "./intercomponents/WaterMeterHis";
import EditJXWaterMeter from "./intercomponents/EditJXWaterMeter";
import { legalTime } from "@/utils/index"; //时间格式化
export default {
  //机械表
  name: "MechanicalWater",
  components: { SearchTips, Pagination, WaterMeterHis, EditJXWaterMeter },
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
  watch: {
    screenWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
      },
      immediate: true
    }
  },
  data() {
    return {
      viewWaterHistory: false, //历史
      wachMeterData: {
        page: 1,
        limit: 20,
        QueryType: "", // 用户名 ,
        Customer: "", // 用户名 ,
        WaterMeterNo: "", //水表编号 ,
        wms: "-1", //水表样式
        cs: "-1", //开户状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000021"
      },
      hisData: [],
      tableKey: 1,
      tableData: [],
      tableHeight: null, //表格高度
      customHeight: "", //自定义高度
      checksData: [],
      total: 0,
      meterReadListParam: {
        WaterMeterId: "", //水表Id ,
        limit: 10, //表格每页数据条数 ,
        page: 1, //表格当前页面 从1开始 ,
        sort: "", // 排序方式 ASC或DESC ,
        filed: "", // 排序字段 ,
        tableId: "" // 表格Id 用于导出
      },
      histotal: 0,
      editId: "", //获取行信息id
      editShow: false, //编辑
      editInfo: {},
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      screenWidth: null,
      showBtn: false,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      secNmae:""
    };
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("section-container")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      98;
    this.$refs.searchTips.$refs.myChild.GetTable(this.wachMeterData.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.$nextTick(() => {
      this.screenWidth = this.$refs.formHeight.clientWidth;
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
      this.searchWatetJX();
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) < 4) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
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
        "wachMeterData"
      );
      this.searchWatetJX();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    sortProp(data) {
      //历史列表排序
      let that = this;
      that.meterReadListParam.sort = data.sort;
      that.meterReadListParam.filed = data.filed;
      searJXHisWater(that.meterReadListParam).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.wachMeterData.page = 1;
      this.wachMeterData.filed = prop;
      this.wachMeterData.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchWatetJX();
    },
    searchWatetJX(num) {
      //查询
      let that = this;

      if (num != 0) {
        this.orderData = Object.assign({}, this.wachMeterData);
        this.orderData.page = 1;
      } else {
        this.orderData.page = this.wachMeterData.page;
      }
      searJXMeterWater(that.orderData).then(res => {
        if (res.code == 0) {
          that.tableData = res.data;
          this.tipsData = pushItem(this.tipsDataCopy);
          that.total = res.count;
          let timeObj = that.tableData;
          timeObj.forEach((item, index) => {
            for (let i in item) {
              i == "ReadDate" ? (item[i] = legalTime(item[i])) : "";
            }
          });
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
    waterMeterJxDetail(id) {
      //历史列表
      let that = this;
      that.viewWaterHistory = true;
      that.meterReadListParam.WaterMeterId = id;
      searJXHisWater(that.meterReadListParam).then(res => {
        that.hisData = res.data;
        that.histotal = res.count;
      });
    },
    editwaterMeterJx(id) {
      //编辑
      this.editShow = true;
      editJXHisWater({ WaterMeterId: id }).then(res => {
        this.editInfo = res.data;
      });
    },
    excelWaterMeter() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      let that = this;
      excelJXMeterWater(that.orderData).then(res => {
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