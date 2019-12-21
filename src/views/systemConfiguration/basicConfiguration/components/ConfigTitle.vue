<template>
  <!-- 卡片-->
  <div class="display-flex align-items-center">
      <div class="title-n"></div>
      <div class="config-title">{{title}}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.title-n{
    width:5px;
    height:18px;
    background: #29BEB0;
    margin: 0 5px 0 0;
}
.config-title{
    font-size: 16px;
    font-weight: bold;
}
</style>

