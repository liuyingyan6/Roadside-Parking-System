<script>
    import axios from 'axios';
    import * as echarts from 'echarts';

    export default {
        name: "Revenue",
        data() {
            return {
                pageNum: 1,
                pageSize: 5,
                total: 0,
                formLabelWidth: '120px',
                roadId: '',
                roads: [],
                dateTime: ['', ''],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '本周',
                            onClick(picker) {
                                const now = new Date();
                                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
                                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - (now.getDay() === 0 ? 7 : now.getDay())));
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '本月',
                            onClick(picker) {
                                const now = new Date();
                                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '上月',
                            onClick(picker) {
                                const now = new Date();
                                const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                const end = new Date(now.getFullYear(), now.getMonth(), 0);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                orderStatus: '营收',
                tableData: [],
                lineChartData: {
                    dates: [],
                    orderCounts: [],
                    revenues: [],
                    refundOrderCounts: [],
                    refundAmounts: [],
                    abnormalOrderCounts: [],
                    abnormalAmounts: []
                },
                conversionData: {},
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.pageNum = val;
            },
            getRevenueInfo() {
                if (this.dateTime === null) {
                    this.dateTime = ['', ''];
                }
                axios.get("/order/getRevenueInfoByKeyword", {
                    params: {
                        roadId: this.roadId,
                        startDate: this.dateTime[0],
                        endDate: this.dateTime[1]
                    }
                }).then(resp => {
                    this.tableData = resp.data;
                    this.lineChartData.dates = [];
                    this.lineChartData.orderCounts = [];
                    this.lineChartData.revenues = [];
                    this.lineChartData.refundOrderCounts = [];
                    this.lineChartData.refundAmounts = [];
                    this.lineChartData.abnormalOrderCounts = [];
                    this.lineChartData.abnormalAmounts = [];
                    this.tableData.forEach((data) => {
                        this.lineChartData.dates.push(data.date);
                        this.lineChartData.orderCounts.push(data.orderCount);
                        this.lineChartData.revenues.push(data.revenue);
                        this.lineChartData.refundOrderCounts.push(data.refundOrderCount);
                        this.lineChartData.refundAmounts.push(data.refundAmount);
                        this.lineChartData.abnormalOrderCounts.push(data.abnormalOrderCount);
                        this.lineChartData.abnormalAmounts.push(data.abnormalAmount);
                    })
                    this.renderLineChart();
                }).catch(error => {
                    console.log(error);
                })
            },
            getRoads() {
                axios.get("/road/list")
                    .then(resp => {
                        this.roads = resp.data;
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            resetKeyword() {
                this.roadId = '';
                this.dateTime = ['', ''];
            },
            renderLineChart() {
                let orderData = 0;
                let amountData = 0;
                if (this.orderStatus == '营收') {
                    orderData = this.lineChartData.orderCounts.reverse();
                    amountData = this.lineChartData.revenues.reverse();
                }
                if (this.orderStatus == '退款') {
                    orderData = this.lineChartData.refundOrderCounts.reverse();
                    amountData = this.lineChartData.refundAmounts.reverse();
                }
                if (this.orderStatus == '异常') {
                    orderData = this.lineChartData.abnormalOrderCounts.reverse();
                    amountData = this.lineChartData.abnormalAmounts.reverse();
                }
                // 基于准备好的dom，初始化echarts实例
                let lineChart = echarts.init(document.getElementById('lineChart'));

                // 指定图表的配置项和数据
                let lineChartOption = {
                    title: {
                        text: '数据统计图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['订单数量', '金额']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lineChartData.dates.reverse() // 将日期反向显示
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '订单数量',
                            type: 'line',
                            stack: 'Total',
                            data: orderData
                        },
                        {
                            name: '金额',
                            type: 'line',
                            stack: 'Total',
                            data: amountData
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                lineChart.setOption(lineChartOption);
            },
            renderPieChart() {
                // 基于准备好的dom，初始化echarts实例
                let pieChart = echarts.init(document.getElementById('pieChart'));

                // 指定图表的配置项和数据
                let pieChartOption = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                {value: this.conversionData.totalOrderCount, name: '全部订单'},
                                {value: this.conversionData.finishedParkingOrderCount, name: '行程结束订单'},
                                {value: this.conversionData.validOrderCount, name: '有效订单（需支付）'},
                                {value: this.conversionData.paidOrderCount, name: '已支付订单'},
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                pieChart.setOption(pieChartOption);
            },
            renderFunnelChart() {
                // 基于准备好的dom，初始化echarts实例
                let funnelChart = echarts.init(document.getElementById('funnelChart'));

                // 指定图表的配置项和数据
                let funnelChartOption = {
                    title: {
                        text: '转化漏斗',
                        left: 'left',
                        top: 'bottom'
                    },
                    toolbox: {
                        orient: 'vertical',
                        top: 'center',
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: 'Funnel',
                            type: 'funnel',
                            width: '50%',
                            height: '60%',
                            left: 'center',
                            top: 'center',
                            label: {
                                show: true,
                                position: 'inside',
                                formatter: function(params) {
                                    let percentage = (params.value / params.data.totalOrderCount * 100).toFixed(2);
                                    return `{c|${percentage}%}`;
                                },
                                rich: {
                                    c: {
                                        color: '#333',
                                        fontSize: 14,
                                        lineHeight: 20
                                    }
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: [
                                {value: this.conversionData.totalOrderCount, name: '全部订单', totalOrderCount: this.conversionData.totalOrderCount},
                                {value: this.conversionData.finishedParkingOrderCount, name: '行程结束订单', totalOrderCount: this.conversionData.totalOrderCount},
                                {value: this.conversionData.validOrderCount, name: '有效订单（需支付）', totalOrderCount: this.conversionData.totalOrderCount},
                                {value: this.conversionData.paidOrderCount, name: '已支付订单', totalOrderCount: this.conversionData.totalOrderCount},
                            ]
                        },
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                funnelChart.setOption(funnelChartOption);
            },
            getSum(arr) {
                return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            },
            getOrderConversionVO() {
                axios.get("/order/getOrderConversionVOByKeyword")
                    .then(resp => {
                        this.conversionData = resp.data;
                        this.renderPieChart();
                        this.renderFunnelChart();
                    }).catch(error => {
                    console.log(error);
                })
            }
        },
        created() {
            this.getRevenueInfo();
            this.getOrderConversionVO();
            this.getRoads();
        },
    }
</script>

<template>
    <div>
        <el-row :gutter="12">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计管理</el-breadcrumb-item>
                    <el-breadcrumb-item>营收统计</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row> <!--面包屑-->
        <el-row>
            <el-form :inline="true">
                <el-form-item label="路段选择" :label-width="formLabelWidth" prop="parkingId">
                    <el-select v-model="roadId" style="width: 300px">
                        <el-option v-for="road in roads" :label="road.name"
                                   :value="road.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间选择">
                    <el-date-picker
                            v-model="dateTime"
                            value-format="yyyy-MM-dd"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getRevenueInfo">查询</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="resetKeyword">重置</el-button>
                </el-form-item>
            </el-form>
        </el-row> <!--搜索-->
        <el-row>
            <el-col :span="4">
                <el-card shadow="always">
                    <div>订单数量（单）</div>
                    <div>{{getSum(this.lineChartData.orderCounts)}}</div>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card shadow="always">
                    <div>营收额（元）</div>
                    <div>{{getSum(this.lineChartData.revenues)}}</div>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card shadow="always">
                    <div>退款订单（单）</div>
                    <div>{{getSum(this.lineChartData.refundOrderCounts)}}</div>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card shadow="always">
                    <div>退款金额（单）</div>
                    <div>{{getSum(this.lineChartData.refundAmounts)}}</div>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card shadow="always">
                    <div>异常订单（单）</div>
                    <div>{{getSum(this.lineChartData.abnormalOrderCounts)}}</div>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card shadow="always">
                    <div>异常金额（单）</div>
                    <div>{{getSum(this.lineChartData.abnormalAmounts)}}</div>
                </el-card>
            </el-col>
        </el-row> <!--卡片展示订单&金额-->
        <el-row>
            <div style="margin-top: 20px">
                <el-radio-group v-model="orderStatus" size="medium" @change="renderLineChart">
                    <el-radio-button label="营收" value="营收"></el-radio-button>
                    <el-radio-button label="退款" value="退款"></el-radio-button>
                    <el-radio-button label="异常" value="异常"></el-radio-button>
                </el-radio-group>
            </div>
            <div id="lineChart" style="width: 100%;height:400px;"></div>
        </el-row> <!--数据统计图：折线图-->
        <el-row :gutter="20">
            <el-col :span="12">
                <div>
                    <el-card shadow="always" style="width: 80%; height: 100px;">
                        <el-row>
                            <el-col :span="12">
                                <div>有效订单占比</div>
                                <div>{{(this.conversionData.finishedParkingOrderCount/this.conversionData.totalOrderCount* 100).toFixed(2)}}</div>
                            </el-col>
                            <el-col :span="12">
                                <div>订单支付率</div>
                              <div>{{ (this.conversionData.paidOrderCount / this.conversionData.validOrderCount * 100).toFixed(2) }}%</div>
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
                <div id="pieChart" style="width: 600px;height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="funnelChart" style="width: 600px;height:500px;"></div>
            </el-col>
        </el-row> <!--订单转化率：饼状图&漏斗图-->
        <el-row>
            <el-table
                    :data="tableData.slice((pageNum-1)*pageSize,pageNum*pageSize)"
                    tooltip-effect="dark"
                    style="width: 100%; text-align: center; font-size: 18px">
                <el-table-column
                        prop="date"
                        label="日期"
                        width="120">
                </el-table-column> <!-- 日期 -->
                <el-table-column
                        prop="orderCount"
                        label="订单数量"
                        width="120">
                </el-table-column> <!-- 订单数量 -->
                <el-table-column
                        prop="revenue"
                        label="营收额"
                        width="120">
                </el-table-column> <!-- 营收额 -->
                <el-table-column
                        prop="refundOrderCount"
                        label="退款订单"
                        width="120">
                </el-table-column> <!-- 退款订单-->
                <el-table-column
                        prop="refundAmount"
                        label="退款金额"
                        width="120">
                </el-table-column> <!-- 退款金额-->
                <el-table-column
                        prop="userIncreaseCount"
                        label="用户增长"
                        width="120">
                </el-table-column> <!-- 用户增长-->
            </el-table> <!--表格展示订单信息-->
            <el-pagination style="margin-top: 15px"
                           background
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="pageNum"
                           :page-sizes="[3, 5, 10, 20]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="tableData.length">
            </el-pagination> <!--分页组件-->
        </el-row>
    </div>
</template>

<style scoped lang="less">

</style>