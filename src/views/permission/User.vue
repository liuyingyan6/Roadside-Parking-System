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
        <el-row>
            <el-card shadow="always">
                <el-row>
                    <el-form :inline="true" :model="param" >
                        <el-form-item>
                            <el-input v-model="param.userName" placeholder="昵称"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-input v-model="param.phone" placeholder="手机号码"></el-input>
                        </el-form-item>

                        <el-select v-model="param.vx" placeholder="微信绑定">
                            <el-option label="已绑定" value="1"></el-option>
                            <el-option label="未绑定" value="0"></el-option>
                        </el-select>




                        <el-select v-model="param.state" placeholder="状态">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>


                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="findPage">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" icon="el-icon-delete" @click="clear">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%;text-align: center;font-size: 18px"
                        @selection-change="handleSelectionChange">

                    <!-- 复选框 -->
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column
                            prop="userName"
                            label="昵称"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="phone"
                            label="手机号"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="carNum"
                            label="绑定车辆数"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="orderNum"
                            label="订单数量"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="notOrderNum"
                            label="未缴费订单"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="vx"
                            label="微信绑定"
                            width="100">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.vx === 1 ? 'success' : 'primary'"
                                    disable-transitions>{{scope.row.vx == 1 ? "已绑定" : "未绑定"}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="state"
                            label="状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.state === 1 ? 'success' : 'primary'"
                                    disable-transitions>{{scope.row.state == 1 ? "正常" : "禁用"}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="createTime"
                            label="注册时间"
                            width="200">
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button
                                        type="primary" icon="el-icon-view" plain
                                        @click="handleView(scope.$index,scope.row)">查看详情
                                </el-button>

                                <el-button
                                        plain :type="scope.row.state === 1 ? 'danger' : 'success'"
                                        @click="removeRoleById(scope.row)">{{scope.row.state == 1 ?  "禁用" : "恢复" }}
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination style="margin-top: 15px"
                               background
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="param.pageNum"
                               :page-sizes="[3, 5, 10, 20]"
                               :page-size="param.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="tableData.total">
                </el-pagination>
            </el-card>
        </el-row>


    </div>
</template>
<script>

    import user from '@/api/user'
    export default {
        data() {
            return {
                //分页查询提交的参数
                param: {

                },
                //显示的属性
                tableData: {},
                //复选框
                multipleSelection: [],
                pageNum: 1,
                pageSize: 5,
                state:[],
            }
        },
        methods: {

            //查看详情跳转
            handleView(index, row) {
                this.$router.push({path:`/userDetails/${row.id}`});
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
                this.param.pageNum = 1;
                this.param.pageSize = 5;
                this.param = {};
                this.findPage();
            },

            //复选框的方法
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
            this.findPage();
        }
    };
</script>
<style lang="less" scoped>

</style>
