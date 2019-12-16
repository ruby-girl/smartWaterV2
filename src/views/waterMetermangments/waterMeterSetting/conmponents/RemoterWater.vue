<template>
  <div class="mac-contianer" style>
    <el-container>
      <el-aside width="0">
        <ul>
          <li v-for="itemList in deviceList">
            <p class="item-title">
              <i
                class="icon iconfont showFlase"
                style="font-size:12px"
                @click="isshow=!isshow"
              >{{isshow?"&#xe657;":"&#xe658;"}}</i>
              <span class="title-name">{{itemList.ConcentratorNo}}({{itemList.AreaName}})</span>
              <img :src="itemList.IsOnline?imgSuccess:imgLose" />
            </p>
            <div v-show="isshow" class="cjNum">
              <p
                :class="{active:item==deiKey}"
                v-for="(item,index) in itemList.listCollNo"
                @click="changeColor(item)"
                :key="index"
              >00000000000{{item}}</p>
            </div>

            <p class="dateYC">{{itemList.RefreshTime}}</p>
          </li>
        </ul>
        <p class="boxMsg" v-if="showMsg">暂无数据</p>
        <span v-show="ifShow" class="telescopic telescopic2" @click="closeAccount">
          用户详情
          <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
        </span>
      </el-aside>
      <el-main>
        <div ref="formHeight"></div>
        <el-form
          :inline="true"
          :model="YCMeterQueryParam"
          :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
          size="small"
          label-width="70px"
          @submit.native.prevent
          ref="searcTable"
        >
          <el-form-item
            label="水表编号"
            v-show="show1||isShow"
            key="CustomerQueryValue"
            prop="CustomerQueryValue"
          >
            <el-input
              v-model="YCMeterQueryParam.CustomerQueryValue"
              maxlength="20"
              @change="getText(YCMeterQueryParam.CustomerQueryValue,'CustomerQueryValue','','水表编号')"
            />
          </el-form-item>
          <el-form-item label="阀门状态" v-show="show2||isShow" key="ValveState" prop="ValveState">
            <el-select
              v-model="YCMeterQueryParam.ValveState"
              placeholder="请选择"
              @change="getText(YCMeterQueryParam.ValveState,'ValveState',ValveStateList,'阀门状态')"
            >
              <el-option label="全部" value="-1"></el-option>
              <el-option
                v-for="item in ValveStateList"
                :label="item.Name"
                :value="item.Id"
                :key="item.Name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="开户状态"
            v-show="show3||isShow"
            key="IsOpenAccount"
            prop="IsOpenAccount"
          >
            <el-select
              v-model="YCMeterQueryParam.IsOpenAccount"
              placeholder="请选择"
              @change="getText(YCMeterQueryParam.IsOpenAccount,'IsOpenAccount',statusList,'开户状态')"
            >
              <el-option label="全部" value="-1"></el-option>
              <el-option label="已开户" value="0"></el-option>
              <el-option label="未开户" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="通讯状态"
            v-show="show4||isShow"
            key="TrafficStatus"
            prop="TrafficStatus"
          >
            <el-select
              v-model="YCMeterQueryParam.TrafficStatus"
              placeholder="请选择"
              @change="getText(YCMeterQueryParam.TrafficStatus,'TrafficStatus',TrafficStatusList,'通讯状态')"
            >
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
            <span class="isShow" v-if="showBtn" :class="{tro:isShow}">
              <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
            </span>
            <el-button round type="primary" size="mini" @click="searchYCWaterList">
              <i class="iconfont iconsousuo"></i>搜索
            </el-button>
            <el-button
              class="btn-resetting"
              round
              plain
              type="primary"
              size="mini"
              @click="resetting"
            >
              <i class="iconfont icon_zhongzhi"></i>重置
            </el-button>
          </el-form-item>
        </el-form>
        <div class="cl-operation1 clearfix" style="margin-bottom:8px;">
          <el-button size="mini" class="fl borderClass" round @click="meterRedingYC">
            <i class="icon iconfont">&#xe642;</i>抄表
          </el-button>
          <el-button size="mini" class="fl borderClass" round @click="orderLockYC(1)">
            <i class="icon iconfont">&#xe646;</i>阀门锁定开
          </el-button>
          <el-button size="mini" class="fl borderClass" round @click="orderLockYC(0)">
            <i class="icon iconfont">&#xe643;</i>阀门锁定关
          </el-button>
          <el-button size="mini" class="fl borderClass" round @click="orderUnockYC">
            <i class="icon iconfont">&#xe645;</i>解锁
          </el-button>
        </div>

        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="ExcelYcInfo" />
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
            @sort-change="sortChanges"
          >
            <el-table-column type="selection" fixed="left" width="55"></el-table-column>
            <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
              <template slot-scope="scope">
                <span>{{(YCMeterQueryParam.page - 1) * YCMeterQueryParam.limit+ scope.$index + 1}}</span>
              </template>
            </el-table-column>

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
            <el-table-column label="操作" width="180px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  v-if="scope.row.SA_Customer_Id!=''"
                  effect="dark"
                  content="查看历史详情"
                  placement="bottom"
                >
                  <i
                    class="icon iconfont viewHis"
                    @click="waterMeterYCDetail(scope.row.SA_Customer_Id)"
                  >&#xe670;</i>
                </el-tooltip>
                <el-tooltip
                  v-if="scope.row.SA_Customer_Id!=''"
                  class="item"
                  effect="dark"
                  content="指令历史"
                  placement="bottom"
                >
                  <i
                    class="icon iconfont editJxWater"
                    @click="instructionsHis(scope.row.Id)"
                  >&#xe69f;</i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="YCMeterQueryParam.page"
            :limit.sync="YCMeterQueryParam.limit"
            @pagination="searchYCWaterList('0')"
          />
        </div>
        <el-dialog
          title="历史详情"
          :visible.sync="viewWaterHistory"
          top="20vh"
          width="1000px"
          hight="432px"
          center
          :close-on-click-modal="false"
        >
          <yC-water-meterHis
            :hisData="hisData"
            @sortProp="sortProp"
            :meterReadListParam="meterReadListParam"
            @childrenSearch="childrenSearch"
          />

          <pagination
            v-show="histotal>0"
            :total="histotal"
            :page.sync="meterReadListParam.page"
            :limit.sync="meterReadListParam.limit"
            @pagination="waterMeterYCDetail(meterReadListParam.customerId)"
          />
        </el-dialog>
        <span v-show="!ifShow" class="telescopic telescopic1" @click="closeAccount">
          用户详情
          <i class="iconfont iconshouqi1" style="font-size: 12px;"></i>
        </span>
      </el-main>
    </el-container>
    <instrction-order :orderHistory="orderHistory" ref="order" :orderid="orderid" />
  </div>
