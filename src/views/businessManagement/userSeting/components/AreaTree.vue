<template>
  <ul class="cl-areatreeBox clearfix">
    <li>
      <p>四川省 <i class="el-icon-caret-right"></i></p>
    </li>
    <li>
      <p>成都市 <i class="el-icon-caret-right"></i></p>
      <p>新的市 <i class="el-icon-caret-right"></i></p>
    </li>
    <li>
      <p>花园 <i class="el-icon-caret-right"></i></p>
      <p>小去 <i class="el-icon-caret-right"></i></p>
    </li>
    <li>
      <p>此次 <i class="el-icon-caret-right"></i></p>
      <p>哦哦 <i class="el-icon-caret-right"></i></p>
    </li>
    <li>
      <p>小区 <i class="el-icon-caret-right"></i></p>
      <p>小区1 <i class="el-icon-caret-right"></i></p>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'AreaTree',
    data() {
      return {
        data: [{
          id: 1,
          label: '一级',
          children: [{
            id: 4,
            label: '二级',
            children: [{
              id: 9,
              label: '三级1',
              children: [
                {
                  id: 11,
                  label: '四级1',
                  children: [
                    {
                      id: 12,
                      label: '五及1',
                    },
                    {
                      id: 13,
                      label: '五及2',
                    }
                  ]
                }, {
                  id: 13,
                  label: '4及2',
                  children: [
                    {
                      id: 12,
                      label: '五ee及1',
                    },
                    {
                      id: 13,
                      label: '五rr及2',
                    }
                  ]
                }
              ]
            }, {
              id: 13,
              label: '3级1',
              children: [
                {
                  id: 12,
                  label: 'sssee及1',
                },
                {
                  id: 13,
                  label: 'jjrr及2',
                }
              ]
            }
            ]
          }, {
            id: 13,
            label: '2级1',
          }]
        }]
      }
    },
    methods: {
      setCurNode(e) {
      }
    }
  }
</script>
<style lang="scss">
  .cl-areatreeBox {
     width: 100%;margin: 8px 0 0 0;box-shadow: 1px 1px 5px #cecece;height: 180px;overflow: hidden;position: absolute;z-index: 9;background: #fff;
    -webkit-box-shadow: 1px 1px 5px #cecece;padding: 0;
    li{
      width: 20%;list-style-type: none;float: left;cursor: pointer;text-align: left;padding: 0 15px 0 20px;border-right: solid 1px #ddedf5;height: 100%;
      p{margin: 0}
      i{float: right;margin-top: 11px;}
    }
    p:hover, p.on {color: #00B3A1}
  }
</style>
