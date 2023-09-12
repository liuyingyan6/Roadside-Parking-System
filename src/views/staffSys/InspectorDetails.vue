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
        <el-row style="font-weight: bold; margin: 30px 40px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 基本信息
        </el-row>
        <el-row style="width: 90%;margin: auto">
            <el-col :span="3" style="background: #f2f2f2">
                <div class="demo-basic--circle">
                    <div class="block" style="padding: 20px">
                        <el-avatar :size="142" :src="inspector.url"></el-avatar>
                    </div>
                </div>
            </el-col>
            <el-col :span="21">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="巡检员名称"><span style="line-height: 2.5;">{{inspector.name}}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{inspector.phone}}</el-descriptions-item>
                    <el-descriptions-item label="管理路段">
                           <span style="line-height: 2.5" v-for="(road, index) in inspector.inspectorRoadVO"
                                 :key="index">
                                {{ road.roadName }}
                               <span v-if="index !== inspector.inspectorRoadVO.length - 1">,</span>
                            </span>
                    </el-descriptions-item>
                    <el-descriptions-item label="执勤时间">{{inspector.timePeriod}}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag
                                :type="inspector.state === 1 ? 'success' : 'primary'"
                                disable-transitions>{{inspector.state == 1 ? "正常" : "禁用"}}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{inspector.createTime}}</el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
        <el-descriptions style="width: 70%;margin: 45px 0px 30px 80px" direction="vertical" :column="4" border>
            <el-descriptions-item label="录入订单数量">{{this.orderConversionVO.totalOrderCount}}</el-descriptions-item>
            <el-descriptions-item label="已完成订单数量">{{this.orderConversionVO.paidOrderCount}}</el-descriptions-item>
            <el-descriptions-item label="异常订单数量">{{this.orderConversionVO.unusualOrderCount}}</el-descriptions-item>
            <el-descriptions-item label="订单完成率">{{inspector.orderPercentage}}</el-descriptions-item>
        </el-descriptions>


        <el-row style="width: 90%;margin: auto">
            <el-card shadow="always">
                <el-form :inline="true" :model="param">
                    <el-form-item>
                        <el-input v-model="param.orderNumber" placeholder="订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="param.carNumber" placeholder="车牌号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                                v-model="param.timeHorizon"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="param.status" placeholder="状态">
                            <el-option
                                    v-for="o  in orderState"
                                    :key="o.id"
                                    :label="o.state"
                                    :value="o.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="orderAllByParam">查询</el-button>
                        <el-button @click="replacement()" type="info" plain icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->

                <el-row>
                    <el-table
                            ref="multipleTable"
                            :data="orderList"
                            tooltip-effect="dark"
                            style="text-align: center;font-size: 18px">

                        <el-table-column
                                prop="orderNumber"
                                label="订单编号"
                        >
                        </el-table-column>

                        <el-table-column
                                prop="roadName"
                                label="所属路段"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="carNumber"
                                label="车牌号码"
                        >
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
                            <template slot-scope="scope">
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top: 15px"
                                   background
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="pageNum"
                                   :page-sizes="[3, 5, 10, 20]"
                                   :page-size="pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="total">
                    </el-pagination>
                </el-row>
            </el-card>
        </el-row>
        <el-row style="font-weight: bold;margin: 30px 40px 30px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 收费订单管理
        </el-row>
        <el-row style="width: 90%;margin: auto">
            <el-card shadow="always">
                <el-form :inline="true" :model="param2">
                    <el-form-item>
                        <el-input v-model="param2.orderNumber" placeholder="订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="param2.carNumber" placeholder="车牌号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                                v-model="param2.timeHorizon"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="param2.payType" placeholder="支付方式">
                            <el-option
                                    v-for="o  in orderPayType"
                                    :key="o.id"
                                    :label="o.payType"
                                    :value="o.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="orderAll2ByParam">查询</el-button>
                        <el-button @click="replacement2()" type="info" plain icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->

                <el-row>
                    <el-table
                            :data="orderList2"
                            tooltip-effect="dark"
                            style="text-align: center;font-size: 18px">

                        <el-table-column
                                prop="orderNumber"
                                label="订单编号"
                        >
                        </el-table-column>

                        <el-table-column
                                prop="roadName"
                                label="所属路段"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="carNumber"
                                label="车牌号码"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="orderAmount"
                                label="订单金额">
                        </el-table-column>
                        <el-table-column
                                prop="orderAmount"
                                label="收费金额">
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
                            <template slot-scope="scope">
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top: 15px"
                                   background
                                   @size-change="handleSizeChange2"
                                   @current-change="handleCurrentChange2"
                                   :current-page="pageNum2"
                                   :page-sizes="[3, 5, 10, 20]"
                                   :page-size="pageSize2"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="total2">
                    </el-pagination>
                </el-row>
            </el-card>
        </el-row>
        <el-row style="font-weight: bold;margin: 30px 40px">
            <span style="color: #01b4ff; font-size: 22px">|</span> 考勤记录
        </el-row>
        <el-row style="width: 90%;margin: auto">

            <el-row style="font-weight: bold;margin: 30px  0px">
                <el-date-picker
                        v-model="month"
                        type="month"
                        placeholder="选择月份"
                        @change="findByInspectorId"
                        value-format="yyyy-MM">
                </el-date-picker>
            </el-row>
            <el-row style="font-weight: bold;margin: 30px  0px;width: 60%;font-size: 22px">
                <el-descriptions class="margin-top" :column="3">
                    <el-descriptions-item label="出勤天数">{{this.clockInCount.attendanceDayCount}}</el-descriptions-item>
                    <el-descriptions-item label="正常上班">{{this.clockInCount.normalWorkingCount}}</el-descriptions-item>
                    <el-descriptions-item label="异常上班">{{this.clockInCount.abnormalWorkCount}}</el-descriptions-item>
                </el-descriptions>
            </el-row>

            <el-row>
                <el-card shadow="always">

                    <el-table
                            :data="clockInList"
                            tooltip-effect="dark"
                            style="text-align: center;font-size: 18px">
                        <el-table-column
                                prop="dateString"
                                label="订单编号">
                        </el-table-column>
                        <el-table-column
                                prop="timeString"
                                label="订单编号">
                        </el-table-column>
                        <el-table-column
                                prop="clockInStatus"
                                label="打卡状态">
                            <template slot-scope="scope">
                                <el-tag
                                        :type="scope.row.clockInStatus === 1 ? 'success' : 'danger'"
                                        disable-transitions>{{scope.row.clockInStatus == 1 ? "已打卡" : "未打卡"}}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-row>
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
    import order from "@/api/order/order";
    import clockIn from "@/api/clockIn";

    export default {
        data() {
            return {
                clockInCount: {},
                month: null,
                inspector: {},
                orderList: [],
                orderList2: [],
                clockInList: [],
                param: {
                    startTime: '',
                    endTime: ''
                },
                param2: {
                    startTime: '',
                    endTime: ''
                },
                orderConversionVO: {},
                orderState: [
                    {id: 2, state: "已支付"},
                    {id: 4, state: "已退款"},
                    {id: 6, state: "进行中"},
                ],
                orderPayType: [
                    {id: 0, payType: "微信"},
                    {id: 1, payType: "支付宝"}
                ],
                pageNum: 1,
                pageSize: 5,
                total: 0,
                pageNum2: 1,
                pageSize2: 5,
                total2: 0
            }
        },
        methods: {
            findByInspectorIdCount() {
                if (this.month == null) {
                    const currentDate = new Date();
                    const year = currentDate.getFullYear(); // 获取当前年份
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 获取当前月份，并补零
                    this.month = `${year}-${month}`
                }
                // 调用后端接口，传递 inspector.id 和 month 参数
                clockIn.findByInspectorIdCount(this.inspector.id, this.month).then(res => {
                    this.clockInCount = res.data
                })
            },
            findByInspectorId() {
                if (this.month == null) {
                    const currentDate = new Date();
                    const year = currentDate.getFullYear(); // 获取当前年份
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 获取当前月份，并补零
                    this.month = `${year}-${month}`
                }
                // 调用后端接口，传递 inspector.id 和 month 参数
                clockIn.findByInspectorId(this.inspector.id, this.month).then(res => {

                    this.clockInList = res.data
                    for (const c of this.clockInList) {
                        const dateTimeString = c.createTime; // 假设这里是从后端接口获取的日期时间字符串
                        // 将日期时间字符串拆分为日期和时间
                        const [dateString, timeString] = dateTimeString.split(' ');
                        // 处理日期
                        const date = new Date(dateString);
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        c.dateString = year + '.' + month + "." + day

                        // 处理时间
                        const time = new Date(`1970-01-01 ${timeString}`);
                        const hour = time.getHours();
                        const minute = time.getMinutes();
                        c.timeString = hour + '.' + minute
                    }
                });
            },
            //重置
            replacement2() {
                this.param2 = {}
                this.orderAll2ByParam();
            },
            //分页
            handleSizeChange2(val) {
                this.pageSize2 = val;
                this.orderAll2ByParam();
            },
            handleCurrentChange2(val) {
                this.pageNum2 = val;
                this.orderAll2ByParam();
            },
            orderAll2ByParam() {
                if (this.param2.timeHorizon != null) {
                    this.param2.startTime = this.param.timeHorizon[0];
                    this.param2.endTime = this.param.timeHorizon[1];
                }
                order.findAll2ByInspectorId(this.inspector.id, this.pageNum2, this.pageSize2, this.param2).then(res => {
                    this.orderList2 = res.data.list
                    this.total2 = res.data.total
                })
            },
            //重置
            replacement() {
                this.param = {}
                this.orderAllByParam();
            },
            //分页
            handleSizeChange(val) {
                this.pageSize = val;
                this.orderAllByParam();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.orderAllByParam();
            },
            orderAllByParam() {
                if (this.param.timeHorizon != null) {
                    this.param.startTime = this.param.timeHorizon[0];
                    this.param.endTime = this.param.timeHorizon[1];
                }
                order.findAllByInspectorId(this.inspector.id, this.pageNum, this.pageSize, this.param).then(res => {
                    this.orderList = res.data.list
                    this.total = res.data.total
                })
            },
            orderStatusCount() {
                order.orderStatusCount(this.inspector.id).then(res => {
                    this.orderConversionVO = res.data
                })
            }
        },
        created() {
            this.inspector = this.$route.params.data;
            this.orderStatusCount()
            this.orderAllByParam()
            this.orderAll2ByParam()
            this.findByInspectorId()
            this.findByInspectorIdCount()
        }
    }
</script>