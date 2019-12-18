<template>
  <ul class="detail-table-info">
    <li class="clearfix">
      <p>
        <label>水表类型</label>
        <span>编辑开户申请</span>
      </p>
      <p>
        <label>水表编号</label>
        <span>1988-12-01 12:00:00</span>
      </p>
      <p>
        <label>水表样式</label>
        <span>编辑开户申请</span>
      </p>
      <p>
        <label>口径（mm）</label>
        <span>编辑开户申请</span>
      </p>
    </li>
    <li class="clearfix one-third">
      <p v-show="!ifIC">
        <label>起始读数</label>
        <span>编辑开户申请</span>
      </p>
      <p v-show="ifIC">
        <label>报警金额</label>
        <span>编辑开户申请</span>
      </p>
      <p>
        <label>安装位置</label>
        <span>1988-12-01 12:00:00</span>
      </p>
    </li>
    <li class="clearfix whole">
      <p>
        <label>备注</label>
        <span>编辑开户申请</span>
      </p>
    </li>
  </ul>
</template>

<script>
  import "@/styles/workBench.scss";

  export default {
    name: "MechanicsMater",
    data() {
      return {
        ifIC:false,//为true时Ic卡显示
      }
    }
  }
</script>
