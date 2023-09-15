<script>
    import AMapLoader from '@amap/amap-jsapi-loader';
    import {shallowRef} from '@vue/reactivity'

    export default {
        name: "RealTimeRoadStatus",
        data() {
            return {
                //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
                map: null,
                roads: [],
                road: {}
            }
        },
        methods: {
            initMap() {
                AMapLoader.load({
                    key: "ace4630b9d878081625f1cce8dd1d325",
                    version: "2.0",
                    plugins: [''],
                }).then((AMap) => {
                    this.map = new AMap.Map("container", {
                        viewMode: "3D",
                        zoom: 13,
                        center: [113.38893976806638, 23.18380156289729],
                    });

                    let markers = [];
                    for (let i = 0; i < this.roads.length; i++) {
                        let road = this.roads[i];
                        let marker = new AMap.Marker({
                            map: this.map,
                            position: road.position,
                            extData: i,
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
                this.road = this.roads[extData];
            },
            initRoads() {
                this.roads = [
                    {
                        name: '广东路',
                        parkingCount: 50,
                        busyParkingCount: 35,
                        inspectorName: 'A巡检员',
                        inspectorPhone: '13398760893',
                        position: [113.39893976806638, 23.18380156289729],
                    },
                    {
                        name: '南天路',
                        parkingCount: 100,
                        busyParkingCount: 67,
                        inspectorName: 'B巡检员',
                        inspectorPhone: '13399434982',
                        position: [113.37893976806638, 23.18380156289729],
                    },
                    {
                        name: '东山路',
                        parkingCount: 80,
                        busyParkingCount: 33,
                        inspectorName: 'C巡检员',
                        inspectorPhone: '15576760982',
                        position: [113.38893976806638, 23.18380156289729],
                    }
                ]
            },
        },
        created() {
            this.initRoads();
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
        <div style="display: inline-block;width: 600px;">
            <el-descriptions title="路段信息">
                <el-descriptions-item label="路段名称">{{road.name}}</el-descriptions-item>
                <el-descriptions-item label="车位数量">{{road.parkingCount}}</el-descriptions-item>
                <el-descriptions-item label="使用中车位数量">{{road.busyParkingCount}}</el-descriptions-item>
                <el-descriptions-item label="巡检员姓名">{{road.inspectorName}}</el-descriptions-item>
                <el-descriptions-item label="巡检员电话">{{road.inspectorPhone}}</el-descriptions-item>
            </el-descriptions>
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