<template>
    <div>
        <el-row :gutter="24" style="margin-bottom: 20px">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>

        <el-row>
            <el-card shadow="always">
                <el-row>
                    <el-form :inline="true" :model="param">
                        <el-form-item label="车牌号">
                            <el-input v-model="param.name" placeholder="请输入巡检员名称"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="param.phone" placeholder="手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="管理路段">
                            <el-input v-model="param.roadName" placeholder="管理路段"></el-input>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" plain @click="findPage">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" plain @click="showDialog()">添加</el-button>
                        <el-button @click="replacement()" type="info"  plain icon="el-icon-refresh">重置</el-button>
                    </el-form>

                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table
                        ref="multipleTable"
                        :data="tableData.list"
                        tooltip-effect="dark"
                        style="width: 100%;text-align: center;font-size: 18px"
                        @selection-change="handleSelectionChange">

                    <!-- 复选框 -->
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="巡检员名称"
                            width="120">
                    </el-table-column>
                    <!-- 数据列 prop属性名 label显示列名  -->
                    <el-table-column
                            prop="phone"
                            label="手机号码"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="roadName"
                            label="管理路段"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="timePeriod"
                            label="执勤时间"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="order"
                            label="订单完成率"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="state"
                            label="状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.state === 1 ? 'success' : 'primary'"
                                    disable-transitions>{{scope.row.state == 1 ? "正常" : "异常"}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="200">
                        <template slot-scope="scope">{{ scope.row.createTime }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button
                                        type="primary" icon="el-icon-view" plain
                                        @click="handleView(scope.$index,scope.row)">详情
                                </el-button>
                                <el-button
                                        type="success" icon="el-icon-edit" plain
                                        @click="handleEdit(scope.$index,scope.row)">编辑
                                </el-button>
                                <el-button
                                        type="danger" icon="el-icon-circle-close" plain
                                        @click="handleDelete(scope.$index, scope.row)">删除
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
                               :current-page="pageNum"
                               :page-sizes="[3, 5, 10, 20]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="tableData.total">
                </el-pagination>
            </el-card>
        </el-row>

        <!-- 添加和修改的对话框 -->
        <el-dialog title="车辆类型管理" :visible.sync="dialogFormVisible" width="500px">
            <!--添加表单-->
            <el-form label-width="120px" :model="form" :rules="rules" ref="ruleForm" :disabled="disabled">

                <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNumber">
                    <el-input v-model="form.carNumber" placeholder="请输入车牌号" autocomplete="off"
                              style="width: 300px;"></el-input>
                </el-form-item>



                <el-form-item label="电机号" :label-width="formLabelWidth" prop="motorNumber">
                    <el-input v-model="form.motorNumber" placeholder="请输入电机号" autocomplete="off"
                              style="width: 300px;"></el-input>
                </el-form-item>

                <el-form-item label="入住时间" :label-width="formLabelWidth" prop="dateRegistration">
                    <el-date-picker
                            v-model="form.dateRegistration" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="年-月-日" style="width: 300px;">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
                    <el-select v-model="form.state" placeholder="请选择车辆类型" style="width: 300px;">
                        <el-option v-for="car in cars" :label="car.state == 1 ? '闲置' : '租赁'"
                                   :value="car.state"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用途" :label-width="formLabelWidth" prop="carUse">
                    <el-select v-model="form.carUse" placeholder="请选择车辆类型" style="width: 300px;">
                        <el-option v-for="car in carUses" :label="car.carUse"
                                   :value="car.carUse"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注信息"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center" >
                <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
                <el-button type="danger" @click="resetForm()">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import inspector from '@/api/staffSys/inspector'
    import user from "@/api/user";

    export default {
        data() {
            return {
                //表单验证的规则
                ruleForm: {},
                rules: {},
                //提交的表单
                form: {},
                //添加的显示
                dialogFormVisible: false,
                //添加的宽度
                formLabelWidth: '120px',
                //分页查询提交的参数
                param: {},
                //显示的属性
                tableData: {},
                //显示车辆类型
                cars: [],
                //查询所有的车辆类型
                carTypes: [],
                carUses: [],
                //复选框
                multipleSelection: [],
                pageNum: 1,
                pageSize: 5
            }
        },
        methods: {
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

            //重置
            replacement() {
                this.pageNum = 1;
                this.pageSize = 5;
                this.findPage();
            },
            //分页查询所有业主
            findPage() {
                inspector.findPage(this.pageNum, this.pageSize, this.param).then(resp => {
                    this.tableData = resp.data;
                });
            },
            //分页
            handleSizeChange(val) {
                this.pageSize = val;
                this.findPage();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.findPage();
            },
            //复选框的方法
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //删除
            handleDelete(index, row) {
                this.$confirm(`此操作将删除${row.typeName}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //调用后台服务器删除
                    axios.delete(`/car/${row.id}`).then(resp => {
                        let result = resp.data;
                        if (result.code === 1) {
                            this.$message.success(result.message);
                        } else {
                            this.$message.error(result.message);
                        }
                    }).finally(() => {
                        //重新加载一次表格的数据
                        this.findPage();
                    });
                })
            },

            //查看显示的对话框
            handleView(index, row) {
                this.dialogFormVisible = true;
                this.form = row;
                this.disabled = true;
            },

            //显示添加的对话框
            showDialog() {
                this.dialogFormVisible = true;
            },
            //编辑
            handleEdit(index, row) {
                this.dialogFormVisible = true;
                let obj = {};
                Object.assign(obj, row);
                this.form = obj;
            },
            //取消显示的对话框
            resetForm() {
                this.dialogFormVisible = false;
            },
            //确定按钮
            saveOrUpdate() {

            },
        },
        created() {
            this.findPage()
        }
    };
</script>
<style lang="less" scoped>

</style>
