<template>
  <div class="customTableBox">
    <div v-show="isCustom" class="customOption">
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
  mounted() {
    /*this.$dragging.$on('dragged', ({ value }) => {})*/
    this.$dragging.$on('dragged', () => {})
  }
}
</script>
<style lang="scss">
  .customTableBox{
    margin-top: 10px;
    .customOption {
        padding:0 30px;border: solid 1px #eee;margin-bottom: 16px;background: #ffffe7;border: solid 1px #fbdb14;line-height: 50px;overflow: auto;
        color: #8b8c89;font-size: 14px;max-height: 100px;display: flex;
      >span{display: inline-block;width: 85px}
      >div{flex: 1}
      .dragging {border-left: dashed 1px #fbdb14;padding-left: 25px}
   }
  }
</style>
