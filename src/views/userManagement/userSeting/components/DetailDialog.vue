<template>
  <el-dialog
    class="cl_DetailDialog"
    :close-on-click-modal="false"
    top="5vh"
    title="详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :width = dialogWidth>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--用户信息-->
      <el-tab-pane label="用户信息" name="1">
          <div class="user_info">
            <ul>
              <li class="user_line clearfix">
                <p>水厂 <span> {{formData.SA_WaterFactoryName}}</span></p>
                <p>用户编号 <span>{{formData.CustomerNo}}</span></p>
                <p>姓名 <span>{{formData.CustomerName}}</span></p>
                <p>简码 <span>{{formData.NameCode}}</span></p>
              </li>
              <li class="user_line clearfix">
                <p>电话 <span>{{formData.Tel}}</span></p>
                <p>人口 <span>{{formData.PeopleNo}}</span></p>
                <p>用户类型 <span>{{formData.UserTypeStr}}</span></p>
                <p>用水性质 <span>{{formData.SA_UseWaterType}}</span></p>
              </li>
              <li class="user_line clearfix">
                <p class="half">证件号 <span>{{formData.IdentityNo}}</span></p>
                <p>表册 <span>{{formData.RegisterBookInfoName}}</span></p>
                <p class="money">账号余额 <span>{{formData.Balance}}</span></p>
              </li>
              <li class="user_line clearfix">
                <p class="half">区域 <span>{{formData.SA_UserAreaName}}</span></p>
                <p class="half">纳税人识别号 <span>{{formData.TaxpayerNumber}}</span></p>
              </li>
              <li class="user_line clearfix">
                <p class="all">地址 <span>{{formData.Address}}</span></p>
              </li>
              <li class="user_file">
                <p>附件</p>
                <ul :class="maxHeight? 'fileBox clearfix fileBoxHeight':'fileBox clearfix'">
                  <li v-for="(item,index) in file" :key="index" class="detailFile">
                    <p v-show="item.type === 0?true:false"><img :src="item.url"></p>
                    <p v-show="item.type === 1?true:false"><span class="icon iconfont" style="color:#345e9e;font-size: 60px;">&#xe65d;</span></p>
                    <p v-show="item.type === 2?true:false"><span class="icon iconfont" style="color:#389850;font-size: 60px;">&#xe693;</span></p>
                    <p v-show="item.type === 3?true:false"><span class="icon iconfont" style="color:#dc2e1b;font-size: 60px;">&#xe691;</span></p>
                    <i @click="handlePreview(item)">{{ item.name }}</i>
                  </li>
                </ul>
              </li>
              <li class="user_remak clearfix">
                <p class="all">备注 <span>{{formData.Remark}}</span></p>
              </li>
            </ul>
          </div>
      </el-tab-pane>
      <!--历史业务-->
      <el-tab-pane label="历史业务" name="2">
        <HistoryBusiness ref="historyBusiness"></HistoryBusiness>
      </el-tab-pane>
      <!--水表信息-->
      <el-tab-pane label="水表信息" name="3">
        <!--机械表-->
        <WaterMeter v-show="waterType == 1101" ref="myJxWaterChild"></WaterMeter>
        <!--IC水表-->
        <ICWater v-show="waterType == 1102" ref="myIcWaterChild"></ICWater>
        <!--物联网-->
        <WlwWaterMeter v-show="waterType == 1104" ref="myWlWaterChild"></WlwWaterMeter>
        <!--远传-->
        <YcWaterMeter v-show="waterType == 1103" ref="myYcWaterChild"></YcWaterMeter>
      </el-tab-pane>
    </el-tabs>
    <div v-show="ifImg" class="cl-image-viewer">
      <div class="cl-image-viewer__mask" @click="ifImg=false" />
      <img :src="curSrc" alt="">
    </div>
    <!--全屏预览图片 s-->
    <el-dialog
      :visible.sync="imgVisible"
      :fullscreen="imgVisible">
      <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100" />
    </el-dialog>
    <!--全屏预览图片 e-->
  </el-dialog>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import HistoryBusiness from "./DetailComponents/HistoryBusiness"
  import WaterMeter from "./DetailComponents/WaterMeter"
  import ICWater from "./DetailComponents/ICWater"
  import WlwWaterMeter from "./DetailComponents/WlwWaterMeter"
  import YcWaterMeter from "./DetailComponents/YcWaterMeter"
  import { GetBlObjById } from "@/api/userSetting"//区域接口

  export default {
    name: 'DetailDialog',
    components:{ HistoryBusiness, WaterMeter, ICWater, WlwWaterMeter, YcWaterMeter },
    data() {
      return {
        waterType:1101,//1 机械，2 IC，3 物联网，4 远传
        dialogWidth:'65%',
        activeName:'1',//当前选项卡位置
        dialogVisible:false,//详情弹窗隐藏标识
        maxHeight:false,//上传文件区域最大高度
        file: [],//上传文件集合
        curSrc: '',//当前图片路径
        ifImg: false,//是否显示图片标识
        imgVisible: false,//弹窗标识
        iframeUrl: '',//预览图片路径
        clientHeight: '',//预览图片高度
        formData:''
      }
    },
    methods: {
      handleClose(){//弹窗关闭事件
        this.dialogVisible = false
        this.activeName = '1'
      },
      handlePreview(file) { // 点击文件列表中已上传的文件时的事件
        const type = file.type
        switch (type) { // 0.图片，1word,2excel,3pdf
          case 0:
            this.curSrc = file.url
            this.ifImg = true
            break
          case 1:
            this.imgVisible = true
            this.iframeUrl = file.url
            break
          case 2:
            this.imgVisible = true
            this.iframeUrl = file.url
            break
          case 3:
            this.imgVisible = true
            this.iframeUrl = file.url
            break
        }
      },
      /**
       * 根据ID 获取当前数据详情信息
       * id 用户id
       * type 水表类型
       * */
      getInfo(id,type) {
        this.waterType = type
        /*用户信息*/
        GetBlObjById({'CusId':id}).then(res => {//获取用户信息
          if(res.code==0){
            this.file = []
            this.formData = res.data
            let fileData = res.data.saList
            let obj = {}
            for(let i=0;i<fileData.length;i++){//区分不同文件类型设置不同展示样式
              let thisType;
              const Suffix = fileData[i].FileExtName.split('.')[1]
              if (Suffix === 'docx' || Suffix === 'doc') {
                thisType = 1
              } else if (Suffix === 'xlsx' || Suffix === 'xls') {
                thisType = 2
              } else if (Suffix === 'pdf') {
                thisType = 3
              }else {
                thisType = 0
              }
              obj = {
                id: fileData[i].Id,
                name:fileData[i].FileName,
                type: thisType,
                url: this.baseUrl + (fileData[i].RelativePath).replace("~",""),
              }
              this.file.push(obj)

              //根据文件个数动态设置，文件显示区域高度
              this.file.length>5 ?  this.maxHeight = true : this.maxHeight = false
            }
          }else {
            promptInfoFun(this,1,res.message)
          }
        })
        /*历史业务及水表信息*/
        this.$nextTick(()=>{
          this.$refs.historyBusiness.getHistoryInfo(id)
          switch (type) {
            case 1101://机械
              this.$refs.myJxWaterChild.getDetialInfo(id)
              break
            case 1102://IC
              this.$refs.myIcWaterChild.getDetialInfo(id)
              break
            case 1103://远传
              this.$refs.myYcWaterChild.getDetialInfo(id)
              break
            case 1104://物联网
              this.$refs.myWlWaterChild.getDetialInfo(id)
              break
          }
        })
      },
      resetForm(formName) {//重置清空避免点击下次信息页面显示错乱
        this.$refs[formName].resetFields()
        this.file = []
        this.activeName = 1
      },
      /**
       * 选项卡切换
       * */
      handleClick(){
        if(this.activeName == '3'){
          switch (this.waterType) {//1 机械，2 IC，3 物联网，4 远传
            case 1101:
              this.$refs.myJxWaterChild.setMeterNum()
              break
            case 1102:
              this.$refs.myIcWaterChild.setMeterNum()
              break
            case 1103:
              this.$refs.myYcWaterChild.setMeterNum()
              break
            case 1104:
              this.$refs.myWlWaterChild.setMeterNum()
              break
          }
        }
      }
    },
    mounted() {
      let _this = this
      this.$nextTick(()=>{
        document.body.clientWidth<1630 ? _this.dialogWidth = '90%' : _this.dialogWidth = '65%'//自适应窗体宽度
        _this.clientHeight = document.documentElement.clientHeight

        window.onresize = function temp() {
           document.body.clientWidth<1630 ? _this.dialogWidth = '90%' : _this.dialogWidth = '65%'
          _this.clientHeight = document.documentElement.clientHeight
        }
        document.addEventListener('keydown', function(e){//手动清空，避免点击下一条数据，预览图片弹窗没有关闭
          if(e.which == 27){
            _this.ifImg = false
          }
        }, false);
      })
    }
  }
