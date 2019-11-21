<template>
  <div class="business_box">
    <div>
      <div class="left_box">
        <!--左侧栏目-->
        <MenuTree ref="treeChild"></MenuTree>
      </div>
      <div class="right_box">
        <!--公用节点组-->
        <Teams></Teams>
        <!--节点流程-->
        <Nodes></Nodes>
      </div>
    </div>
  </div>
</template>

<script>
  import MenuTree from './components/MenuTree'
  import Teams from './components/Teams'
  import Nodes from './components/Nodes'
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "businessManagement",
    components: {MenuTree: MenuTree, Teams: Teams, Nodes: Nodes},
    data(){
      return{
      }
    }
  }
</script>

<style lang="scss">
  .business_box {
    .btnSpan {
      cursor: pointer;
      font-size: 14px;
      padding: 3px 8px;
      border-radius: 3px;
      display: inline-block;
    }
    .btnSpanLeft {
      color: #B59200;
      border: solid 1px #B59200;
    }
    .btnSpanRight {
      color: #FF3D3D;
      border: solid 1px #FF3D3D;
    }
    .triangle_Up {
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 6px solid #FF4444;
    }
    .triangle_Left {
      display: inline-block;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-right: 12px solid #FF4444;
    }
    li {
      list-style-type: none
    }
    background: #EFF1F4;
    position: relative;
    padding: 16px 16px 0 16px;
    height: calc(100vh - 74px);
    > div {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      height: inherit;
    }
    .left_box {
      width: 240px;
      position: relative;
      background: #fff;
      padding: 25px 25px;
      margin-right: 16px;
      > ul {
        border: solid 1px #D8E2E7;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .el-menu {
        height: 100%;
        color: #46494C;
        .el-submenu__title, > .el-menu-item {
          background: #F0F2F5
        }
        .el-menu.el-menu--inline .el-menu-item {
          background: #fff;
          color: #777C82
        }
        .el-menu-item.is-active {
          color: #fff !important;
          background: #00B2A1 !important;
        }
        .el-menu-item, .el-submenu__title, .el-submenu .el-menu-item {
          height: 38px !important;
          line-height: 38px !important;
          border-bottom: solid 1px #CAD9E0;
        }
      }
    }
    .right_box {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      -webkit-flex: 1;
      position: relative;
      overflow: hidden;
      height: 100%;
      .auditTeam {
        width: 100%;
        overflow-x: auto;
        > ul {
          margin: 0;
          padding: 0;
          height: 85px;
          width: 900%;
        }
        li {
          float: left;
          width: 150px;
          height: 85px;
          background: #fff;
          margin-right: 10px;
          text-align: center;
          cursor: pointer;
          h3 {
            color: #46494C;
            font: normal 16px 'Microsoft YaHei';
            margin: 13px 0;
          }
          p {
            margin: 0;
          }
        }
        .addTeam {
          cursor: pointer;
          p {
            color: #46494C;
            font-size: 14px;
            line-height: 85px;
          }
          i {
            color: #777C82;
            margin-right: 10px;
          }
        }
      }
      .ifExamine {
        margin: 12px 0;
        p {
          display: inline-block;
          float: right;
          color: #46494C;
          font-size: 14px;
        }
      }
      .team_item {
        background: #fff;
        padding: 16px;
        height: calc(100% - 58px);
        width: 100%;
        overflow: auto;
        > div{position: relative; background: #F7F7F7;
          padding: 20px 18px 0 18px;margin-bottom: 10px;border: dashed 1px #99cac5;
        }
        > div > div {
          position: relative;
          padding: 0px 0px 33px 0px;
          overflow: auto;
        }
        .team_btn {
          position: absolute;
          right: 20px;
          margin: 0;
          bottom: 20px;
          i {
            margin-left: 10px;
            color: #666666;
            cursor: pointer;
          }
        }
        .teams_node {
          margin: 0;
          padding: 0;

          li {
            float: left;
          }
          .item_cont >div {
            width: 140px;
            height: 74px;
            border: solid 1px #CAD9E0;
            text-align: center;
            border-radius: 3px;
            float: left;
            p {
              color: #46494C;
              font-size: 14px;
              margin: 12px 0;
              i {
                color: #00B2A1;
                font-size: 12px;
                margin-right: 10px;
              }
            }
          }
          .item_cont >i {line-height: 48px;margin: 0 10px;color: #979BA0;font-size: 35px;}
          .iconfontColor{color: #00B3A1 !important;}
          .item_cont >label{font-size: 20px;color: #777C82;line-height: 72px;margin-left: 10px;cursor: pointer}
        }
        .line{
          height: 28px;border: solid 2px #FF4444;border-top: none;position: relative;margin: 0;
          .triangle_Up{position: absolute;left: -5px;top: -3px;}
          .triangle_Left{position: absolute;bottom: -5px;left: 40%}
        }
      }
      .node_box{height: calc(100% - 100px);position: relative}
      .disablepointer{ pointer-events: none;cursor: default;}
      .onPointer{color: #00B3A1 !important;cursor: pointer;pointer-events:auto}
    }
  }
</style>
