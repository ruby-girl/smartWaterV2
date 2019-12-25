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
                <span>{{ applyInfoData.CreateUserName }}</span>
              </p>
              <p>
                <label>所属水厂</label>
                <span>{{ applyInfoData.WaterFactoryName }}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>用水性质详情</h2>
          <ul class="detail-table-info">
            <li class="clearfix third">
              <p>
                <label>用水性质</label>
                <span>{{ waterInfoData.UseWaterTypeName  }}</span>
              </p>
              <p>
                <label>用水性质类型</label>
                <span>{{ waterInfoData.WaterPropertyTypeName }}</span>
              </p>
              <p>
                <label>阶梯结算月数</label>
                <span>{{ waterInfoData.LadderResetTime }}</span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>污水费</label>
                <span>{{ waterInfoData.SewagePrice }}</span>
              </p>
              <p>
                <label>其他费用1(元)</label>
                <span>{{ waterInfoData.OtherPrice1  }}</span>
              </p>
              <p>
                <label>其他费用2(元)</label>
                <span>{{ waterInfoData.OtherPrice2 }}</span>
              </p>
            </li>
            <li class="clearfix third" v-for="(item,index) in temp.ladder.slice(0,temp.LadderNumber)" :key="index">
              <p>
                <label>{{index+1}}阶单价(元/吨)</label>
                <span>{{ item.LadderPrice }}(元/吨)</span>
              </p>
              <p>
                <label>{{index+1}}阶起始量(吨)</label>
                <span>{{item.LadderWaterNum}}吨</span>
              </p>
              <p>
                <label>{{index+1}}阶合计单价(元/吨)</label>
                <span style="color: #FF3D3D;font-weight: bold">{{item.TotalPrice}}吨</span>
              </p>
            </li>
            <li class="clearfix whole">
              <p>
                <label>开始执行日期 </label>
                <span style="padding-left: 6%;"> {{ waterInfoData.StartPlanDate }}</span>
              </p>
            </li>
          </ul>
        </div>
        <p class="to-examine" v-show="!ifDetail">
          <el-button class="pass-btn" type="primary" icon="el-icon-check" size="mini" @click="successPassFun(1)">审核通过</el-button>
          <el-button class="refuse-btn" type="primary" icon="el-icon-close" size="mini" @click="failPassFun">审核不通过</el-button>
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
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'
  import FailReason from "./FailReason"
  import { ProcessOperation } from '@/api/workBenck'
  import { promptInfoFun } from "@/utils/index"
  import { getFileFun } from "@/utils/projectLogic"
  import { ladderChangeArr } from "@/utils/index"

  export default {
    name: "AddNature",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter, FailReason },
    data() {
      return {
        dialogVisible: false,
        files:[],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifDetail:true,
        curObj:{},//当前点击列对象
        auditLink:[],
        detailData:{},//详情信息
        waterInfoData:{},//水表信息
        applyInfoData:{},//水表信息
        temp: {
          LadderNumber: 3,
          ladder: [
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0}
          ]
        },
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
        this.waterInfoData = newVal.Data.WaterPropertyHis
        this.applyInfoData = newVal.Info
        this.temp = ladderChangeArr(newVal.Data.WaterPropertyHis)
        this.temp.LadderNumber = newVal.Data.WaterPropertyHis.LadderNumber
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

