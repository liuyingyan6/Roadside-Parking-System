<template>
    <div>

        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>财务管理</el-breadcrumb-item>
            <el-breadcrumb-item>资金流水</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div class="amount-container">
                <div class="amount-box">
                    <span class="amount-title">总入账</span>
                    <span class="amount-value">{{ totalAmount }}</span>
                </div>
                <div class="amount-box">
                    <span class="amount-title">总出账</span>
                    <span class="amount-value">{{ refundAmount }}</span>
                </div>
            </div>
        </el-card>

        <el-card>


            <!--搜索框&添加按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-date-picker
                            v-model="choiceTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                    <el-button type="primary" @click="reloadList()">查询</el-button>
                </el-col>
                <el-col :span="4">
                </el-col>
            </el-row>

            <!--信息表单-->
            <el-table :data="cashflowList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="业务类型">路边停车订单缴费</el-table-column>
                <el-table-column label="支付订单号" prop="orderNumber"></el-table-column>
                <el-table-column label="支付渠道" prop="payType"></el-table-column>
                <el-table-column label="资金类型" prop="status"></el-table-column>
                <el-table-column label="操作金额" prop="orderAmount"></el-table-column>
                <el-table-column label="操作时间" prop="createTime"></el-table-column>
            </el-table>

            <!--分页插件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[3, 5 , 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>

        </el-card>

    </div>
</template>
<script>
    import axios from 'axios';
    import moment from 'moment';
    import echarts from 'echarts'
    export default {
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                choiceTime: [new Date(2023, 8-1, 1, 9, 10),
                             new Date(2023, 9-1, 9, 9, 10)],
                cashflowList: [], // 表单数据
                totalAmount: 0,
                refundAmount: 0,
                pageNum: 1,
                pageSize: 3,
                total: 0

            };
        },
        methods: {
            reloadList() {
                const startTime = moment(this.choiceTime[0]).format('YYYY-MM-DD HH:mm:ss');
                const endTime = moment(this.choiceTime[1]).format('YYYY-MM-DD HH:mm:ss');
                axios.get("/order/countOrder", {
                    params: {
                        startTime: startTime,
                        endTime: endTime,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then(res => {
                    console.log(res.data.totalAmount)
                    console.log(res.data.refundAmount)
                    console.log(res)
                    this.cashflowList = res.data.orderList
                    this.totalAmount = res.data.totalAmount
                    this.refundAmount = res.data.refundAmount
                    this.total = res.data.total
                })
            },
            handleSizeChange(newSize) {
                this.pageSize = newSize;
                this.reloadList();
            },
            handleCurrentChange(newPage) {
                this.pageNum = newPage;
                this.reloadList();
            }
        },
        created() {
            this.reloadList();
        }
    };
</script>
<style lang="less" scoped>
    .amount-container {
        display: flex;
        justify-content: space-between;
    }

    .amount-box {
        background-color: #f0f0f0;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        flex: 1;
        margin: 10px;
    }

    .amount-title {
        font-weight: bold;
    }

    .amount-value {
        font-size: 24px;
    }
</style>