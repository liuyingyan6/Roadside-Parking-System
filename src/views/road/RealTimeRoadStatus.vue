<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {shallowRef} from '@vue/reactivity'

export default {
  name: "RealTimeRoadStatus",
  data() {
    return {
      //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      map: null,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    }
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "ace4630b9d878081625f1cce8dd1d325", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        this.map = new AMap.Map("container", {  //设置地图容器id
          viewMode: "3D",    //是否为3D地图模式
          zoom: 13,           //初始化地图级别
          center: [113.38893976806638, 23.18380156289729], //初始化地图中心点位置
        });

        let markers = [];
        let positions = [
          [113.39893976806638, 23.18380156289729],
          [113.37893976806638, 23.18380156289729],
          [113.38893976806638, 23.18380156289729],
        ];

        for (let i = 0, marker; i < positions.length; i++) {
          marker = new AMap.Marker({
            map: this.map,
            position: positions[i],
            extData: i, // 添加一个自定义属性，用于区分不同的marker
          });
          markers.push(marker);
          marker.on('click', () => {
            this.handleMarkerClick(marker.getExtData());
          });
        }

      }).catch(e => {
        console.log(e);
      })
    },
    handleMarkerClick(extData) {
      console.log(extData);
    }
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  setup() {
    const map = shallowRef(null);
    return {
      map,
    }
  },
}


</script>

<template>
  <div style="display: flex;">
    <div>
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址">
        </el-table-column>
      </el-table>
    </div>
    <div id="container" style="display: inline-block;"></div>
  </div>
</template>

<style scoped lang="less">
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>