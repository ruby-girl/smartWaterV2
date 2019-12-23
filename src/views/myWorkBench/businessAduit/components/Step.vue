<template>
  <el-steps :active="milepostActive" align-center>
    <el-step
      v-for="(value, index) in linkCont"
      :key="index"
      :class="value.className"
      :title="value.AuditLinkName"
      :description="value.description"
      :icon="value.iconName"
    ></el-step>
    <img v-if="milepostActive==linkCont.length" class="passImg" :src="imgIcon"/>
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
  import imgIcon from "@/assets/imgs/pass.png"

  export default {
    name: "Step",
    props: ['linkCont', 'processId', 'personId'],
    data() {
      return {
        // 数组对象
        milepost: [
          {id: 1, title: "审核环节一", description: "已审核"},
          {title: "审核环节二", description: "已审核"},
          {id: 1, title: "审核环节三", description: "已审核"},
          {title: "审核环节四", description: "审核不通过"},
          {title: "审核环节五", description: "待审核"}
        ],
        // 默认步骤数
        imgIcon: imgIcon,
        // 动态添加类名
        myAduit: 2,
        isBorder: false,
        milepostActive:0
      }
    },
    watch: {
      linkCont(val) {
        val.forEach((item, index) => {
          if (item.AuditLinkState) {//根据最后一个已审核节点 判断当前流程审核节点所在位置
            this.milepostActive = index + 1
          }
          if (index + 1 < this.milepostActive) {//小于当前匹配节点后的显示 图标成功或者失败
            if (item.AuditLinkState && item.AuditState) {
              if (item.AuditLinkUserId == this.personId) {//筛选当前操作人匹配项
                if (item.AuditLinkState && item.AuditState) {//true 为审核通过 false 审核不通过
                  item.className = 'classOne'//控制字体颜色
                  item.iconName = 'el-icon-success'
                  item.description = '我已审核'
                } else {
                  item.className = 'classTwo'//控制字体颜色
                  item.iconName = 'el-icon-error'
                  item.description = '我审核不通过'
                }
              } else {
                if (item.AuditLinkState && item.AuditState) {//true 为审核通过 false 审核不通过
                  item.className = 'classOne'//控制字体颜色
                  item.iconName = 'el-icon-success'
                  item.description = '已审核'
                } else {
                  item.className = 'classTwo'//控制字体颜色
                  item.iconName = 'el-icon-error'
                  item.description = '审核不通过'
                }
              }
            }
          } else {//待审核
            item.className = 'classThree'//控制字体颜色
            item.iconName = 'el-icon-success'
            item.description = '待审核'
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .classOne .el-step__description {
    color: #75C200 !important;
    font-weight: bold !important;;
  }

  .classTwo .el-step__description {
    color: #FF3D3D !important;;
    font-weight: bold !important;;
  }

  .classThree .el-step__description {
    color: #A6AAAE !important;;
    font-weight: bold !important;;
  }

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

  .el-step__title.is-wait, .el-step__title.is-process {
    color: #46494C !important;
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
