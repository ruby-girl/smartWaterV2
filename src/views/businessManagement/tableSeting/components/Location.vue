<template>
  <div class="position_conitoner">
    <p v-show="!location" class="position_icon" @click="location = ! location"><i class="iconfont iconjianqu" style="color: #33B300;font-size: 25px;"></i></p>
    <div :class="location? 'location_box moveOut': 'location_box'">
      <h5>用户表册定位</h5>
      <el-form>
        <el-form-item label="用户:" label-width="63px">
          <el-select v-model="rbp.ecqt" placeholder="请选择" style="width: 70px;float: left" size="small">
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
          <el-input v-model="rbp.Customer" ref="userInfoInput" maxlength="20" placeholder="(长度1-30)"
                    style="width: 150px;float: left;margin-left: 8px" size="small"/>
        </el-form-item>
        <el-form-item style="text-align: right;width: 100%">
          <el-button @click="getListUser()" style="margin-right: 17px;background: #75C200;border: solid 1px #75C200;"
                     type="primary" size="mini" class="cl-search"><i class="el-icon-location-outline"></i>
            用户表册定位
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Location",
    data() {
      return {
        location:false,
        rbp: {
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "",
          ecqt: '1',
          Customer: "",
          SA_Customer_Id: ""
        }
      }
    },
    methods: {
      getListUser() {
        let _this = this
        if (this.rbp.Customer.trim() == '') {
          this.$message({
            message: '用户信息不能为空',
            type: 'warning',
            duration: 4000
          });
          this.$refs.userInfoInput.$el.querySelector('input').focus();
          return
        }
        let params = Object.assign({}, this.rbp);
        this.$parent.setChildFun(params)
        this.location = false
        setTimeout(()=>{
          _this.rbp.ecqt = '1'
          _this.rbp.Customer = ''
        },500)
      },
    }
  }
</script>

<style scoped lang="scss">
  .position_conitoner{
    position: fixed;
    right: 30px;
    top: 60px;
    z-index:2020;
    .position_icon {
      cursor: pointer;position:absolute;right: 0px;top: 0px;margin: 0;
      width: 46px;height: 46px;border-radius: 50%;box-shadow: 1px 1px 5px #cecece; -webkit-box-shadow: 1px 1px 5px #cecece;text-align: center;background: #fff;line-height: 46px;
    }
    .location_box {
      background: #f5f5f5;
      padding-top: 12px;
      padding-bottom: 1px;
      width: 310px;
      display: none;
      .el-form-item {margin-bottom: 20px;}
      h5 {
        color: #46494C;
        font: bold 16px "Microsoft YaHei";
        margin: 5px 0 25px 20px
      }
    }
    .moveOut{
      display: block;
      animation:move .5s;
      -webkit-animation:move .5s;
      animation-fill-mode:forwards;
      -webkit-animation-fill-mode:forwards;
      transform-origin: right top;
    }
    @keyframes move{
      0%{
        transform: scale(0);
      }
      25%{
        transform: scale(1);
      }
    }
    @-webkit-keyframes move{
      0%{
        transform: scale(0);
      }
      25%{
        transform: scale(1);
      }
    }
  }
</style>
