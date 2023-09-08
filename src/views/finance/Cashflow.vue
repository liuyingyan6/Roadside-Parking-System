<template>
    <div>

        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>财务管理</el-breadcrumb-item>
            <el-breadcrumb-item>资金流水</el-breadcrumb-item>
        </el-breadcrumb>


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
                    <el-button type="primary" @click="addDialogVisible=true">查询</el-button>
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
                    :page-sizes="[5, 10 , 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>

        </el-card>

    </div>
</template>
<script>
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
                choiceTime: [new Date(2000, 10, 10, 10, 10),
                             new Date(2000, 10, 11, 10, 10)],
                pageNum: 1,
                pageSize: 5,
                total: 0,
                cashflowList: [], // 表单数据

            };
        },
        methods: {
        },
        created() {
            this.searchRole();
        }
    };
</script>
<style lang="less" scoped>
</style>