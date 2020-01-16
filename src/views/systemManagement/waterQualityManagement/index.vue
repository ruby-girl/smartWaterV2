<template>
  <div class="section-container"> 
      <div ref="formHeight">
        <select-head
          :select-head="listQuery"
          @handleFilter="getList"
           @getText="getText"
          :type-list="typeList"
        />
      </div>
      <div class="section-full-container tips-container">
      <div class="display-flex justify-content-flex-justify">
        <el-button round plain class="btn-add" size="mini" @click="add">
          <i class="iconfont icontianjia"></i>添加
        </el-button>
      </div>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips"  @excel="excel"/>
      <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          @sort-change="sortChanges"
        >
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <template>
            <div v-for="(item ,index) in tableHead" :key="index">
              <el-table-column
                :key="index"
                min-width="160px"
                :prop="item.ColProp"
                align="center"
                :sortable="item.IsSortBol?'custom':null"
                :label="item.ColDesc"
              />
            </div>
          </template>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
            width="150px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex  justify-content-flex-justify method-font secur-content" style="padding:0 15px;">
                <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="水价构成"
                placement="bottom"
              >
                <i class="icon iconfont iconyongshuixingzhishezhi-shuijiagoucheng"  @click="constitute(row,1)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="历史水价"
                placement="bottom"
              >
                <i class="icon iconfont iconyongshuixingzhishezhi-lishishuijia" @click="history(row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="水价调整"
                placement="bottom"
                v-if="row.UseState=='801'"
              >
                <i class="icon iconfont iconyongshuixingzhishezhi-shuijiatiaozheng"  @click="handleUpdate(row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="撤销水价调整"
                placement="bottom"
                v-if="row.UseState=='802'"
              >
                <i class="icon iconfont iconyongshuixingzhishezhi-chexiaoshuijiatiaozheng" @click="constitute(row,2)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="删除"
                placement="bottom"
              >
                <i class="icon iconfont iconsuoyoubiaogelideshanchu" @click="cancel(row)"></i>
              </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList(1)"
        />
        <add-dialog
          :add-show.sync="addDialogFormVisible"
          :temp="temp"
          :id="updateId"
          :dialogStatus="dialogStatus"
          @createData="createData"
          @updateData="updateData"
          :type-list="typeList"
        />
        <water-constitute
          :constitute-show.sync="constituteShow"
          :id="constituteId"
          :type="constituteType"
          @reset="reset"
        />
        <history-price :history-show.sync="historyShow" :id="historyId" />
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import Pagination from "@/components/Pagination";
import AddDialog from "./components/Add";
import HistoryPrice from "./components/HistoryPrice";
import WaterConstitute from "./components/WaterConstitute";
import { getDictionaryOption } from "@/utils/permission";
import SearchTips from "@/components/SearchTips/index";
import { delTips,getText,pushItem,isExport} from "@/utils/projectLogic";//搜索条件面包屑
import {
  addWaterQuality,
  delWaterQuality,
  getWaterQualityList,
  SelectUpdateWaterPropertyBeforeInfo,
  UpdateWaterPropertyInfo,
  ResetUpdateWaterPropertyInfo,
  DeleteWaterPropertyId,
  GetWaterPropertyList_OutExcel
} from "@/api/system";
import {
  parseStartTime,
  ladderChangeArr
} from "@/utils/index.js";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  name: "WaterQualityManagement",
  directives: { permission },
  components: {
    SelectHead,
    Pagination,
    AddDialog,
    WaterConstitute,
    HistoryPrice,
    SearchTips
  },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      restId: "", //重置行ID
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        sort: "", //升序
        filed: "", //排序字段
        WaterPropertyName: "", // 用水性质名称
        WaterPropertyType: "-1", // 用水性质类型
        IsLadder: "-1", //是否阶梯
        tableId: "0000012"
      },
      dialogStatus: "", //标识添加编辑
      updateId: "", //编辑行ID
      typeList: [], //用水性质类型，传递给组件
      addDialogFormVisible: false, // 新增弹窗
      constituteShow: false, // 水价构成弹窗
      historyShow: false, //历史水价弹窗
      constituteId: "", //水价构成行ID
      constituteType: 1, //1：水价构成页面；2：撤销前确认页面
      historyId: "", //历史水价行ID
      tableData: [],
      checksData: [],
       tipsData: [],//传入子组件的值
        tipsDataCopy: [],//表单变化的值
        orderData:{}
    };
  },
  computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;   
      this.tableHeight = document.body.clientHeight - formHeight - 200;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.typeList = getDictionaryOption("用水性质类型");
    });
  },
  methods: {
     delTips(val) {
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");   
       this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    // 历史水价
    history(row) {
      this.historyId = row.Id;
      this.historyShow = true;
    },
    // 点击水价构成
    constitute(row, t) {
      this.constituteId = row.Id;
      this.constituteType = t;
      this.constituteShow = true;
    },
    getList(n) {
      if(!n){
         this.orderData = Object.assign({}, this.listQuery);
         this.orderData.page=1
         this.listQuery.page = 1;
      }else{
        this.orderData.page=this.listQuery.page
      }
      getWaterQualityList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.getList();
    },
    add() {
      this.temp = {
        UseWaterTypeName: "", //用水性质名称
        StartPlanDate: parseStartTime(new Date()), //开始执行日期
        NewPriceUseDate: "",
        IsLadder: true, //是否阶梯计价
        isLadder: "1",
        LadderResetTime: "1", //阶梯月数
        LadderNumber: 3, //阶梯数
        IsCanCancelWaterPriceChange: true, //是否可撤销
        WaterPropertyType: "401", //用水性质类型-默认值-居民用水
        OneLadderWaterNum: 0,
        OneLadderPrice: 0,
        OneTotalPrice: 0,
        TwoLadderWaterNum: 0,
        TwoLadderPrice: 0,
        TwoTotalPrice: 0,
        ThreeLadderWaterNum: 0,
        ThreeLadderPrice: 0,
        ThreeTotalPrice: 0,
        FourLadderWaterNum: 0,
        FourLadderPrice: 0,
        FourTotalPrice: 0,
        FiveLadderWaterNum: 0,
        FiveLadderPrice: 0,
        FiveTotalPrice: 0,
        SewagePrice: 0, //污水费单价
        OtherPrice1: 0, //其他费用1
        OtherPrice2: 0, //其他费用2
        OtherPrice3: 0, //其他费用3
        NotLadderPrice: 0, //单价
        TotalPrice: 0, //合计单价
        ladder: [
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 }
        ]
      };
      this.dialogStatus = "create";
      this.addDialogFormVisible = true;
    },
    // 水价调整-编辑
    handleUpdate(row) {
      SelectUpdateWaterPropertyBeforeInfo({ id: row.Id }).then(res => {
        this.updateId = row.Id; 
        let obj = ladderChangeArr(res.data); //阶梯转换数组    
        let ladder = {
          isLadder: "1",
          NewPriceUseDate: ''
        };
        ladder.isLadder = obj.IsLadder == true ? "1" : "2";
        obj.WaterPropertyType = res.data.WaterPropertyType.toString();
        this.temp = { ...ladder, ...obj };
        this.dialogStatus = "update";
        this.addDialogFormVisible = true;
      });
    },
    // 新增
    createData() {
      addWaterQuality(this.temp).then(res => {
        this.addDialogFormVisible = false;
        this.$message({
          message: "添加成功！",
          type: "success",
          duration: 4000
        });
        this.getList();
      });
    },
    // 编辑
    updateData() {
      UpdateWaterPropertyInfo({ id: this.updateId }, this.temp).then(res => {
        this.addDialogFormVisible = false;
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.getList();
      });
    },
    cancel(row) {
      this.$confirm("是否确认删除该用水性质？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox deleteBox",
        showClose: false
      }).then(() => {
        DeleteWaterPropertyId({ id: row.Id }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    //导出
    excel() {
      if(!isExport(this.tableData)) return
      GetWaterPropertyList_OutExcel(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },  
    reset(id) {
      ResetUpdateWaterPropertyInfo({ id: id }).then(res => {
        this.constituteShow = false;
        this.$message({
          message: "撤销成功！",
          type: "success",
          duration: 4000
        });
        this.getList();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.section-container .section-full-container{
  padding-top:0 !important;
}
.color-more-black {
  color: #46494c;
}
.button-width {
  width: 80px;
  text-align: center;
}
.secur-content {
    .icon {
      font-size: 16px;
      color:#777c82;
      cursor: pointer;
    }
    .iconyongshuixingzhishezhi-shuijiagoucheng {
      color: #b59200 !important;
    }
    .iconyongshuixingzhishezhi-shuijiatiaozheng {
      color: #00B2A1 !important;
    }
    .iconyongshuixingzhishezhi-chexiaoshuijiatiaozheng{
      color:#46494C !important;
    }
    .iconsuoyoubiaogelideshanchu{
       color: #ff3d3d !important;
    }
}
</style>


