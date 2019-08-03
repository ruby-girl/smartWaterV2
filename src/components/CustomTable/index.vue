<template>
  <div class="customTableBox">
    <div class="customOption" v-show="isCustom">
      <span class="fl">自定义选项：</span>
      <div class="fl">
        <el-checkbox v-for="check in checkData" :key="check.text" v-model="check.checked" v-dragging="{ item: check, list: checkData, group: 'check' }">{{ check.text }}</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomTable',
  data() {
    return {
      isCustom: false,
      checkData: []
    }
  },
/*  computed: {
    tableDataHead: function() {
      const arrayHead = []
      const data = this.checkData
      for (let i = 0; i < data.length; i++) { // 过滤选中列
        if (data[i].checked) {
          arrayHead.push(data[i])
        }
      }
      return arrayHead
    }
  },*/
  mounted() {
    this.$dragging.$on('dragged', ({ value }) => {})
  }
}
</script>
<style lang="scss">
  .customTableBox{
    margin-top: 10px;
    .customOption {
        padding:0 30px;border: solid 1px #eee;margin-bottom: 20px;background: #ffffe7;border: solid 1px #fbdb14;line-height: 50px;height: 50px;
        color: #8b8c89;font-size: 14px;
      >span{display: inline-block;}
   }
  }
</style>
