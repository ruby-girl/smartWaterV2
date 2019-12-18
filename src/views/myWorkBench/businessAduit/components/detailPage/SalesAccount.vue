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
                <label>申请状态</label>
                <span>编辑开户申请</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>用户信息</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>姓名</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>电话</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>用户编号</label>
                <span>张三 李四</span>
              </p>
              <p>
                <label>证件号</label>
                <span>编辑开户申请</span>
              </p>
            </li>
            <li class="clearfix one-third">
              <p>
                <label style="color: #FF3D3D">账户金额(元)</label>
                <span style="color: #FF3D3D">2</span>
              </p>
              <p>
                <label>地址</label>
                <span>2</span>
              </p>
            </li>
            <li class="clearfix whole">
              <p>
                <label>备注</label>
                <span>2</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>水表信息</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>水表编号</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>水表类型</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label style="color: #FF3D3D">表端余额</label>
                <span style="color: #FF3D3D">张三 李四</span>
              </p>
              <p>
                <label>经办人</label>
                <span>编辑开户申请</span>
              </p>
            </li>
          </ul>
        </div>
        <p class="to-examine" v-show="!ifDetail">
          <el-button class="pass-btn" type="primary" icon="el-icon-check" size="mini">审核通过</el-button>
          <el-button class="refuse-btn" type="primary" icon="el-icon-close" size="mini" @click="failPassFun">审核不通过</el-button>
        </p>
      </div>
      <!--右侧流程信息-->
      <div class="detail-right">
        <process-examine></process-examine>
      </div>
    </div>
    <fail-reason ref="failReson"></fail-reason>
  </el-dialog>
</template>

<script>
  import "@/styles/workBench.scss"
  import MechanicsMater from "./waterTypes/MechanicsMater"
  import YcMeter from "./waterTypes/YcMeter"
  import ProcessExamine from '@/components/ProcessExamine'
  import FailReason from "./FailReason"

  export default {
    name: "SalesAccount",
    components:{ ProcessExamine, MechanicsMater, YcMeter, FailReason },
    data() {
      return {
        dialogVisible: false,
        files:[{type:1,name:'swewe'},{type:2,name:'rrrr'},],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifDetail:true
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
      },
      failPassFun(){//审核不通过
        this.$refs.failReson.dialogVisible = true
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
      this.$nextTick(()=>{
        let num = 10
        this.ifDetail ? num = 10: num = 66
        document.getElementsByClassName('detail-right')[0].style.height = document.getElementsByClassName('detail-left')[0].clientHeight - num + 'px'
      })
    }
  }
</script>

