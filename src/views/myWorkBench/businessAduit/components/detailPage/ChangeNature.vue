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
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>申请时间</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>创建人</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>所属水厂</label>
                <span>编辑开户申请</span>
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
                <span>测试用水 <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">居民用水</i></span>
              </p>
              <p>
                <label>用水性质类型</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>阶梯结算月数</label>
                <span>张三 <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>污水费</label>
                <span>测试用水</span>
              </p>
              <p>
                <label>其他费用1(元)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>其他费用2(元)</label>
                <span>张三 <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>1阶单价(元/吨)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>1阶起始量(吨)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>1阶合计单价(元/吨)</label>
                <span>张三 <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>2阶单价(元/吨)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>2阶起始量(吨)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>2阶合计单价(元/吨)</label>
                <span>张三 <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>3阶单价(元/吨)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>3阶起始量(吨)</label>
                <span>1988-12-01<i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
              <p>
                <label>3阶合计单价(元/吨)</label>
                <span>张三 <i class="iconfont icon iconbiangeng tips" style="font-size: 12px"></i> <i class="tips">李四</i></span>
              </p>
            </li>
            <li class="clearfix third">
              <p>
                <label>开始执行日期</label>
                <span>1988-12-01</span>
              </p>
              <p>
                <label>新计价启用日期</label>
                <span>1988-12-01</span>
              </p>
              <p></p>
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

  export default {
    name: "ChangeNature",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter, FailReason },
    data() {
      return {
        auditLink:[],
        dialogVisible: false,
        files:[{type:1,name:'swewe'},{type:2,name:'rrrr'},],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifDetail:true,
        curObj:{}//当前点击列对象
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

