<template>
    <div>
        <!--面包屑-->
        <el-row :gutter="12">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计管理</el-breadcrumb-item>
                    <el-breadcrumb-item>支付统计</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>

        <!--时间选择-->
        <el-form :inline="true">
            <el-row :gutter="20">
                <el-form-item label="时间选择">
                    <el-date-picker
                            v-model="choiceTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="allDate">查询</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="resetKeyword">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>

        <!--统计金额-->
        <el-row>

            <el-col :span="4">
                <el-card shadow="always">
                    <div>微信支付（单）</div>
                    <div>{{this.alipayCount}}</div>
                </el-card>
            </el-col>

            <el-col :span="4">
                <el-card shadow="always">
                    <div>支付宝支付（单）</div>
                    <div>{{this.wechatCount}}</div>
                </el-card>
            </el-col>

            <el-col :span="4">
                <el-card shadow="always">
                    <div>现金支付（单）</div>
                    <div>{{this.cashCount}}</div>
                </el-card>
            </el-col>


            <el-col :span="4">
                <el-card shadow="always">
                    <div>微信支付（元）</div>
                    <div>{{this.alipayAmount}}</div>
                </el-card>
            </el-col>

            <el-col :span="4">
                <el-card shadow="always">
                    <div>支付宝支付（元）</div>
                    <div>{{this.wechatAmount}}</div>
                </el-card>
            </el-col>

            <el-col :span="4">
                <el-card shadow="always">
                    <div>现金支付（元）</div>
                    <div>{{this.cashAmount}}</div>
                </el-card>
            </el-col>

        </el-row>

        <!--饼形图-->
        <el-row>
            <el-col :span="12">
                <el-card shadow="always">
                    <div id="pieChart1" style="width: 100%; height: 300px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="always">
                    <div id="pieChart2" style="width: 100%; height: 300px;"></div>
                </el-card>
            </el-col>
        </el-row>

        <!--表单-->
        <el-row>
            <div class="table-container">
                <el-table :data="tableData" tooltip-effect="dark"
                          style="width: 100%; text-align: center; font-size: 18px">
                    <el-table-column prop="orderDate" label="日期"></el-table-column>
                    <el-table-column prop="alipayCountDate" label="支付宝支付数量"></el-table-column>
                    <el-table-column prop="wechatCountDate" label="微信支付数量"></el-table-column>
                    <el-table-column prop="cashCountDate" label="现金支付数量"></el-table-column>
                    <el-table-column prop="alipayAmountDate" label="支付宝收款金额"></el-table-column>
                    <el-table-column prop="wechatAmountDate" label="微信收款金额"></el-table-column>
                    <el-table-column prop="cashAmountDate" label="现金收款金额"></el-table-column>
                </el-table>


            <!--分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[3, 5, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>
            </div>
        </el-row>

    </div>
</template>

<script>
    import axios from 'axios';
    import * as echarts from 'echarts';
    import moment from 'moment';

    export default {
        name: "Payment",
        data() {
            return {

                pieChartData1: [],
                pieChartData2: [],

                pageNum: 1,
                pageSize: 5,
                total: 0,
                formLabelWidth: '120px',
                // 默认时间选择
                choiceTime: [new Date(2023, 8 - 1, 1, 9, 10),
                    new Date(2023, 9 - 1, 9, 9, 10)],

                // 快捷时间选择
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
                // 表单数据
                tableData: [],
                alipayCount: 0,
                wechatCount: 0,
                cashCount: 0,
                alipayAmount: 0,
                wechatAmount: 0,
                cashAmount: 0
            }
        },

        methods: {

            allDate() {
                this.findPayDate()
                this.findCountDate()
            },

            findCountDate() {
                const startTime = moment(this.choiceTime[0]).format('YYYY-MM-DD HH:mm:ss');
                const endTime = moment(this.choiceTime[1]).format('YYYY-MM-DD HH:mm:ss');
                axios.get("/order/payCount", {
                    params: {
                        startTime: startTime,
                        endTime: endTime
                    }
                }).then(res => {
                    console.log(res)
                    this.pieChartData1 = [res.data.alipayCount, res.data.wechatCount, res.data.cashCount];
                    this.pieChartData2 = [res.data.alipayAmount, res.data.wechatAmount, res.data.cashAmount];
                    this.alipayCount = res.data.alipayCount
                    this.wechatCount = res.data.wechatCount
                    this.cashCount = res.data.cashCount
                    this.alipayAmount = res.data.alipayAmount
                    this.wechatAmount = res.data.wechatAmount
                    this.cashAmount = res.data.cashAmount
                    this.drawPieCharts(); // 调用
                })
            },

            findPayDate() {
                const startTime = moment(this.choiceTime[0]).format('YYYY-MM-DD HH:mm:ss');
                const endTime = moment(this.choiceTime[1]).format('YYYY-MM-DD HH:mm:ss');
                axios.get("/order/payDate", {
                    params: {
                        startTime: startTime,
                        endTime: endTime,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then(res => {
                    // console.log(res)
                    this.tableData = res.data.records;
                    this.total = res.data.total
                })
            },

            drawPieCharts() {
                var chart1 = echarts.init(document.getElementById('pieChart1'));
                var option1 = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}：{c}个 ({d}%)', // 添加提示框内容格式化
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [{
                        type: 'pie',
                        data: [
                            {name: '支付宝', value: this.pieChartData1[0]},
                            {name: '微信支付', value: this.pieChartData1[1]},
                            {name: '现金支付', value: this.pieChartData1[2]},
                        ],
                    }],
                };
                chart1.setOption(option1);

                var chart2 = echarts.init(document.getElementById('pieChart2'));
                var option2 = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}：{c}元 ({d}%)', // 添加提示框内容格式化
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [{
                        type: 'pie',
                        data: [
                            {name: '支付宝金额', value: this.pieChartData2[0]},
                            {name: '微信金额', value: this.pieChartData2[1]},
                            {name: '现金金额', value: this.pieChartData2[2]},
                        ],
                    }],
                };
                chart2.setOption(option2);
            },

            handleSizeChange(val) {
                this.pageSize = val;
                this.findPayDate();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.findPayDate()
            },

            resetKeyword() {
                this.choiceTime = ['', ''];
            }
        },

        mounted() {
            this.drawPieCharts();
        },

        created() {
            this.findPayDate();
            this.findCountDate();
        }
    }
</script>

<style scoped lang="less">
    .table-container {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }

    .el-table {
        width: 100%;
        text-align: center;
        font-size: 18px;
    }
</style>