</template>
<script>
import TableCustom from "@/components/TableCustom/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import { getDictionaryOption } from "@/utils/permission";
import {
  searYCMeterWater,
  exportYCWaterINfo,
  searYCHisWater,
  readYCWaterinfo,
  lockYCChange,
  unLockYCChange,
  getWaterDevice,
  GetCommandRecord
} from "@/api/waterMeterMang";
import YCWaterMeterHis from "./intercomponents/YCWaterMeterHis"; //历史
import InstrctionOrder from "./intercomponents/InstrctionOrder"; //指令记录
import imgLose from "@/assets/imgs/loseYC.png";
import imgSuccess from "@/assets/imgs/successYC.png";
import SearchTips from "@/components/SearchTips/index";
import {
  delTips,
  getText,
  pushItem,
  getTipsChangeWidth
} from "@/utils/projectLogic"; //搜索条件面包屑
import { async } from "q";
export default {
  //机械表
  name: "MechanicalWater",
  components: { SearchTips, Pagination, YCWaterMeterHis, InstrctionOrder },
  data() {
    return {
      YCMeterQueryParam: {
        page: 1,
        limit: 10,
        CustomerQueryType: "6", //水表编号
        CollectorNo: "", //采集器
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
      hisData: [], //历史数据
      histotal: 0,
      viewWaterHistory: false,
      SelectionList: [], //表格选中数据
      deviceList: [],
      imgLose: imgLose,
      imgSuccess: imgSuccess,
      isshow: true,
      orderHistory: false,
      orderid: "",
      deiKey: -1,
      ifShow: false,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      showMsg: true,
      statusList: [{ Id: "0", Name: "已开户" }, { Id: "1", Name: "未开户" }],
      screenWidth: null,
      showBtn: false,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true
    };
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
    },
    ifShow() {
      let _this = this;
      setTimeout(function() {
        _this.searchWidth = _this.$refs.formHeight.clientWidth;
      }, 200);
    }
  },
  activated: function() {
    this.getdevice();
    this.timeFunction = setInterval(() => {
      this.getdevice();
    }, 6000);
  },
  beforeDestroy() {
    clearInterval(this.timeFunction);
  },
  created() {
    this.ValveStateList = getDictionaryOption("远传表阀门状态");
    this.TrafficStatusList = getDictionaryOption("远传表通讯状态");
  },
  mounted() {
    this.getdevice();
    this.timeFunction = setInterval(() => {
      this.getdevice();
    }, 60000);
    this.tableHeight =
      document.getElementsByClassName("section-container")[0].offsetHeight -
      document.getElementsByClassName("el-form")[0].offsetHeight -
      194;
    this.$refs.searchTips.$refs.myChild.GetTable(
      this.YCMeterQueryParam.tableId
    ); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.$nextTick(() => {
      this.screenWidth = this.$refs.formHeight.clientWidth;
      if (Math.floor((this.screenWidth - 180) / 280) < 4) {
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
    resetting() {
      //重置
      this.$refs["searcTable"].resetFields();
      this.tipsDataCopy = [];
      this.searchYCWaterList();
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },
    delTips(val) {
      //返回的查询条件的属性
      if (val == "CollectorNo") {
        this.deiKey = -1;
      }
      this.tipsDataCopy = delTips(
        val,
        this,
        this.tipsDataCopy,
        "YCMeterQueryParam"
      );
      this.searchYCWaterList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
      if (obj.name && model == "CollectorNo") {
        this.searchYCWaterList();
      }
    },
    closeAccount() {
      this.ifShow = !this.ifShow;
      if (this.ifShow) {
        document.getElementsByClassName("el-aside")[0].classList.remove("none");
        document.getElementsByClassName("el-aside")[0].classList.add("hide");
        getTipsChangeWidth(this);
      } else {
        document.getElementsByClassName("el-aside")[0].classList.remove("hide");
        document.getElementsByClassName("el-aside")[0].classList.add("none");
        getTipsChangeWidth(this);
      }
    },
    changeColor(index) {
      this.deiKey = index;
      this.YCMeterQueryParam.CollectorNo = "00000000000" + index;
      this.getText(
        this.YCMeterQueryParam.CollectorNo,
        "CollectorNo",
        "",
        "采集器"
      );
    },
    instructionsHis(id) {
      //指令记录
      this.orderid = id;
      this.orderHistory = true;
    },
    //删除操作成功后
    getdevice() {
      getWaterDevice().then(res => {
        if (res.code == 0) {
          this.showMsg = false;
          if (res.data.length < 1) {
            this.showMsg = true;
          }
          this.deviceList = res.data;
        } else {
          this.showMsg = true;
        }
      });
    },
    childrenSearch() {
      searYCHisWater(this.meterReadListParam).then(res => {
        this.hisData = res.data;
        this.histotal = res.count;
      });
    },
    searchYCWaterList(num) {
      //查询
      let that = this;
      if (num != "0") {
        this.orderData = Object.assign({}, this.YCMeterQueryParam);
      }
      searYCMeterWater(that.orderData).then(res => {
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
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.YCMeterQueryParam.page = 1;
      this.YCMeterQueryParam.filed = prop;
      this.YCMeterQueryParam.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchYCWaterList();
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
      that.SelectionList = [];
      val.forEach(function(data) {
        that.SelectionList.push(data.Id);
      });
    },
    meterRedingYC() {
      let that = this;
      if (that.SelectionList.length == 0) {
        that.$message({
          message: "请选择数据后在进行操作",
          type: "warning"
        });
        return false;
      }
      readYCWaterinfo(that.SelectionList).then(res => {
        if (res.code == 0) {
          that.searchYCWaterList();
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
      if (that.SelectionList.length == 0) {
        that.$message({
          message: "请选择数据后在进行操作",
          type: "warning"
        });
        return false;
      }
      if (num) {
        IsOpen = true;
      } else {
        IsOpen = false;
      }
      lockYCChange({ waterMeterId: that.SelectionList, isOpen: IsOpen }).then(
        res => {
          if (res.code == 0) {
            that.searchYCWaterList();
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
      if (that.SelectionList.length == 0) {
        that.$message({
          message: "请选择数据后在进行操作",
          type: "warning"
        });
        return false;
      }
      unLockYCChange(that.SelectionList).then(res => {
        if (res.code == 0) {
          that.searchYCWaterList();
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
<style lang="scss" scoped>
.mac-contianer {
  padding: 0 !important;
  user-select: none;
  .el-container {
    background: #eee;
    padding-top: 10px !important;
    .el-aside {
      padding: 0;
      margin: 0;
      position: relative;
      transition: width 0.2s;
      ul {
        margin: 0;
        padding: 0;
      }
      li {
        padding: 0;
        background: #fff;
        list-style: none;
        border-radius: 2px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 12px;
      }
      p {
        padding: 0 10px;
        margin: 0;
      }
      .item-title {
        position: relative;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 31px;
        color: rgba(70, 73, 76, 1);
        .title-name {
          display: inline-block;
          width: 116px;
          height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 20px;
        }
        .showFlase {
          position: absolute;
          left: 10px;
          color: #00b2a1;
          cursor: pointer;
        }
        img {
          position: absolute;
          right: 10px;
          top: 5px;
          width: 26px;
          height: 25px;
        }
      }
      .cjNum {
        padding-left: 20px;
        p {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 28px;
          color: rgba(70, 73, 76, 1);
          opacity: 1;
          cursor: pointer;
        }
        .active {
          color: #00b2a1;
        }
      }
      .dateYC {
        text-align: right;
        background: rgba(216, 224, 197, 1);
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 31px;
        color: rgba(70, 73, 76, 1);
      }
    }
    .el-main {
      padding: 13px;
      background: #fff;
      margin-left: 0px;
      position: relative;
    }
    .telescopic {
      position: absolute;
      display: block;
      top: 300px;
      color: #00b2a1;
      font: normal 16px "Microsoft YaHei";
      width: 30px;
      margin: 0 auto;
      word-wrap: break-word;
      -webkit-box-shadow: 1px 1px 5px #cecece;
      background: #fff;
      padding: 15px 0;
      z-index: 999;
      text-align: center;
      cursor: pointer;
      box-shadow: 1px 1px 5px #cecece;
    }
    .telescopic1 {
      left: 0;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
    }
    .telescopic2 {
      right: 0px;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
    }
    .hide {
      width: 180px !important;
      // padding: 0 !important;
      // overflow: hidden;
      margin-right: 10px !important;
    }
    .none {
      width: 0 !important;
      // padding: 0 !important;
      // overflow: hidden;
      // // margin-right: 0 !important;
      margin-right: 0px !important;
    }
    .boxMsg {
      border: 1px solid #eee;
      height: 300px;
    }
  }
}
</style>
