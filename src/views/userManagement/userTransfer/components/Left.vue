<template>
  
      <!--左侧树形菜单-->
      <div class="user_tree">
        <h4 style="color:#777777;">用户过户</h4>
        <div class="transfer-container">
          <div class="display-flex align-items-center justify-content-flex-justify">
            <div class="font-weight" style="color:#535353">原用户信息</div>
            <el-button type="success" size="mini">
              <i class="iconfont icontianjia"></i>读卡
            </el-button>
          </div>
          <el-form ref="form" label-width="70px" style="margin-top:13px;">
            <el-form-item label="姓名：">
              <el-input v-model="name" @keyup.enter.native="handleSelect(name,1)"></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="name" @keyup.enter.native="handleSelect"></el-input>
            </el-form-item>
            <el-form-item label="用户编号：">
              <el-input v-model="name" @keyup.enter.native="handleSelect"></el-input>
            </el-form-item>
            <el-form-item label="证件号：">
              <el-input v-model="name" @keyup.enter.native="handleSelect"></el-input>
            </el-form-item>
            <el-form-item label="地址：">
              <el-input v-model="name" @keyup.enter.native="handleSelect"></el-input>
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
                <el-input v-model="newUser.NewCustomerName"></el-input>
              </el-form-item>
              <el-form-item label="人口：" label-width="45px">
                <el-input v-model="newUser.NewPeopleNo" style="width:40px;"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="电话：">
              <el-input v-model="newUser.NewTel"></el-input>
            </el-form-item>
            <el-form-item label="证件号：">
              <el-input v-model="newUser.NewIdentityNo"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="newUser.Remark"></el-input>
            </el-form-item>
          </el-form>
          <div class="bottom-btn-box">
             <el-button style="padding:8px 14px;" type="success" size="mini"  @click="fileShow=true"><i class="iconfont iconsousuo"></i>附件</el-button>
          </div>  
        </div>
        <span v-show="!ifShowChild" class="telescopic telescopic2" @click="getUp">
          收起
          <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
        </span>
        <div class="bottom-btn-box">
          <el-button type="primary" @click="account()" size="mini" style="padding:8px 14px;">
          确认过户
        </el-button>
        </div>
        <fileList :show.sync="fileShow" :file.sync="file"></fileList>
        <select-user
      :selectUserShow.sync="selectUserShow"
      :headQuery="params"
      @handleFilter="handleFilter"
    />
      </div>
</template>
<script>
import "@/styles/organization.scss";
import {IsTransfer} from "@/api/userAccount"
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import SelectUser from "@/components/SelectUser";
import FileList from "./FileList"
export default {
  components: {FileList,SelectUser},
  props: {ifShow:{}},
  data() {
    return {
      ifShowChild: false,
      fileShow:false,
      name:'r',
      user:{},
      newUser:{
        NewCustomerName:'',//姓名
        NewTel:'',//电话
        NewPeopleNo:'',//人口
        NewIdentityNo:'',//证件号
        Remark:'',//备注
      },     
      file:[],
      params:{
        page:1,
        Limit:10,
        CustomerQueryType:"",
        CustomerQueryValue:"",
      },
      selectUserShow:false,

    };
  },
  watch:{
    ifShow(v){
      this.ifShowChild=v
    }
  },
  methods: {
    /**
     * 伸缩功能
     * */
    getUp() {
      this.$emit("getUp",this.ifShowChild)
      // this.ifShow = !this.ifShow;
      // if (this.ifShow) {
      //   document.getElementsByClassName("user_tree")[0].classList.add("hide");
      // } else {
      //   document
      //     .getElementsByClassName("user_tree")[0]
      //     .classList.remove("hide");
      // }
    },
    account(){
      console.log(this.file)
    },
    // 模糊查询用户
    handleSelect(val,n){
      if(!val) {
        this.user={}
        return false
      }
      this.params.CustomerQueryValue=val
      this.params.CustomerQueryType=n
       GetCustomerDataList(this.params).then(res => {
        if (res.data.length == 0) {
          this.$message({
            message: "未查询到用户！",
            type: "error",
            duration: 4000
          });
          this.user={}
        } else if (res.data.length == 1) {
          this.user = res.data[0];
        } else {
          this.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
    },
    handleFilter(val){
      console.log(val)
    }
   
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
.bottom-btn-box{
  text-align: center;
  padding: 25px 0;
}
</style>
