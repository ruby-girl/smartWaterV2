<template>
  <el-dialog
    class="work-bench-detail"
    :close-on-click-modal="false"
    top="5vh"
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
                <span>{{ applyInfoData.ProcessName}}</span>
              </p>
              <p>
                <label>申请时间</label>
                <span>{{ applyInfoData.CreateTime}}</span>
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
          <h2><i></i>用户信息</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>用户编号</label>
                <span>{{ customInfoData.CustomerNo }}</span>
              </p>
              <p>
                <label>姓名</label>
                <span>{{ customInfoData.CustomerName }}</span>
              </p>
              <p>
                <label>水厂</label>
                <span>{{ customInfoData.SA_WaterFactoryName }}</span>
              </p>
              <p>
                <label>所属区域</label>
                <span>{{ customInfoData.SA_UserAreaName }}</span>
              </p>
            </li>
            <li class="clearfix">
              <p>
                <label>水表类型</label>
                <span>{{ customInfoData.WaterMeterTypeStr }}</span>
              </p>
              <p>
                <label>用水性质</label>
                <span>{{ customInfoData.SA_UseWaterType }}</span>
              </p>
              <p>
                <label>电话</label>
                <span>{{ customInfoData.Tel }}</span>
              </p>
              <p>
                <label>开户时间</label>
                <span>{{ customInfoData.OperAccountDate }}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>低保户资质</h2>
          <file-list :files="files"></file-list>
          <ul class="detail-table-info" v-show="ifIcWter">
            <li class="clearfix whole">
              <p>
                <label>生效日期</label>
                <span>{{ newInsuredInfoData.StartDate }} - {{ newInsuredInfoData.EndDate }}</span>
              </p>
            </li>
            <li class="clearfix whole">
              <p>
                <label>备注</label>
                <span style="height: 65px;">{{ customInfoData.Remark }}</span>
              </p>
            </li>
          </ul>
          <ul class="detail-table-info" v-show="!ifIcWter">
            <li class="clearfix half">
              <p>
                <label>生效日期</label>
                <span style="padding-left: 20px;">{{ newInsuredInfoData.StartDate }} - {{ newInsuredInfoData.EndDate }}</span>
              </p>
              <p>
                <label>次年生效日期</label>
                <span style="padding-left: 20px;">{{ newInsuredInfoData.FS_StartDate }} - {{ newInsuredInfoData.FS_EndDate }}</span>
              </p>
            </li>
            <li class="clearfix whole">
              <p>
                <label>备注</label>
                <span style="height: 65px;">{{ customInfoData.Remark }}</span>
              </p>
            </li>
          </ul>
        </div>
        <p class="to-examine" v-show="!ifDetail">
          <el-button class="pass-btn" type="primary" icon="el-icon-check" size="mini" @click="successPassFun(1)">审核通过</el-button>
          <el-button class="refuse-btn" type="primary" icon="el-icon-close" size="mini" @click="failPassFun(1)">审核不通过</el-button>
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
  import "@/styles/workBench.scss";
  import MechanicsMater from "./waterTypes/MechanicsMater"
  import YcMeter from "./waterTypes/YcMeter"
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'
  import FailReason from "./FailReason"
  import { ProcessOperation } from '@/api/workBenck'
  import { promptInfoFun } from "@/utils/index"
  import { getFileFun } from "@/utils/projectLogic"

  export default {
    name: "LowInsureApply",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter, FailReason },
    props:['auditLink'],
    data() {
      return {
        dialogVisible: false,
        files:[],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifIcWter:true,//初审复审 区分生效日期显示
        ifDetail:true,
        curObj:{},
        detailData:{},
        applyInfoData:{},//申请信息
        customInfoData:{},
        newInsuredInfoData:{},
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
      detailData(newVal) {//获取附件信息
        newVal.Data.SaList && newVal.Data.SaList.length > 0? this.files = getFileFun(newVal.Data.SaList, this):this.files = []
        this.applyInfoData = newVal.Info
        this.customInfoData = newVal.Data.bl
        this.newInsuredInfoData = newVal.Data.insuredMessage
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

