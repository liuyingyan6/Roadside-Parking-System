<template>
    <div>
        <el-row :gutter="12">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计管理</el-breadcrumb-item>
                    <el-breadcrumb-item>路段统计</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>


        <el-row>
            <el-card shadow="always">
<!--                查询-->
                <el-row>
                    <el-form :inline="true">
                        <el-form-item label="路段选择">
                            <el-select v-model="selectRoad" placeholder="请选择路段">
                                <el-option v-for="(road,index) in roadList" :key="index"
                                           :label="road.roadName" :value="road.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="getRoadById">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table :data="orderList" border stripe>
                    <el-table-column label="日期" prop="orderDate"></el-table-column>
                    <el-table-column label="订单数量" prop="orderCount"></el-table-column>
                    <el-table-column label="营收额" prop="payAmount">
                        <template slot-scope="scope">
                            <span v-if="scope.row.payAmount">{{ scope.row.payAmount }}</span>
                            <span v-else style="color: #afadad">暂无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="退款订单" prop="refundCount"></el-table-column>
                    <el-table-column label="退款金额" prop="refundAmount">
                        <template slot-scope="scope">
                            <span v-if="scope.row.refundAmount">{{ scope.row.refundAmount }}</span>
                            <span v-else style="color: #afadad">暂无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="异常订单" prop="abnormalCount"></el-table-column>
                    <el-table-column label="异常金额" prop="abnormalAmount">
                        <template slot-scope="scope">
                            <span v-if="scope.row.abnormalAmount">{{ scope.row.abnormalAmount }}</span>
                            <span v-else style="color: #afadad">暂无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单支付率" prop="paymenRate"></el-table-column>
                </el-table>

                <!--                 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNumber"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </el-card>
        </el-row>


    </div>
</template>

<script>
    import axios from 'axios';


    export default {
        name: "RoadStatistics",
        data() {
            return {
                pageNumber: 1,//自定义默认显示第1页
                pageSize: 5, //自定义默认每页显示3条数据
                total: 0,
                orderList:[],
                roadList:[],
                selectRoad:'',


            }
        },
        methods: {

            reset(){
                this.selectRoad='';
                this.getRoadOrderList();

            },
            findList(){

            },
            //分页
            handleCurrentChange(val) {
                this.pageNumber = val;
                this.getRoadOrderList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getRoadOrderList();
            },

            getRoadOrderList() {
                axios.get("/order/getRoadOrderList", {
                    params: {
                        pageSize: this.pageSize,
                        pageNum: this.pageNumber,
                        key: this.key
                    }
                }).then(resp => {
                    console.log(resp)
                    this.total = resp.data.total;
                    resp.data.list.forEach(e=>{
                        const orderCount=e.orderCount;
                        const payCount=e.payCount;

                        const percentage = (payCount / orderCount) * 100;
                        const formattedPercentage = percentage.toFixed(2) + '%';
                        e.paymenRate=formattedPercentage;

                    })
                    this.orderList=resp.data.list;


                })

            },
            getAllRoad(){
                axios.get("/road/getAll")
                    .then(resp => {
                    console.log(resp);
                    this.roadList=resp.data;

                })

            },
            getRoadById(){
                console.log(this.selectRoad);
                axios.get("/order/getRoadOrderList", {
                    params: {
                        pageSize: this.pageSize,
                        pageNum: this.pageNumber,
                        roadId: this.selectRoad
                    }
                }).then(resp => {
                    console.log(resp)
                    this.total = resp.data.total;
                    resp.data.list.forEach(e=>{
                        const orderCount=e.orderCount;
                        const payCount=e.payCount;

                        const percentage = (payCount / orderCount) * 100;
                        const formattedPercentage = percentage.toFixed(2) + '%';
                        e.paymenRate=formattedPercentage;

                    })
                    this.orderList=resp.data.list;

                })
            }


        },
        created() {
            this.getRoadOrderList();
            this.getAllRoad();
        }
    }
</script>

<style scoped>

</style>