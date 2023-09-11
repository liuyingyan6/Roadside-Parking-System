<template>
    <div>
        <el-row :gutter="12" style="margin-bottom: 20px">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
                    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>


        <br>
        <br>

        <!--  账户信息  -->
        <h1>账户信息</h1>
        <el-row>
            <el-card shadow="always">
                <!-- 车辆情况表单 -->
                <el-table :data="userTableData" border stripe >
                    <!-- 复选框 -->
                    <el-table-column label="车辆绑定数量" prop="carNum" width="200"> </el-table-column>
                    <el-table-column label="订单数量 " prop="orderNum" width="200"></el-table-column>
                    <el-table-column label="消费金额" prop="orderAmount" width="200"></el-table-column>
                    <el-table-column label="未交费订单" prop="notOrderNum" width="200"></el-table-column>
                    <el-table-column label="待缴费金额" prop="notPayAmount" width="200"></el-table-column>
                </el-table>
            </el-card>
        </el-row>

        <br>
        <br>

        <!--  车辆情况  -->
        <h1>车辆情况</h1>
        <el-row>
            <el-card shadow="always">
                <el-row>
                    <el-form :inline="true" :model="carParam" >
                        <el-form-item>
                            <el-input v-model="carParam.userName" placeholder="车牌号码"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-date-picker
                                    v-model="carParam.createTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="绑定日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>


                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="carFindPage">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" icon="el-icon-delete" @click="carClear">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 车辆情况表单 -->
                <el-table :data="carTableData" border stripe >
                    <!-- 复选框 -->
                    <el-table-column label="车牌号码" prop="carNumber" width="200"> </el-table-column>
                    <el-table-column label="车牌类型 " prop="carType" width="200"></el-table-column>
                    <el-table-column label="订单数量" prop="orderNum" width="200"></el-table-column>
                    <el-table-column label="待缴费订单" prop="notOrderNum" width="200"></el-table-column>
                    <el-table-column label="消费金额" prop="orderAmount" width="200"></el-table-column>
                    <el-table-column label="待缴费金额" prop="notPayAmount" width="200"></el-table-column>
                    <el-table-column label="绑定时间" prop="createTime" width="210"></el-table-column>
                </el-table>

                <!-- 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination style="margin-top: 15px"
                               background
                               @size-change="carHandleSizeChange"
                               @current-change="carHandleCurrentChange"
                               :current-page="carParam.pageNum"
                               :page-sizes="[3, 5, 10, 20]"
                               :page-size="carParam.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="carTableData.total">
                </el-pagination>
            </el-card>
        </el-row>

        <br>
        <br>

        <!--  订单记录  -->
        <h1>订单记录</h1>
        <el-row>

            <el-card shadow="always">

                <el-row>
                    <el-form :inline="true" :model="orderParam" >
                        <el-form-item>
                            <el-input v-model="orderParam.userName" placeholder="订单编号"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-input v-model="orderParam.phone" placeholder="车牌号码"></el-input>
                        </el-form-item>


                        <el-select v-model="orderParam.vx" placeholder="时间">
                            <el-option label="已绑定" value="1"></el-option>
                            <el-option label="未绑定" value="0"></el-option>
                        </el-select>




                        <el-select v-model="orderParam.state" placeholder="订单状态">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>


                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="orderFindPage">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" icon="el-icon-delete" @click="orderClear">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table :data="orderTableData" border stripe >
                    <el-table-column label="订单编号" prop="userName" width="200"> </el-table-column>
                    <el-table-column label="提交时间 " prop="phone" width="200"></el-table-column>
                    <el-table-column label="车牌号码" prop="carNum" width="200"></el-table-column>
                    <el-table-column label="订单金额" prop="orderNum" width="200"></el-table-column>
                    <el-table-column label="订单状态" prop="notOrderNum" width="200"></el-table-column>
                    <el-table-column label="支付方式" prop="notOrderNum" width="200"></el-table-column>
                    <el-table-column label="操作" width="380">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button
                                        type="primary" icon="el-icon-view" plain
                                        @click="orderHandleView(scope.$index,scope.row)">查看详情
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination style="margin-top: 15px"
                               background
                               @size-change="orderHandleSizeChange"
                               @current-change="orderHandleCurrentChange"
                               :current-page="orderParam.pageNum"
                               :page-sizes="[3, 5, 10, 20]"
                               :page-size="orderParam.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="orderTableData.total">
                </el-pagination>
            </el-card>
        </el-row>
    </div>
</template>
<script>

    import user from '@/api/user'
    import userDetails from '@/api/userDetails'

    export default {
        data() {
            return {

                userId:'',

                //订单记录分页查询提交的参数
                orderParam:{},
                //订单记录表单绑定
                orderTableData:{},

                //车辆情况分页查询提交的参数
                carParam: {},
                //车辆情况表单绑定
                carTableData:[],


                //账户信息表单绑定
                userTableData:[],

                pageNum: 1,
                pageSize: 5,
                state:[],
            }
        },
        methods: {
            //账户信息分页
            accountPage(){
                userDetails.accountPage(this.userId).then(res=>{
                    console.log("",res);
                    this.userTableData = res.data;

                })

            },
            //车辆情况查询按钮
            carFindPage(){
                console.log(this.carParam)
                userDetails.findPageCarCase(this.pageNum,this.pageSize,this.userId,this.carParam).then(res=>{
                    console.log("",res);
                    this.total = res.data.total;
                    this.carTableData = res.data.records;
                })

            },
            //车辆情况重置按钮
            carClear(){

            },

            //分页查询所有用户
            findPage() {
                user.findPage(this.pageNum,this.pageSize,this.param).then(res => {
                    console.log("", res);
                    this.total = res.data.total;
                    this.tableData = res.data.records;
                })
            },

            //禁用
            removeRoleById(row) {
                this.$confirm('是否真的禁用该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    user.removeRoleById(row).then(res=>{
                        console.log(res)
                        if (res.data == 0) {
                            this.$message.error("禁用成功");

                        } else {
                            this.$message.success("恢复成功");

                        }
                        this.findPage();// 刷新表单数据
                    })
                });
            },

            // 重置按钮
            clear(){
                this.param = {};
                this.findPage();
            },




            //查看详情跳转
            orderHandleView(index, row) {
                this.$router.push({path:`/order`});

            },
            //订单记录分页
            orderHandleSizeChange(val){

            },
            orderHandleCurrentChange(val){

            },
            //车辆情况分页
            carHandleSizeChange(val){


            },
            carHandleCurrentChange(val){

            },

            //分页
            handleSizeChange(val) {
                this.param.pageSize = val;
                this.findPage();
            },
            handleCurrentChange(val) {
                this.param.pageNum = val;
                this.findPage();
            },

        },
        created() {
            this.userId = this.$route.params.id
            this.carFindPage();
            this.accountPage();
        }
    };
</script>
<style lang="less" scoped>

</style>
