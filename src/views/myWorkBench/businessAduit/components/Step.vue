<template>
  <el-steps :active="milepostActive" align-center>
    <el-step
      v-for="(value, key) in linkCont"
      :class="`${milepostActive>key+1 ? stepActive: ''} ${value.AuditLinkState&&value.AuditState==false ? 'errorClass': ''} ${value.id==1&&isBorder==true ? 'finishBorder': ''}` "
      :title="value.AuditLinkName"
      :description="value.AuditLinkState&&value.AuditState==true?'我已审核':'审核不通过'"
      :icon="value.AuditLinkState&&value.AuditState==false?'el-icon-error':'el-icon-success'"
    ></el-step>
    <img v-if="milepostActive==linkCont.length" class="passImg" :src="imgIcon" />
  </el-steps>
 <!-- <el-steps :active="milepostActive" align-center>
    <el-step
      v-for="(value, key) in milepost"
      :class="`${milepostActive>key+1 ? stepActive: ''} ${value.description=='审核不通过' ? 'errorClass': ''} ${value.id==1&&isBorder==true ? 'finishBorder': ''}` "
      :title="value.title"
      :description="value.id==1?'我已审核':value.description"
      :icon="value.description=='审核不通过'?'el-icon-error':'el-icon-success'"
    ></el-step>
    <img v-if="milepostActive==milepost.length" class="passImg" :src="imgIcon" />
  </el-steps>-->
</template>
<script>
import imgIcon from "@/assets/imgs/pass.png";
export default {
  name: "Step",
  /*props:['linkCont','processId'],*/
  data() {
    return {
      linkCont:[
        {
          AuditLinkId:1,
          AuditLinkName:'环节1',
          AuditLinkState:true,//审核环节状态 true 已审核 false 待审
          AuditState:true,//审核操作状态 true 通过 false 不通过
          AuditLinkUserId:'执行人1',//环节执行人
          AuditLinkSort:1,//审核环节序号*/
        },
        {
          AuditLinkId:2,
          AuditLinkName:'环节2',
          AuditLinkState:true,//审核环节状态 true 已审核 false 待审
          AuditState:false,//审核操作状态 true 通过 false 不通过
          AuditLinkUserId:'执行人2',//环节执行人
          AuditLinkSort:1,//审核环节序号*/
        },
        {
          AuditLinkId:3,
          AuditLinkName:'环节3',
          AuditLinkState:true,//审核环节状态 true 已审核 false 待审
          AuditState:false,//审核操作状态 true 通过 false 不通过
          AuditLinkUserId:'执行人3',//环节执行人
          AuditLinkSort:1,//审核环节序号*/
        }
      ],
      c:{
        /*AuditLinkId (string, optional),//审核环节编号
          AuditLinkName (string, optional),//审核环节名称
          AuditLinkState (boolean, optional),//审核环节状态 true 已审核 false 待审
          AuditState (boolean, optional)//审核操作状态 true 通过 false 不通过

          AuditLinkUserId (string, optional),//环节执行人
          AuditLinkSort (string, optional),//审核环节序号*/

      },
      // 数组对象
      milepost: [
        { id: 1, title: "审核环节一", description: "已审核" },
        { title: "审核环节二", description: "已审核" },
        { id: 1, title: "审核环节三", description: "已审核" },
        { title: "审核环节四", description: "审核不通过" },
        { title: "审核环节五", description: "待审核" }
      ],
      // 默认步骤数
      milepostActive: 4,
      imgIcon: imgIcon,
      // 动态添加类名
      stepActive: "stepActive",
      myAduit: 2,
      isBorder: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.isBorder = this.$parent.$parent.$parent.isBorde;
    });
  }
};
</script>
<style lang="scss">
.el-steps {
  padding: 20px;
  padding-left: 100px;
  padding-right: 120px;
}
.passImg {
  width: 80px;
  height: 80px;
  position: relative;
  left: -50px;
  top: 10px;
}
.el-step {
  padding: 10px 0;
}
.el-step__line {
  background: #fff;
}
.el-step.is-horizontal {
  flex-basis: 8% !important;
}
.el-step__line-inner {
  width: 100% !important;
  border-width: 1px !important;
  border-style: dashed;
  border: 1px dashed rgba(216, 216, 216, 1);
}
.el-step__icon-inner {
  font-size: 20px !important;
}
.el-step__head.is-finish,
.el-step__description.is-finish {
  color: #75c200;
}
.el-step__head.is-process {
  .el-step__icon {
    color: rgba(166, 170, 174, 1);
  }
}
.el-step__icon.is-icon {
  width: auto !important;
}
.el-step__title.is-process {
  color: rgba(166, 170, 174, 1);
  font-weight: 400;
}
.el-step__description.is-process {
  color: rgba(166, 170, 174, 1);
  font-weight: 400;
}
.el-step__title.is-finish {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(70, 73, 76, 1);
  text-align: center;
}
.el-step__description {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 20px;
  color: rgba(166, 170, 174, 1);
}
.el-icon-error {
  color: #ff3d3d;
}
.errorClass .el-step__description {
  color: #ff3d3d !important;
}
.el-step.is-horizontal.stepActive {
  .el-step__head.is-finish {
    color: #75c200;
    .el-step__line {
      // 当前步骤数横线样式设置
      .el-step__line-inner {
        width: 100% !important;
        border-width: 1px !important;
        border: 1px solid #75c200;
      }
    }
    // 当前步骤数圆圈样式设置
    .el-step__icon.is-text {
    }
  }
}
.finishBorder {
  border: 1px dashed #75c200;
}
</style>
