<template>
    <div>
        <el-row :gutter="12">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/Car' }">车辆信息</el-breadcrumb-item>
                    <el-breadcrumb-item>车辆订单信息</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>


        <el-row>
            <el-card shadow="always">
                <el-row>
                    <el-form :inline="true">

                        <el-form-item  prop="">
                            <el-select v-model="status">
                                <el-option label="已缴费" :value="2"></el-option>
                                <el-option label="待缴费" :value="1"></el-option>
                                <el-option label="退款中" :value="3"></el-option>
                                <el-option label="已退款" :value="4"></el-option>
                                <el-option label="超时未支付" :value="5"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="find">查询</el-button>
                        </el-form-item>

                        <el-form-item  prop="comDate">
                            <div class="block">
                                <span class="demonstration"></span>
                                <el-date-picker
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        v-model="value1"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>


                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="getTime">查询时间</el-button>
                            <el-button type="primary" icon="el-icon-search" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table :data="CarOrderList" border stripe>
                    <el-table-column label="车牌号码" prop="carNumber"></el-table-column>
                    <el-table-column label="订单编号" prop="orderNumber"></el-table-column>
                    <el-table-column label="提交时间" prop="createTime"></el-table-column>
                    <el-table-column label="订单金额" prop="orderAmount"></el-table-column>
                    <el-table-column label="订单状态" prop="status">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status==1" type="danger">待缴费</el-tag>
                            <el-tag v-if="scope.row.status==2" type="primary">已缴费</el-tag>
                            <el-tag v-if="scope.row.status==3" type="danger">退款中</el-tag>
                            <el-tag v-if="scope.row.status==4" type="primary">已退款</el-tag>
                            <el-tag v-if="scope.row.status==5" type="danger">超时未支付</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付方式" prop="payType">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.payType==1" type="primary">支付宝付款</el-tag>
                            <el-tag v-if="scope.row.payType==0" type="success">微信支付</el-tag>
                            <el-tag v-if="scope.row.payType==2" type="success">现金支付</el-tag>
                            <el-tag v-if="scope.row.payType==null" type="danger">未知</el-tag>
                        </template>
                    </el-table-column>
                </el-table>

                <!--                 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNumber"
                        :page-sizes="[5, 6, 9, 12]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </el-card>
        </el-row>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageNumber: 1,//自定义默认显示第1页
                pageSize: 5,
                total: 0,
                key:'',
                CarOrderList: [],//表单data的集合
                AllList:[],//存后端拿到的值的集合
                orderNumber:'',
                status:'',
                comDate:'',
                value1: [],
                date:[],
                orderNum:[],
                listByTime:[],

            }
        },
        methods: {
            getTime: function () {
                console.log(this.value1);
                // 获取起始日期
                const startDate = this.value1[0];
                const endDate = this.value1[1];

                console.log(startDate);
                console.log(endDate);

                this.$axios.get("/car/getTime", {
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                }).then(resp => {
                    console.log("{}", resp);
                    this.orderNum = resp.data
                    this.CarOrderList.forEach(e=>{
                        this.orderNum.forEach(order=>{
                            if (order===e.orderNumber){
                                this.listByTime.push(e);
                            }
                        })
                    })
                    this.CarOrderList=this.listByTime;

                    // 处理响应结果
                }).catch(error => {
                    // 处理错误
                });
            },
            reset(){
                this.orderNumber='';
                this.status='';
                this.comDate='';
                this.CarOrderList=this.AllList;
                this.value1='';

            },
            find(){
                if (this.status===null ){
                    return;
                }if (this.status==='') {
                    return;
                }else{
                    const statusValue = this.status;
                    console.log("{}",statusValue)
                    //每次都将遍历AllList的值，将不会受到变化的影响，将符合的数据放进filteredOrders
                    const filteredOrders = this.AllList.filter(order =>order.status === statusValue);
                    this.total = filteredOrders.length;
                    console.log("{}",filteredOrders);
                    //将filteredOrders传输给表单data
                    this.CarOrderList=filteredOrders;
                    this.status='';
                }



            },
            //获取车辆页面传送的车牌号
            getCarOrderList(){
                const carNumber = this.$route.query.carNumber;
                this.$axios.get("/car/carOrderList",{
                    params:{
                        pageSize: this.pageSize,
                        pageNum : this.pageNumber,
                        carNumber:carNumber
                    }
                }).then(resp=>{
                    console.log(resp)
                    this.AllList=resp.data.list;
                    this.total=resp.data.total;
                    this.CarOrderList=this.AllList
                })

            },

            //分页
            handleCurrentChange(val) {
                this.pageNumber = val;
                this.getCarOrderList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getCarOrderList();
            },


        },
        created() {
            this.getCarOrderList();
        }
    }
</script>

<style scoped>

</style>