</script>
<style lang="scss">
  .cl_DetailDialog{
    .el-dialog__body{background: #f5f5f5;}
    .user_info{padding: 36px 100px;background: #fff;height: 580px;overflow: auto}
    .user_water_info{height: 474px;}
    .el-tabs__header { margin: 0;
      .el-tabs__item{font-size: 13px;color: #5B5B5B}
      .el-tabs__item.is-active{color: #5B5B5B;font-size: 14px;font-weight: bold;}
      .el-tabs__nav{padding: 5px 0;}
      .el-tabs__nav-wrap::after{ background-color: transparent; }
    }
    .el-dialog__body{padding: 0px 20px 20px 20px}
    .user_info{
      >ul{
        border:solid 1px #DBE3E8;margin: 0;padding: 0;
        >li{
          list-style-type: none;width: 100%;border-bottom: solid 1px #DBE3E8;min-height: 38px;color: #777C82;font: normal 14px/38px 'Microsoft YaHei';position: relative;
        }
        >li:last-child{border-bottom: none;}
        >li:nth-child(2n+1){background: #F0F2F5;}
      }
    }
    .user_line, .user_remak {
      >p{display: inline-block;float: left;margin: 0;width: 25%;border-right: solid 1px #DBE3E8;padding: 0 12px;position: relative;overflow: hidden}
      >p:last-child{border: none;}
      span{color: #46494C;left: 100px;position: absolute; }
      .money{color: #FF3D3D;
      span{color: #FF3D3D}}
      .half{width: 50%;}
      .all{width: 100%;height: inherit;
      span{overflow:auto;max-height: 100px;display: inline-block;width: calc(100% - 100px)}
      }
    }
    .user_remak{height: 80px;
      span{ height: 100%;line-height: 20px;padding: 10px 0;}
    }
    .fileBoxHeight{height: 320px;overflow:auto;}
    .fileBox {
      padding: 0;
      min-height: 160px;
      li{
        img{width: 100%;height: 100%}
        width: 130px;height: 130px;list-style: none;float: left;border: solid 1px #D8E2E7;margin-right: 24px;position: relative;margin-bottom: 30px;
        p{width: 100%;height:100%;overflow: hidden;margin: 0;text-align: center;line-height: 130px;}
        i {display: block;width: 100%;text-align: center;color: #00B3A1;font:normal 14px/25px '';text-decoration: underline;cursor: pointer}
      }
    }
    .user_file{padding: 0 12px;}
    .cl-image-viewer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      height: 100%;
      text-align: center;
      .el-image-viewer__canvas{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img{
        max-height: 100%; max-width: 100%;
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .cl-image-viewer__mask{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: .5;
      background: #000;
      cursor: pointer;
    }
  }
</style>
