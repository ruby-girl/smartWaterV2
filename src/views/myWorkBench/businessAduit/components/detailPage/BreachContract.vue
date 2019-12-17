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
          <h2><i></i>费用详细</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>序号</label>
                <span>测试用水</span>
              </p>
              <p>
                <label>交易流水号</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>用户编号</label>
                <span>张三</span>
              </p>
              <p>
                <label>姓名</label>
                <span>张三</span>
              </p>
            </li>
            <li class="clearfix">
              <p>
                <label>缴费日期</label>
                <span>测试用水</span>
              </p>
              <p>
                <label>缴费金额(元)</label>
                <span>1988-12-01</span>
              </p>
              <p>
                <label>预存金额(元)</label>
                <span>张三</span>
              </p>
              <p>
                <label>实收金额(元)</label>
                <span>张三</span>
              </p>
            </li>
            <li class="clearfix">
              <p>
                <label>缴费状态</label>
                <span>测试用水</span>
              </p>
              <p>
                <label>收款人</label>
                <span>1988-12-01</span>
              </p>
              <p>
                <label>缴费方式</label>
                <span>张三</span>
              </p>
              <p>
                <label>水表编号</label>
                <span>张三</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>违约金详情</h2>
          <p class="contract-detail">
            <label>违约金(元)</label>
            <span>50:00</span>
            <span class="pot"><i></i><label>减免为</label></span>
            <span class="pot-money">50:00</span>
          </p>
        </div>
        <p class="to-examine" v-show="!ifDetail">
          <el-button class="pass-btn" type="primary" icon="el-icon-check" size="mini">审核通过</el-button>
          <el-button class="refuse-btn" type="primary" icon="el-icon-close" size="mini">审核不通过</el-button>
        </p>
      </div>
      <!--右侧流程信息-->
      <div class="detail-right">
        <process-examine></process-examine>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import "@/styles/workBench.scss"
  import MechanicsMater from "./waterTypes/MechanicsMater"
  import YcMeter from "./waterTypes/YcMeter"
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'

  export default {
    name: "BreachContract",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter },
    data() {
      return {
        dialogVisible: true,
        files:[{type:1,name:'swewe'},{type:2,name:'rrrr'},],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifDetail:false
      }
    },
    computed:{
      currentView(){
        return this.componentsArr[this.index];
      }
    },
    methods:{
      handleClose(){
        this.dialogVisible = false
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
      this.$nextTick(()=>{
        document.getElementsByClassName('detail-right')[0].style.height = document.getElementsByClassName('detail-left')[0].clientHeight - 66 + 'px'
      })
    }
  }
</script>

