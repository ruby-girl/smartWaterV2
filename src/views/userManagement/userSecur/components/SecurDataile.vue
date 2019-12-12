<template>
  <el-dialog
    class="secur-dataile"
    :close-on-click-modal="false"
    top="15vh"
    title="详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :width="dialogWidth"
  >
    <div class="detaile-content">
      <p class="secur_title">用户信息</p>
      <ul>
        <li class="userInfo">
          <p>
            用户编号
            <span>{{detaileData.CustomerNo}}</span>
          </p>
          <p>
            姓名
            <span>{{detaileData.CustomerName}}</span>
          </p>
          <p>
            水厂
            <span>{{detaileData.WaterFactoryName}}</span>
          </p>
          <p>
            所属区域
            <span>{{detaileData.AreaName}}</span>
          </p>
        </li>
        <li class="waterInfo">
          <p>
            水表类型
            <span>{{detaileData.WaterMeterTypeName}}</span>
          </p>
          <p>
            用水性质
            <span>{{detaileData.UseWaterTypeName}}</span>
          </p>
          <p>
            电话
            <span>{{detaileData.Tel}}</span>
          </p>
          <p>
            开户时间
            <span>{{detaileData.OpenAccountDate}}</span>
          </p>
        </li>
      </ul>
    </div>

    <div class="check_file">
      <p class="secur_title">低保户资质</p>
      <ul :class="maxHeight? 'fileBox clearfix fileBoxHeight':'fileBox clearfix'">
        <li v-for="(item,index) in file" :key="index" class="detailFile">
          <p v-show="item.type === 0?true:false">
            <img :src="item.url" />
          </p>
          <p v-show="item.type === 1?true:false">
            <span class="icon iconfont" style="color:#345e9e;font-size: 60px;">&#xe65d;</span>
          </p>
          <p v-show="item.type === 2?true:false">
            <span class="icon iconfont" style="color:#389850;font-size: 60px;">&#xe693;</span>
          </p>
          <p v-show="item.type === 3?true:false">
            <span class="icon iconfont" style="color:#dc2e1b;font-size: 60px;">&#xe691;</span>
          </p>
          <i @click="handlePreview(item)">{{ item.name }}</i>
        </li>
      </ul>
      <div class="clearfix date_secur">
        <p class="fl thisDate">
          生效日期
          <span>{{detaileData.StartDate}}~{{detaileData.EndDate}}</span>
        </p>
        <p class="fl">
          次年生效日期
          <span>{{detaileData.FS_StartDate}}~{{detaileData.FS_EndDate}}</span>
        </p>
      </div>
      <div class="user_remak clearfix">
        <p class="all">
          备注
          <span>{{detaileData.Remark}}</span>
        </p>
      </div>
    </div>
    <div v-show="ifImg" class="cl-image-viewer">
      <div class="cl-image-viewer__mask" @click="ifImg=false" />
      <img :src="curSrc" alt />
    </div>
    <!--全屏预览图片 s-->
    <el-dialog :visible.sync="imgVisible" :fullscreen="imgVisible">
      <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100" />
    </el-dialog>
    <!--全屏预览图片 e-->
  </el-dialog>
