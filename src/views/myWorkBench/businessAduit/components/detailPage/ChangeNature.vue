<template>
  <el-dialog
    class="work-bench-detail"
    :close-on-click-modal="false"
    top="15vh"
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
          <h2><i></i>用户信息</h2>
          <ul class="detail-table-info">
            <li class="clearfix third">
              <p>
                <label>用户编号</label>
                <span>{{userInfo.CustomerNo}}</span>
              </p>
              <p>
                <label>用户名称 </label>
                <span>{{userInfo.CustomerName}}</span>
              </p>
              <p>
                <label>手机号码</label>
                <span>{{userInfo.Tel}}</span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>所属区域</label>
                <span>{{ userInfo.AreaName }}</span>
              </p>
              <p>
                <label>用户类型</label>
                <span>{{ userInfo.UserType }}</span>
              </p>
              <p>
                <label>用水性质</label>
                <span>{{ userInfo.WaterPropertyName }}</span>
              </p>
            </li>
             <li class="clearfix third">
              <p>
                <label>水表编号</label>
                <span>{{ userInfo.WaterMeterNo }}</span>
              </p>
              <p>
                <label>水表口径</label>
                <span>{{ userInfo.WaterCaliber }}</span>
              </p>
              <p>
                <label>水表类型</label>
                <span>{{ userInfo.WaterMeterTypeName }}</span>
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
                <span>{{ oldWaterInfoData.UseWaterTypeName }} <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips"> {{ waterInfoData.UseWaterTypeName }}</i></span>
              </p>
              <p>
                <label>用水性质类型</label>
                <span> {{ oldWaterInfoData.WaterPropertyTypeName }} <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">{{ waterInfoData.WaterPropertyTypeName }}</i></span>
              </p>
              <p>
                <label>阶梯结算月数</label>
                <span>{{ oldWaterInfoData.LadderResetTime }} <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">{{ waterInfoData.LadderResetTime }}</i></span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>污水费</label>
                <span>{{ oldWaterInfoData.SewagePrice }}<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips"> {{ waterInfoData.SewagePrice }}</i></span>
              </p>
              <p>
                <label>其他费用1(元)</label>
                <span>{{ oldWaterInfoData.OtherPrice1  }}<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">{{ waterInfoData.OtherPrice1  }}</i></span>
              </p>
              <p>
                <label>其他费用2(元)</label>
                <span>{{ oldWaterInfoData.OtherPrice2 }} <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">{{ waterInfoData.OtherPrice2 }} </i></span>
              </p>
            </li>
            <li class="clearfix third" v-for="(item,index) in temp.ladder.slice(0,temp.LadderNumber)" :key="index">
              <p>
                <label>{{index+1}}阶单价(元/吨)</label>
                <span>{{ temp1.ladder[index].LadderPrice }} <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i>
                  <i class="tips">{{ item.LadderPrice }}</i></span>
              </p>
              <p>
                <label>{{index+1}}阶起始量(吨)</label>
                <span> {{ temp1.ladder[index].LadderWaterNum }}<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i>
                  <i class="tips">{{item.LadderWaterNum}}</i></span>
              </p>
              <p>
                <label>{{index+1}}阶合计单价(元/吨)</label>
                <span>{{ temp1.ladder[index].TotalPrice }}<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i>
                  <i class="tips">{{item.TotalPrice}} </i></span>
              </p>
            </li>
          </ul>
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
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'
  import FailReason from "./FailReason"
  import { ProcessOperation } from '@/api/workBenck'
  import { promptInfoFun } from "@/utils/index"
  import { ladderChangeArr } from "@/utils/index"

  export default {
    name: "ChangeNature",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter, FailReason },
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
        waterInfoData:{},//变更后水表信息
        oldWaterInfoData:{},//变更前水表信息
        applyInfoData:{},//水表信息
        waterInfos:[],
        userInfo:{},//用户信息
        temp: {
          LadderNumber: 3,
          ladder: [
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0}
          ]
        },
        temp1:{
          LadderNumber: 3,
          ladder: [
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0}
          ]
        }
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
      detailData (newVal){//获取附件信息1
        console.log(newVal.Data)
        this.waterInfoData = newVal.Data.NewWaterPropertyModel//新变更用水性质
        this.oldWaterInfoData = newVal.Data.OldWaterPropertyModel//老变更用水性质
        this.applyInfoData = newVal.Info
        this.userInfo=newVal.Data.cus
        this.temp = ladderChangeArr(newVal.Data.NewWaterPropertyModel)
        this.temp1 = ladderChangeArr(newVal.Data.OldWaterPropertyModel)
        this.temp.LadderNumber = newVal.Data.NewWaterPropertyModel.LadderNumber
        this.temp1.LadderNumber = newVal.Data.OldWaterPropertyModel.LadderNumber
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

