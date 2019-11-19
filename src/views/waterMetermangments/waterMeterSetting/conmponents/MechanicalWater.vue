<template>
  <div class="mac-contianer">
    <el-form
      :inline="true"
      :model="wachMeterData"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="姓名：">
        <el-input v-model="wachMeterData.CustomerQueryValue" maxlength="20" placeholder="(长度1-30)" />
      </el-form-item>
      <el-form-item label="水表编号：">
        <el-input v-model="wachMeterData.waterNum" maxlength="20" />
      </el-form-item>
      <el-form-item label="水表样式：">
        <el-select v-model="wachMeterData.waterType" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="立式" value="1"></el-option>
          <el-option label="卧式" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户状态：">
        <el-select v-model="wachMeterData.openStatus" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开户" value="1"></el-option>
          <el-option label="销户" value="2"></el-option>
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
      <el-button type="success" size="small" class="fr">
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
        :cell-style="{'padding':'7px 0'}"
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
    </div>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index"; //自定义表格
export default {
  //机械表
  name: "MechanicalWater",
  components: { customTable },
  data() {
    return {
      wachMeterData: {
        CustomerQueryValue: "",
        waterNum: "",
        waterType: "-1",
        openStatus: "-1"
      },
      tableKey: 1,
      tableData: [],
      tableHeight: null,//表格高度
      customHeight: "", //自定义高度
      checksData:[],
      selectHead: {
        // 查询条件
        page: 1,
        limit: 10,
        SA_WaterFactory_Id: "-1", //水厂Id
        createStartTime: "", //计划开始日期
        createEndTime: "", //计划结束日期
        enumPlanState: "-1", //抄表计划状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000008"
      }
    };
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("section-full-container")[0]
        .offsetHeight -
      document.getElementsByClassName("el-form")[0].offsetHeight -
      document.getElementsByClassName("cl-operation1")[0].offsetHeight -
      54;
    console.log(this.tableHeight);
    //   document.getElementsByClassName("section-container")[0].offsetHeight -
    //   document.getElementById("table").offsetTop -
    //   58;
    this.$refs.myChild.GetTable(this.selectHead.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
  },
  watch: {
    customHeight() {
      //获取自定义模块高度
      console.log(1);
      let that = this;
      that.$nextTick(() => {
        let formHeight = document.getElementsByClassName("customOption")[0]
          .offsetHeight;
        that.tableHeight =
          document.getElementsByClassName("section-full-container")[0]
            .offsetHeight -
          document.getElementsByClassName("el-form")[0].offsetHeight -
          document.getElementsByClassName("cl-operation1")[0].offsetHeight -
          54 -
          formHeight;
        console.log(formHeight);
        console.log(that.tableHeight);
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
      alert("搜索");
    },
    setCustomData() {
      //表格自定义方法
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
      console.log(this.customHeight);
    }
  }
};
</script>