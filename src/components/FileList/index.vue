<template>
  <div class="detail-file-list">
    <div class="user_file">
      <ul :class="maxHeight? 'fileBox clearfix fileBoxHeight':'fileBox clearfix'">
        <li v-for="(item,index) in files" :key="index" class="detailFile">
          <p v-show="item.type === 0?true:false"><img :src="item.url"></p>
          <p v-show="item.type === 1?true:false"><span class="icon iconfont" style="color:#345e9e;font-size: 60px;">&#xe65d;</span>
          </p>
          <p v-show="item.type === 2?true:false"><span class="icon iconfont" style="color:#389850;font-size: 60px;">&#xe693;</span>
          </p>
          <p v-show="item.type === 3?true:false"><span class="icon iconfont" style="color:#dc2e1b;font-size: 60px;">&#xe691;</span>
          </p>
          <i @click="handlePreview(item)">{{ item.name }}</i>
        </li>
      </ul>
    </div>
    <div v-show="ifImg" class="cl-image-viewer">
      <div class="cl-image-viewer__mask" @click="ifImg=false"/>
      <img :src="curSrc" alt="">
      <i class="el-icon-circle-close" @click="ifImg=false"></i>
    </div>
    <!--全屏预览图片 s-->
    <el-dialog
      :visible.sync="imgVisible"
      :fullscreen="imgVisible">
      <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100"/>
    </el-dialog>
    <!--全屏预览图片 e-->
  </div>
</template>

<script>
  export default {
    name: "index",
    props:['files'],
    data() {
      return {
        maxHeight: false,
        ifImg: false,
        curSrc: '',
        imgVisible: false,
        iframeUrl: '',
        clientHeight: ''
      }
    },
    methods:{
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
    },
    mounted() {
      this.$nextTick(() => {
        this.clientHeight = document.documentElement.clientHeight
        document.addEventListener('keydown', function (e) {//手动清空，避免点击下一条数据，预览图片弹窗没有关闭
          if (e.which == 27) {
            this.ifImg = false
          }
        }, false);
      })
    }
  }
</script>

<style lang="scss">
  .detail-file-list {
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
          height: 100%
        }

        width: 130px;
        height: 130px;
        list-style: none;
        float: left;
        border: solid 1px #D8E2E7;
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
          color: #00B3A1;
          font: normal 14px/25px '';
          text-decoration: underline;
          cursor: pointer
        }
      }
    }

    .user_file {
      padding: 0 12px;
    }

    .cl-image-viewer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      height: 100%;
      text-align: center;

      .el-image-viewer__canvas {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      img {
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .cl-image-viewer{
      i{
        font-size: 40px;
        color: #ddd;
        cursor: pointer;
        position: absolute;
        right: 5px;
        top: 5px;
      }
    }
    .cl-image-viewer__mask {
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
