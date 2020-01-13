<template>
  <el-dialog
    title="指令记录"
    :visible.sync="orderInsd"
    top="30vh"
    width="720px"
    hight="420px"
    center
    :close-on-click-modal="false"
  >
    <ul class="history_box">
      <p class="search_btn">
        按日期：
        <span :class="instrictionList.sort=='asc'? 'on':''" @click="sortFun(1)">降序</span>
        <span :class="instrictionList.sort=='desc'? 'on':''" @click="sortFun(2)">升序</span>
        <!-- </p>类型判断 开户：2101，充值：2102，换表：2103，水表升级：2104，编辑：2015 -->
      </p>

      <li v-for="(item,index) in orderInstion" :key="index">
        <i class="icon iconfont iconchaobiao open_chaobiao" v-if="item.CommandName=='抄表'"></i>
        <i class="icon iconfont iconfamen1 open_kai" v-if="item.CommandName=='阀门锁定开'"></i>
        <i class="icon iconfont iconfamen open_guan" v-if="item.CommandName=='阀门锁定关'"></i>
        <div class="content">
          <span>{{item.CreateTime}}</span>
          <label>{{item.CommandName}}</label>
          <span v-if="item.TrafficStatus=='通讯中'" class="styleText" >{{item.TrafficStatus}}</span>
          <span v-if="item.TrafficStatus=='通讯异常'" class="styleText colorStyle" >{{item.TrafficStatus}}</span>
          <span v-if="item.TrafficStatus=='通讯正常'" class="styleText colorStyle1" >{{item.TrafficStatus}}</span>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
import { GetCommandRecord } from "@/api/waterMeterMang";
export default {
  name: "InstrctionOrder",
  props: {
    orderHistory: {
      type: Boolean,
      default: false
    },
    orderid: {
      type: String,
      default: ""
    }
  },
  watch: {
    orderid() {
      this.instrictionList.waterMeterId = this.orderid;
      if (this.orderid) {
        this.getHistoryInfo();
      }
    },
  
    orderInsd(val, oldVal) {
      if (val === oldVal) {
        return;
      } else if (val == false) {
        this.$parent.orderHistory = val;
        this.$parent.orderid = "";
      }
      //   this.$emit("update:orderHistory", val);
      //   this.$emit("update:orderid", "");
    }
  },
  data() {
    return {
      orderInstion: [],
      orderInsd: false,
      instrictionList: {
        waterMeterId: "",
        sort: "desc"
      }
    };
  },
  methods: {
    sortFun(type) {
      console.log(this.instrictionList, type);
      type != 1
        ? (this.instrictionList.sort = "asc")
        : (this.instrictionList.sort = "desc");
      this.getHistoryInfo();
      //排序，1降序，2升序
      //   this.asce = !this.asce;
      //
    },
    getHistoryInfo() {
      //   //详情历史业务数据
      GetCommandRecord(this.instrictionList).then(res => {
        if(res.data.length==0){
          this.$message({
            message:"该水表没有指令历史",
            type:"warning"
          })
          return false
        }
        this.orderInsd = this.orderHistory;
        this.orderInstion = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.history_box {
  background: #fff;
  margin: 0;
  padding: 42px 73px 55px 102px;
  position: relative;
  width: 100%;
  height: 400px;
  overflow: auto;

  li {
    list-style-type: none;
    height: 70px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: relative;
    display: flex;
    -webkit-flex: 1;
    margin-top: 20px;
  }

  li:before {
    content: "";
    height: calc(100% + 60px);
    border-left: dashed 1px #aab5c5;
    position: absolute;
    left: -24px;
    top: 20px;
    margin-left: -1px;
  }
li:nth-last-child(2):before{
    height: calc(100% + 50px);
}
  li:last-child:before {
    height: calc(100% - 50px);
  }
  .open_chaobiao {
    color: #ff3d3d;
  }
  .open_chaobiao.icon {
    background: #ff3d3d;
  }
  .open_kai {
    color: #00b2a1;
  }
  .open_kai.icon {
    background: #00b2a1;
  }
  .open_guan {
    color: #e5a903;
  }
  .open_guan.icon {
    background: #e5a903;
  }
  .icon {
    position: absolute;
    left: 70px;
    top: 50%;
    width: 34px;
    height: 34px;
    margin-left: -112px;
    margin-top: -17px;
    border-radius: 50%;
    text-align: center;
    line-height: 34px;
    color: #fff;
  }

  .title {
    text-align: right;
    margin-right: 95px;
    width: 60px;
    font: bold 14px/70px "Microsoft YaHei";
    line-height: 70px;
  }

  .content {
    flex: 1;
    -webkit-flex: 1;
    box-shadow: 1px 2px 3px #cecece;
    -webkit-box-shadow: 1px 2px 5px #cecece;
    padding: 0 15px;
    position: relative;

    span {
      color: #777c82;
      font: normal 14px "Microsoft YaHei";
      display: block;
      margin: 10px 0;
    }

    label {
      font: bold 14px "Microsoft YaHei";
      color: #46494c;
    }
  }

  .search_btn {
    position: absolute;
    top: 0;
    right: 24px;

    span {
      cursor: pointer;
      font: normal 14px "Microsoft YaHei";
      color: #a2a4a5;
      margin-left: 10px;
    }

    span.on {
      color: #46494c;
    }
  }
  .content .styleText {
    position: absolute !important;
    right: 15px;
    top: 15px;
    margin: 0;
    font-size: 13px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 10px;
    color: #E57403;
  }
  .content .colorStyle{
    color: #FF3D3D;
  }
  .content .colorStyle1{
    color: #00B2A1;
  }
}
</style>
