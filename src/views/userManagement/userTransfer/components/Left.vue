<template>
  
      <!--左侧树形菜单-->
      <div class="user_tree">
        <h4 style="color:#777777;">用户过户</h4>
        <div class="transfer-container">
          <div class="display-flex align-items-center justify-content-flex-justify">
            <div class="font-weight" style="color:#535353">原用户信息</div>
            <el-button type="success" size="mini" @click="addRole">
              <i class="iconfont icontianjia"></i>读卡
            </el-button>
          </div>
          <el-form ref="form" label-width="70px" style="margin-top:13px;">
            <el-form-item label="姓名：">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="用户编号：">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="证件号：">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="地址：">
              <el-input v-model="name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="transfer-container" style="margin-top:13px;">
          <div class="display-flex align-items-center justify-content-flex-justify">
            <div class="font-weight" style="color:#535353;line-height:38px;">新用户信息</div>
          </div>
          <el-form ref="form" label-width="70px">
            <div class="display-flex align-items-center justify-content-flex-justify">
              <el-form-item label="姓名：">
                <el-input v-model="name"></el-input>
              </el-form-item>
              <el-form-item label="人口：" label-width="45px">
                <el-input v-model="name" style="width:40px;"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="电话：">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="证件号：">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="name"></el-input>
            </el-form-item>
          </el-form>
          <el-form
            :inline="true"
            ref="Enclosure"
            :model="Enclosure"
            :rules="rules"
            label-width="100px"
          >
            <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
          </el-form>
        </div>
        <span v-show="!ifShow" class="telescopic telescopic2" @click="getUp">
          收起
          <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
        </span>
      </div>
</template>
<script>
import uploadBox from '@/components/Upload'
import "@/styles/organization.scss";
export default {
  name: "userSeting",
  components: {uploadBox},
  data() {
    return {
      ifShow: false,
      name:'r'
    };
  },
  methods: {
    /**
     * 伸缩功能
     * */
    getUp() {
      this.ifShow = !this.ifShow;
      if (this.ifShow) {
        document.getElementsByClassName("user_tree")[0].classList.add("hide");
      } else {
        document
          .getElementsByClassName("user_tree")[0]
          .classList.remove("hide");
      }
    },
   
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.tree_container {
  .icon {
    font-size: 14px;
  }
  background: #eff1f4;
  .telescopic {
    position: absolute;
    display: block;
    top: 300px;
    color: #777c82;
    font: normal 16px "Microsoft YaHei";
    width: 30px;
    margin: 0 auto;
    word-wrap: break-word;
    -webkit-box-shadow: 1px 1px 5px #cecece;
    background: #fff;
    padding: 15px 0;
    z-index: 999;
    text-align: center;
    cursor: pointer;
    box-shadow: 1px 1px 5px #cecece;
  }
  .telescopic1 {
    left: 0;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
  .telescopic2 {
    right: 0px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }
  position: relative;
  padding: 16px 16px 0 16px;
  height: calc(100vh - 74px);
  .user_box {
    display: flex;
    height: inherit;
    > div {
      transition: width 0.2s;
      -webkit-transition: width 0.2s;
      position: relative;
    }
    .user_tree {
      width: 280px;
      position: relative;
      background: #fff;
      padding: 0 13px;
      margin-right: 16px;
    }
    .user_table {
      flex: 1;
      -webkit-flex: 1;
      background: #fff;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }
  }
  .el-button--mini {
    padding: 7px 5px;
  }
  .hide {
    width: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    margin-right: 0 !important;
  }
  .none {
    display: none;
  }
  .user_table {
    .el-button--small {
      padding: 7px 15px;
    }
  }
}
.transfer-container {
  padding: 5px;
  background: #f5f5f5;
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