</template>
<script>
export default {
  name: "SecurDataile",
  props: {
    detaileData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    detaileData() {
      this.getFile(this.detaileData.saList);
    }
  },

  data() {
    return {
      dialogVisible: false,
      dialogWidth: "65%",
      maxHeight: false, //上传文件区域最大高度
      file: [], //上传文件集合
      curSrc: "", //当前图片路径
      ifImg: false, //是否显示图片标识
      imgVisible: false, //弹窗标识
      iframeUrl: "", //预览图片路径
      clientHeight: "" //预览图片高度
    };
  },
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      document.body.clientWidth < 1630
        ? (_this.dialogWidth = "90%")
        : (_this.dialogWidth = "65%"); //自适应窗体宽度

      window.onresize = function temp() {
        document.body.clientWidth < 1630
          ? (_this.dialogWidth = "90%")
          : (_this.dialogWidth = "65%");
      };
      document.addEventListener(
        "keydown",
        function(e) {
          //手动清空，避免点击下一条数据，预览图片弹窗没有关闭
          if (e.which == 27) {
            _this.ifImg = false;
          }
        },
        false
      );
    });
  },
  methods: {
    handleClose() {
      //弹窗关闭事件
      this.dialogVisible = false;
    },
    getFile(fileData) {
      this.file = [];
      let obj = {};
      for (let i = 0; i < fileData.length; i++) {
        //区分不同文件类型设置不同展示样式
        let thisType;
        const Suffix = fileData[i].FileExtName.split(".")[1];
        if (Suffix === "docx" || Suffix === "doc") {
          thisType = 1;
        } else if (Suffix === "xlsx" || Suffix === "xls") {
          thisType = 2;
        } else if (Suffix === "pdf") {
          thisType = 3;
        } else {
          thisType = 0;
        }
        obj = {
          id: fileData[i].Id,
          name: fileData[i].FileName,
          type: thisType,
          url: this.baseUrl + fileData[i].RelativePath.replace("~", "")
        };
        this.file.push(obj);

        //根据文件个数动态设置，文件显示区域高度
        this.file.length > 5
          ? (this.maxHeight = true)
          : (this.maxHeight = false);
      }
    },
    handlePreview(file) {
      // 点击文件列表中已上传的文件时的事件
      const type = file.type;
      switch (
        type // 0.图片，1word,2excel,3pdf
      ) {
        case 0:
          this.curSrc = file.url;
          this.ifImg = true;
          break;
        case 1:
          this.imgVisible = true;
          this.iframeUrl = file.url;
          break;
        case 2:
          this.imgVisible = true;
          this.iframeUrl = file.url;
          break;
        case 3:
          this.imgVisible = true;
          this.iframeUrl = file.url;
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-dataile {
  /deep/.el-dialog__body {
    padding: 16px;
    color: #777c82;
    background: rgba(245, 245, 245, 1);
  }
  .detaile-content {
    background: #fff;
    padding: 20px;
  }
  .secur_title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 17px;
    color: rgba(91, 91, 91, 1);
    border-left: 4px solid rgba(41, 190, 176, 1);
    padding-left: 5px;
  }
  ul {
    border: solid 1px #dbe3e8;
    margin: 0;
    padding: 0;
    li:last-child {
      border-bottom: none;
    }
    li:nth-child(2n + 1) {
      background: #f0f2f5;
    }
    li {
      list-style-type: none;
      width: 100%;
      border-bottom: solid 1px #dbe3e8;
      min-height: 38px;
      color: #777c82;
      font: normal 14px/38px "Microsoft YaHei";
      position: relative;

      p {
        display: inline-block;
        float: left;
        margin: 0;
        width: 25%;
        border-right: solid 1px #dbe3e8;
        padding: 0 12px;
        position: relative;
        overflow: hidden;

        span {
          color: #46494c;
          left: 100px;
          position: absolute;
        }
      }
      p:last-child {
        border: none;
      }
    }
  }
  .check_file {
    margin-top: 12px;
    background: #fff;
    padding: 17px 20px;
    .user_remak {
      border: 1px solid rgba(216, 226, 231, 1);
      height: 63px;
      border-top: 0;
      padding: 7px 14px;
      p {
        margin: 0;
      }
      span {
        height: 100%;
        line-height: 20px;
        padding: 10px 0;
      }
    }
    ul {
      border: 0;
    }
    .date_secur {
      border: solid 1px #dbe3e8;
      margin-top: 0;
      padding: 0;
      .thisDate {
        border-right: 1px solid rgba(219, 227, 232, 1);
      }
      p {
        width: 50%;
        background: #f0f2f5;
        line-height: 37px;
        margin: 0;
        position: relative;
        font-size: 14px;
        padding-left: 12px;
        span {
          color: #46494c;
          left: 82px;
          position: relative;
        }
      }
    }
    .all {
      width: 100%;
      height: inherit;
    }
    .fileBoxHeight {
      height: 320px;
      overflow: auto;
    }
    .fileBox {
      padding: 0;
      min-height: 160px;
      li {
        img {
          width: 100%;
          height: 100%;
        }
        width: 130px;
        height: 130px;
        list-style: none;
        float: left;
        border: solid 1px #d8e2e7;
        margin-right: 24px;
        position: relative;
        margin-bottom: 30px;
        p {
          width: 100%;
          height: 100%;
          overflow: hidden;
          margin: 0;
          text-align: center;
          line-height: 130px;
        }
        i {
          display: block;
          width: 100%;
          text-align: center;
          color: #00b3a1;
          font: normal 14px/25px "";
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
}
</style>