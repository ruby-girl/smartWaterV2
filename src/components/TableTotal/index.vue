<template>
  <div class="tabel-total-container">
    <div class="display-flex align-items-center justify-content-flex-center">
      <div
        v-for="(item,i) in list"
        :key="i"
        class="table-total-item"
        :style="{'width':((100/list.length)-5)+'%'}"
      >
        <div class="main-color-red font-weight">{{item.num}}</div>
        <div>{{item.txt}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { promptInfoFun } from "@/utils/index";

export default {
  name: "TabelTotal",
  data() {
    return {
      curNum: -1
    };
  },
  props: {
    list: {
      type: Array
    }
  },
  methods: {}
};
</script>
<style lang="scss">
.tabel-total-container {
  border: 1px solid #d8e2e7;
  border-bottom: none;
  padding: 6px 0;
  .table-total-item {
    text-align: center;
    line-height: 28px;
    color: #46494c;
  }
}
</style>
