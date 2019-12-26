<template>
  <el-dialog
    class="work-bench-detail"
    :close-on-click-modal="false"
    top="0vh"
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
             <h2><i></i>用户信息</h2>
             <ul class="detail-table-info">
               <li class="clearfix">
                 <p>
                   <label>水厂</label>
                   <span>{{ userInfoData.SA_WaterFactoryName}}</span>
                 </p>
                 <p>
                   <label>用户编号</label>
                   <span>{{ userInfoData.CustomerNo}}</span>
                 </p>
                 <p>
                   <label>姓名</label>
                   <span>{{ userInfoData.CustomerName}}</span>
                 </p>
                 <p>
                   <label>简码</label>
                   <span>{{ userInfoData.NameCode}}</span>
                 </p>
               </li>
               <li class="clearfix">
               <p>
                 <label>人口</label>
                 <span>{{ userInfoData.PeopleNo}}</span>
               </p>
               <p>
                 <label>用户类型</label>
                 <span>{{ userInfoData.UserTypeStr}}</span>
               </p>
               <p>
                 <label>用水性质</label>
                 <span>{{ userInfoData.SA_UseWaterType}}</span>
               </p>
               <p>
                 <label>表册</label>
                 <span>{{ userInfoData.WaterMeterTypeStr}}</span>
               </p>
             </li>
               <li class="clearfix half">
                 <p>
                   <label>电话</label>
                   <span>{{ userInfoData.Tel}}</span>
                 </p>
                 <p>
                   <label>纳税人识别号</label>
                   <span>{{ userInfoData.TaxpayerNumber}}</span>
                 </p>
               </li>
               <li class="clearfix half">
                 <p>
                   <label>区域</label>
                   <span>{{ userInfoData.SA_UserAreaName}}</span>
                 </p>
                 <p>
                   <label>证件号</label>
                   <span>{{ userInfoData.IdentityNo }}</span>
                 </p>
               </li>
               <li class="clearfix whole">
                 <p>
                   <label>地址</label>
                   <span>{{ userInfoData.Address}}</span>
                 </p>
               </li>
               <li class="clearfix whole">
                 <p>
                   <label>备注</label>
                   <span>{{ userInfoData.Remark}}</span>
                 </p>
               </li>
             </ul>
           </div>
           <div class="detail-moduler">
             <h2><i></i>水表信息</h2>
             <component :is="currentView" ref="waterChild" :ifIcWter="ifIcWter" :waterData="waterInfoData"></component>
           </div>
           <div class="detail-moduler">
             <h2><i></i>附件信息</h2>
             <file-list :files="files"></file-list>
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
  import "@/styles/workBench.scss";
  import MechanicsMater from "./waterTypes/MechanicsMater"//机械 IC
  import YcMeter from "./waterTypes/YcMeter"//物联 远传
  import WlMeter from "./waterTypes/WlMeter"//物联 远传
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'
  import FailReason from "./FailReason"
  import { ProcessOperation } from '@/api/workBenck'
  import { promptInfoFun } from "@/utils/index"
  import { getFileFun } from "@/utils/projectLogic"

  export default {
    name: "WatreMeterAccount",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter, FailReason , WlMeter},
    props:['auditLink'],
    data() {
      return {
        detailData:{},//详情信息
        userInfoData:{},//用户信息
        waterInfoData:{},//水表信息
        applyInfoData:{},//水表信息
        dialogVisible: false,
        files:[],//附件
        index:0,
        componentsArr:['MechanicsMater','YcMeter','WlMeter'],
        screenWidth:'',
        ifDetail:true,
        curObj:{},
        ifIcWter:true//当前点击列对象
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
      detailData (newVal){//获取附件信息
        if(newVal.Data.bl.saList&&newVal.Data.bl.saList.length>0)
        this.files = getFileFun(newVal.Data.bl.saList,this)

        this.userInfoData = newVal.Data.bl
        this.waterInfoData = newVal.Data.sw
        this.waterInfoData.WaterMeterTypeStr = newVal.Data.bl.WaterMeterTypeStr
        this.applyInfoData = newVal.Info
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

