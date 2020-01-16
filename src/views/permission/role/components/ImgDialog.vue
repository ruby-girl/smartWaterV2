<template>
  <!-- 编辑弹窗 -->

  <el-dialog
    custom-class="nopadding no-head"
    title
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="true"
    top="10vh"
    :width="width"
    :height="height"
    center
    @open="opened"
  >
    <div class="img-container" :style="{backgroundImage:'url(' + url + ')', backgroundRepeat:'no-repeat', backgroundPosition:'center center', backgroundSize: '100% 100%',height:height}">
      <!-- <img :src="url" alt /> -->
    </div>
  </el-dialog>
</template>
<script>
import { GetRoleModel } from "@/api/role";
export default {
  props: {
    imgShow: {
      type: Boolean,
      default: false
    },
    imgIndex: {}
  },
  data() {
    return {
      url: "",
      imgSrc: [
        { key: 129, value: require("@/assets/imgs/img_129.png") },
        { key: 137, value: require("@/assets/imgs/img_137.png") },
        { key: 149, value: require("@/assets/imgs/img_149.png") },
        { key: 147, value: require("@/assets/imgs/img_147.png") },
        { key: 143, value: require("@/assets/imgs/img_143.png") },
        { key: 165, value: require("@/assets/imgs/img_165.png") },
        { key: 162, value: require("@/assets/imgs/img_162.png") },
        { key: 156, value: require("@/assets/imgs/img_156.png") },
        { key: 151, value: require("@/assets/imgs/img_151.png") },
        { key: 159, value: require("@/assets/imgs/img_159.png") }
      ],
      arr: [],
      width:'1000px',
      height:'600px',
      dialogFormVisible: false
    };
  },
  mounted(){
      let width=document.body.clientWidth
      if(width<1300){
          this.width='1010px'
          this.height='600px'
      }else{
          this.width='1366px'
          this.height='800px'
      }
  },
  watch: {
    imgShow() {
      this.dialogFormVisible = this.imgShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
     
      this.$emit("update:imgShow", val);
    }
  },
  methods: {
    // 查看新手指引
    opened() {
      this.imgShow = true;
      let arr = this.imgSrc.filter(item => {
        return item.key == this.imgIndex;
      });
      this.url = arr[0].value;
    }
  }
};
</script>
<style lang="scss" scoped>
.img-container {
    width: 100%;
}
</style>

