<template>
    <div>
        <el-row :gutter="24" style="margin-bottom: 20px">

            <el-card shadow="always">
                <el-col :span="12">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="info" @click="replacement">刷新</el-button>
                    <el-button type="info">返回</el-button>
                </el-col>
            </el-card>
        </el-row>

        <!--   基础信息     -->
        <el-row style="font-weight: bold; margin: 30px 40px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 基础信息
        </el-row>
        <el-row style="width: 90%;margin: auto">
            <el-col :span="3" style="background: #f2f2f2">
                <div class="demo-basic--circle">
                    <div class="block" style="padding: 5px">
                        <el-avatar :size="142" :src="user.url"></el-avatar>
                    </div>
                </div>
            </el-col>
            <el-col :span="21">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="id"><span style="line-height: 2.5;">{{user.id}}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{user.phone}}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag
                                :type="user.vx === 1 ? 'success' : 'primary'"
                                disable-transitions>{{user.vx == 1 ? "已绑定" : "未绑定"}}
                        </el-tag>
                    </el-descriptions-item>                    <el-descriptions-item label="状态">
                        <el-tag
                                :type="user.state === 1 ? 'success' : 'primary'"
                                disable-transitions>{{user.state == 1 ? "正常" : "禁用"}}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="注册时间">{{user.createTime}}</el-descriptions-item>
                    <el-descriptions-item label="最近登录时间">{{user.createTime}}</el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>

        <!--   账户信息     -->
        <el-row style="font-weight: bold; margin: 30px 40px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 账户信息
        </el-row>
        <el-descriptions style="width: 70%;margin: 45px 0px 30px 80px" direction="vertical" :column="5" border>
            <el-descriptions-item label="车辆绑定数">{{this.user.carNum}}</el-descriptions-item>
            <el-descriptions-item label="订单数量">{{this.user.orderNum}}</el-descriptions-item>
            <el-descriptions-item label="消费金额">{{this.accountVO.expenseMoney}}</el-descriptions-item>
            <el-descriptions-item label="未交费订单">{{this.user.notOrderNum}}</el-descriptions-item>
            <el-descriptions-item label="待缴费金额">{{this.accountVO.notExpenseMoney}}</el-descriptions-item>
        </el-descriptions>

        <!--   车辆情况     -->
        <el-row style="font-weight: bold; margin: 30px 40px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 车辆情况
        </el-row>
        <el-row style="width: 90%;margin: auto">
            <el-card shadow="always">
                <el-form :inline="true" :model="carParam">
                    <el-form-item>
                        <el-input v-model="carParam.carNumber" placeholder="车牌号码"></el-input>
                    </el-form-item>


<!--                    <el-form-item>-->
<!--                        <el-date-picker-->
<!--                                v-model="carParam.vx"-->
<!--                                type="datetimerange"-->
<!--                                start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期"-->
<!--                                value-format="yyyy-MM-dd HH:mm:ss">-->
<!--                        </el-date-picker>-->
<!--                    </el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="carConditionPage()">查询</el-button>
                        <el-button @click="carClear()" type="info" plain icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-row>
                    <el-table
                            ref="multipleTable"
                            :data="carData"
                            tooltip-effect="dark"
                            style="text-align: center;font-size: 18px">

                        <el-table-column
                                prop="carNumber"
                                label="车牌号码">
                        </el-table-column>

                        <el-table-column
                                prop="carType"
                                label="车牌类型">
                        </el-table-column>
                        <el-table-column
                                prop="orderNum"
                                label="订单数量">
                        </el-table-column>
                        <el-table-column
                                prop="notPayOrder"
                                label="待缴费订单">
                        </el-table-column>
                        <el-table-column
                                prop="expenseMoney"
                                label="消费金额">
                        </el-table-column>
                        <el-table-column
                                prop="notExpenseMoney"
                                label="待缴费金额">
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top: 15px"
                                   background
                                   @size-change="carHandleSizeChange"
                                   @current-change="carHandleCurrentChange"
                                   :current-page="carPageNum"
                                   :page-sizes="[3, 5, 10, 20]"
                                   :page-size="carPageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="carTotal">
                    </el-pagination>
                </el-row>
            </el-card>
        </el-row>

        <!--   订单记录     -->
        <el-row style="font-weight: bold;margin: 30px 40px 30px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 订单记录
        </el-row>
        <el-row style="width: 90%;margin: auto">
            <el-card shadow="always">
                <el-form :inline="true" :model="orderParam">
                    <el-form-item>
                        <el-input v-model="orderParam.orderNumber" placeholder="订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="orderParam.carNumber" placeholder="车牌号码"></el-input>
                    </el-form-item>
