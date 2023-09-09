<template>
    <div>
        <el-row :gutter="12">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/inspectorFeedback' }">巡检员反馈</el-breadcrumb-item>
                    <el-breadcrumb-item>反馈详情</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>


        <el-row>
            <el-card shadow="always">
                <el-row>
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="success" class="align-right" @click="find">反馈处理</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table :data="CarOrderList" border stripe>
                    <el-table-column label="反馈单号" prop="carNumber"></el-table-column>
                    <el-table-column label="反馈巡检员" prop="orderNumber"></el-table-column>
                    <el-table-column label="地磁编号" prop="createTime"></el-table-column>
                    <el-table-column label="反馈内容" prop="orderAmount"></el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status==1" type="danger">待处理</el-tag>
                            <el-tag v-else type="success">已处理</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码" prop="orderAmount"></el-table-column>
                    <el-table-column label="所属泊位" prop="orderAmount"></el-table-column>
                    <el-table-column label="反馈图片" prop="orderAmount"></el-table-column>
                </el-table>

            </el-card>
        </el-row>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageNumber: 1,//自定义默认显示第1页
                pageSize: 5, //自定义默认每页显示3条数据
                total: 0,
                key:'',
                CarOrderList: [],//表单data的集合
                AllList:[],//存后端拿到的值的集合
                orderNumber:'',
                status:'',
                comDate:'',

            }
        },
        methods: {
            reset(){
                this.orderNumber='';
                this.status='';
                this.comDate='';
                this.CarOrderList=this.AllList;

            },
            find(){
                const statusValue = this.status;
                console.log("{}",statusValue)
                //每次都将遍历AllList的值，将不会受到变化的影响，将符合的数据放进filteredOrders
                const filteredOrders = this.AllList.filter(order =>order.status === statusValue);
                console.log("{}",filteredOrders);
                //将filteredOrders传输给表单data
                this.CarOrderList=filteredOrders;
                this.status='';


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


        },
        created() {
            this.getCarOrderList();
        }
    }
</script>

<style scoped>
    .align-right {
        margin-left: 1500px; /* 将左边距设为 auto，使按钮靠右对齐 */
    }

</style>