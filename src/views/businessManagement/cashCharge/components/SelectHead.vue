<template>
  <div>
    <div class="display-flex align-items-center justify-content-flex-justify">
      <el-form
        :inline="true"
        :model="selectHead"
        class="head-search-form form-inline-small-input"
        size="small"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="用户：" label-width="65px">
          <el-select
            v-model="selectHead.CustomerQueryType"
            placeholder="请选择"
            style="width: 80px;float: left"
          >
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
          <el-input
            v-model="selectHead.CustomerQueryType"
            maxlength="20"
            placeholder="(长度1-30)"
            @keyup.enter.native="handleFilter"
            style="width: 180px;float: left"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleFilter">
            <i class="iconfont iconsousuo"></i>搜索
          </el-button>
          <el-button type="success" size="mini" @click="handleFilter">
            <i class="iconfont iconduka"></i>读卡
          </el-button>
        </el-form-item>
      </el-form>
      <div class="payment-records" @click="toPaymentQuery">
        <div class="payment-num-more" v-show="paymentNum>99">{{paymentNum}}</div>
        <div class="payment-num" v-show="paymentNum<100">{{paymentNum}}</div>
        <span>查询缴费记录>></span>
      </div>
    </div>

    <el-row class="head-bottom-box">
      <el-col :md="8" :lg="3" :xl="2">姓名:羊请问</el-col>
      <el-col :md="8" :lg="4" :xl="3">水表类型:机械表</el-col>
      <el-col :md="8" :lg="4" :xl="3">电话:18190002838</el-col>
      <el-col :md="8" :lg="6" :xl="4">水表编号:18a3812312312312</el-col>
      <el-col :md="12" :lg="7" :xl="12" class="text-wrap">地址:奥术asdasdasd大师大所大所大所多</el-col>
    </el-row>
  </div>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      timevalue: [],
      editUserList: [],
      paymentNum:88
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  methods: {
    getTime(v) {
      if (v) {
        this.selectHead.editStartTime = v[0];
        this.selectHead.editEndTime = v[1];
      } else {
        this.selectHead.editStartTime = "";
        this.selectHead.editEndTime = "";
      }
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    },
    toPaymentQuery(){
      this.$router.push({  //核心语句
        path:'/businessManagement/paymentQuery',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          id:'qwe',  
        }    
    })
  }}
};
</script>
<style lang="scss" scoped>
.payment-records {
  color: #00b2a1;
  font-size: 13px;
  padding-bottom: 10px;
  cursor: pointer;
  position: relative;
  .payment-num{
    position: absolute;
    background: #FF5656;
    border-radius: 50%;
    width: 18px;
    height:18px;
    line-height: 12px;
    font-size: 12px;
    top:-20px;
    right:15px;
    color:#fff;
    text-align: center;
  }
  .payment-num{
    position: absolute;
    background: #FF5656;
    border-radius: 50%;
    width: 18px;
    height:18px;
    line-height: 18px;
    font-size: 12px;
    top:-20px;
    right:15px;
    color:#fff;
    text-align: center;
  }
}
.head-bottom-box {
  background: #f5f5f5;
  padding: 15px;
  line-height: 30px;
}
.text-wrap{
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
</style>