<!--                    <el-form-item>-->
<!--                        <el-date-picker-->
<!--                                v-model="param.timeHorizon"-->
<!--                                type="datetimerange"-->
<!--                                start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期"-->
<!--                                value-format="yyyy-MM-dd HH:mm:ss">-->
<!--                        </el-date-picker>-->
<!--                    </el-form-item>-->
                    <el-form-item>
                        <el-select v-model="orderParam.status" placeholder="状态">
                            <el-option
                                    v-for="o  in orderState"
                                    :key="o.id"
                                    :label="o.state"
                                    :value="o.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="orderRecordPage">查询</el-button>
                        <el-button @click="orderClear()" type="info" plain icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-row>
                    <el-table
                            :data="orderData"
                            tooltip-effect="dark"
                            style="text-align: center;font-size: 18px">

                        <el-table-column
                                prop="orderNumber"
                                label="订单编号">
                        </el-table-column>

                        <el-table-column
                                prop="updateTime"
                                label="提交时间"
                                width="250">
                        </el-table-column>
                        <el-table-column
                                prop="carNumber"
                                label="车牌号码">
                        </el-table-column>
                        <el-table-column
                                prop="orderAmount"
                                label="订单金额">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="订单状态">
                            <template slot-scope="scope">
                                <el-tag
                                        :type="scope.row.status === 2 ? 'success': (scope.row.status == 4 ? 'danger' : 'primary' )"
                                        disable-transitions>{{scope.row.status == 2 ? "已支付": (scope.row.status == 4 ?
                                    "已退款" : "进行中" )}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="payType"
                                label="支付方式">
                            <template slot-scope="scope">
                                <el-tag
                                        :type="scope.row.payType === 0 ? 'primary' : 'success'"
                                        disable-transitions>{{scope.row.payType == 0 ? "支付宝支付" : "微信支付"}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <el-button
                                    type="primary" icon="el-icon-view" plain
                                    @click="handleView(scope.row)">查看详情
                            </el-button>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top: 15px"
                                   background
                                   @size-change="orderHandleSizeChange"
                                   @current-change="orderHandleCurrentChange"
                                   :current-page="orderPageNum"
                                   :page-sizes="[3, 5, 10, 20]"
                                   :page-size="orderPageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="orderTotal">
                    </el-pagination>
                </el-row>
            </el-card>
        </el-row>
    </div>

</template>

<style scoped>
    .el-breadcrumb {
        font-size: 22px;
        line-height: 2;
    }

    .el-descriptions {
        font-size: 16px;
    }

    .el-descriptions-item__label.is-bordered-label {
        background: #f2f2f2;
    }
</style>

<script>
    import userDetails from "@/api/userDetails";

    export default {
        data() {
            return {
                user: {},
                //订单记录绑定
                orderParam:{},
                orderData: [],
                orderPageNum: 1,
                orderPageSize: 5,
                orderTotal: 0,
                //车辆情况绑定
                carParam: {},
                carData: [],
                carPageNum: 1,
                carPageSize: 5,
                carTotal: 0,
                //账户信息表单绑定
                accountVO: {},

                orderState: [
                    {id: 2, state: "已支付"},
                    {id: 4, state: "已退款"},
                    {id: 6, state: "进行中"},
                ],
            }
        },
        methods: {
            //账户信息
            accountPage(){
                userDetails.accountPage(this.user.id).then(res=>{
                    this.accountVO = res.data;
                })
            },

            //车辆情况分页
            carConditionPage(){
                userDetails.carConditionPage(this.carPageNum,this.carPageSize,this.user.id,this.carParam).then(res=>{
                    console.log("-----"+res)
                    this.carData = res.data.records;
                    this.carTotal = res.data.total;
                })
            },
            //车辆情况查询
            carSelect(){

            },
            //车辆情况重置
            carClear(){
                this.carParam = {};
                this.carConditionPage();
            },
            //车辆情况分页
            carHandleSizeChange(val) {
                this.carPageSize = val;
                this.carConditionPage();

            },
            carHandleCurrentChange(val) {
                this.carPageNum = val;
                this.carConditionPage();

            },


            //订单记录分页
            orderRecordPage(){
                userDetails.orderRecordPage(this.orderPageNum,this.orderPageSize,this.user.id,this.orderParam).then(res=>{
                    console.log("-----"+res)
                    this.orderData = res.data.records;
                    this.orderTotal = res.data.total;
                })
            },

            //订单记录查询
            orderSelect(){

            },
            //订单记录重置
            orderClear(){
                this.orderParam = {};
                this.orderRecordPage();
            },
            //订单记录分页
            orderHandleSizeChange(val){
                this.orderPageSize = val
                this.orderRecordPage();
            },
            orderHandleCurrentChange(val){
                this.orderPageNum = val
                this.orderRecordPage();

            },
            handleView(row){
                this.$route.push({
                    name:'Order',
                    params:{data:row}
                })

            },
            //刷新
            replacement() {

            },

        },
        created() {
            this.user = this.$route.params.data;
            this.accountPage();
            this.carConditionPage();
            this.orderRecordPage();

        }
    }
</script>