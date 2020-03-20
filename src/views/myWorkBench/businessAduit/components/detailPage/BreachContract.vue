<template>
  <el-dialog
    class="work-bench-detail"
    :close-on-click-modal="false"
    top="10vh"
    title="审核详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :width="screenWidth<1600? '95%':'80%'">
    <div>
      <!--左侧表格信息-->
      <div class="detail-left">
        <div class="detail-moduler">
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>申请类型</label>
                <span>{{ applyInfoData.ProcessName }}</span>
              </p>
              <p>
                <label>申请时间</label>
                <span>{{ applyInfoData.CreateTime }}</span>
              </p>
              <p>
                <label>创建人</label>
                <span>{{ applyInfoData.CreateUserName}}</span>
              </p>
              <p>
                <label>所属水厂</label>
                <span>{{ applyInfoData.WaterFactoryName}}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>费用详细</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>费用类型</label>
                <span>水费</span>
              </p>
              <p>
                <label>欠费日期</label>
                <span>{{ otherInfoData.ArrearsDate  }}</span>
              </p>
              <p>
                <label>费用金额</label>
                <span>{{ otherInfoData.TotalPrice  }}</span>
              </p>
              <p>
                <label>协议减免金额</label>
                <span>{{ otherInfoData.FreePrice  }}</span>
              </p>
            </li>
            <li class="clearfix">
              <p>
                <label>账户扣减</label>
                <span>{{ otherInfoData.PricePaid  }}</span>
              </p>
              <p>
                <label>用户编号</label>
                <span>{{ otherInfoData.CustomerNo  }}</span>
              </p>
              <p>
                <label>用户姓名</label>
                <span>{{ otherInfoData.CustomerName  }}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>违约金详情</h2>
          <p class="contract-detail">
            <label>违约金(元)</label>
            <span>{{ otherInfoData.LateFee }}</span>
            <span class="pot"><i></i><label>减免为</label></span>
            <span class="pot-money">{{ otherInfoData.AfterOverdueFee }}</span>
          </p>
        </div>
        <p class="to-examine" v-show="!ifDetail">
          <el-button class="pass-btn" type="primary" icon="el-icon-check" size="mini" @click="successPassFun(1)">审核通过</el-button>
          <el-button class="refuse-btn" type="primary" icon="el-icon-close" size="mini" @click="failPassFun()">审核不通过</el-button>
        </p>
      </div>
      <!--右侧流程信息-->
      <div class="detail-right">
        <process-examine :auditLink="auditLink" :curObj="curObj"></process-examine>
      </div>
    </div>
    <fail-reason ref="remarkChild"></fail-reason>
  </el-dialog>
</template>

<script>
  import "@/styles/workBench.scss"
  import MechanicsMater from "./waterTypes/MechanicsMater"
  import YcMeter from "./waterTypes/YcMeter"
  import FailReason from "./FailReason"
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'
  import { ProcessOperation } from '@/api/workBenck'
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "BreachContract",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter,FailReason },
    props:['auditLink'],
    data() {
      return {
        dialogVisible: false,
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifDetail:true,
        curObj:{},//当前点击列对象
        detailData:{},//详情信息
        applyInfoData:{},//申请信息
        otherInfoData:{},//费用详情
      }
    },
    computed:{
      currentView(){
        return this.componentsArr[this.index];
      }
    },
    watch:{
      dialogVisible(val){
        if(val){
          this.$nextTick(()=>{
            let num = 10
            this.ifDetail ? num = 10: num = 66
            document.getElementsByClassName('detail-right')[0].style.height = document.getElementsByClassName('detail-left')[0].clientHeight - num + 'px'
          })
        }
      },
      detailData (newVal){
        console.log(newVal.Data)
        this.applyInfoData = newVal.Info
        this.otherInfoData = newVal.Data.order
        this.otherInfoData.LateFee = newVal.Data.LateFee
        this.otherInfoData.AfterOverdueFee = newVal.Data.AfterOverdueFee
      }
    },
    methods:{
      handleClose(){
        this.dialogVisible = false
      },
      failPassFun(){
        this.$refs.remarkChild.dialogVisible = true
      },
      successPassFun(type){//审核
        let query = {
          flow:this.curObj,
          OperationState:type==1 ? true : false,
          OperationRemark:this.$refs.remarkChild.form.remark
        }
        ProcessOperation(query).then(res => {
          if (res.code ==0 ) {
            promptInfoFun(this, 2, res.message);
            this.dialogVisible = false
            this.$parent.searchTableList()
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
    }
  }
</script>

