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
    name: "ChangeNature",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter },
    data() {
      return {
        dialogVisible: true,
        files:[{type:1,name:'swewe'},{type:2,name:'rrrr'},],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
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
        document.getElementsByClassName('detail-right')[0].style.height = document.getElementsByClassName('detail-left')[0].clientHeight + 'px'
      })
    }
  }
</script>

